import { expect, test } from "bun:test";
import { Window as HappyWindow } from "happy-dom";
import { css, html, LitElement } from "lit";
import { responsiveStyleDelivery } from "../../../scripts/responsive-styles";
import { createResponsiveStylePlan } from "../responsive-style-plan";
import { findResponsiveContainer, ResponsiveStyleRenderer, type ResponsiveStyleRendererState, serializeResponsiveStylePlan } from "../style-renderer";

const delivery = responsiveStyleDelivery();
const supports = () => true;

test("serializes generated declarations in exact native window and container query order", () => {
  const plan = createResponsiveStylePlan(
    [
      ["paddingInline", { large: 4 }],
      ["padding", 2],
      ["display", { mediumDown: "block", medium: "none" }],
    ],
    { supports, displayModes: ["block", "none"] },
  );
  const windowCss = serializeResponsiveStylePlan(plan, delivery, { document, target: "window" });
  expect(windowCss).toBe(
    ':host{padding:var(--acme-spacing-2);}@media (width >= 37.5rem){:host{display:none;}}@media (width >= 75rem){:host{padding-inline:var(--acme-spacing-4);}}@media (width < 37.5rem){:host{display:block;}}[part~="root"]{display:inherit;}',
  );
  const containerCss = serializeResponsiveStylePlan(plan, delivery, { document, target: "container", container: "content" });
  expect(containerCss).toContain("@container content (width >= 75rem){:host{padding-inline:var(--acme-spacing-4);}}");
  expect(containerCss).toContain("@container content (width < 37.5rem){:host{display:block;}}");
  expect(serializeResponsiveStylePlan(plan, delivery, { document, target: "container", container: "normal" })).toContain("@container normal ");
  expect(() => serializeResponsiveStylePlan(plan, delivery, { document, target: "container", container: "and" })).toThrow(/container name/i);
});

class RendererProbe extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;
  state: ResponsiveStyleRendererState = { inputs: [], target: "window" };
  readonly diagnostics: unknown[] = [];
  readonly renderer = new ResponsiveStyleRenderer(this, delivery, {
    root: () => (this.renderRoot instanceof ShadowRoot ? this.renderRoot : undefined),
    state: () => this.state,
    displayModes: ["block", "none"],
    supports: () => true,
    diagnostic: (diagnostic) => this.diagnostics.push(diagnostic),
    breakpoints: {
      read: () => ({ medium: 37.5, expanded: 52.5, large: 75, extraLarge: 100 }),
      use: () => {
        this.breakpointUses++;
        return { medium: 37.5, expanded: 52.5, large: 75, extraLarge: 100 };
      },
    },
  });
  breakpointUses = 0;
  render() {
    return html`<div part="root"><slot></slot></div>`;
  }
}
customElements.define("style-renderer-test", RendererProbe);

test("owns one runtime stylesheet, preserves unrelated styles and locks breakpoints on responsive use", async () => {
  const host = document.createElement("style-renderer-test") as RendererProbe;
  document.body.append(host);
  await host.updateComplete;
  const root = host.shadowRoot!;
  const staticSheets = [...root.adoptedStyleSheets];
  const external = new CSSStyleSheet();
  external.replaceSync(":host{color:red}");
  root.adoptedStyleSheets = [...root.adoptedStyleSheets, external];

  host.state = { inputs: [["padding", 2]], target: "window" };
  host.requestUpdate();
  await host.updateComplete;
  expect(host.breakpointUses).toBe(0);
  expect(root.adoptedStyleSheets).toContain(external);
  expect(root.adoptedStyleSheets.length).toBeGreaterThan(1);

  host.state = { inputs: [["padding", { medium: 4 }]], target: "window" };
  host.requestUpdate();
  await host.updateComplete;
  expect(host.breakpointUses).toBe(1);
  expect(root.adoptedStyleSheets).toContain(external);

  const count = root.adoptedStyleSheets.length;
  host.remove();
  expect(root.adoptedStyleSheets).toHaveLength(count);
  document.body.append(host);
  await host.updateComplete;
  expect(root.adoptedStyleSheets).toHaveLength(count);

  host.state = { inputs: [], target: "window" };
  host.requestUpdate();
  await host.updateComplete;
  expect(root.adoptedStyleSheets).toEqual([...staticSheets, external]);
  host.remove();
});

test("missing nearest or named containers retain baseline output and emit one bounded diagnostic", async () => {
  const wrapper = document.createElement("section");
  const host = document.createElement("style-renderer-test") as RendererProbe;
  host.state = { inputs: [["padding", { compact: 2, medium: 4 }]], target: "container", container: "content" };
  wrapper.append(host);
  document.body.append(wrapper);
  await host.updateComplete;
  expect(host.diagnostics).toEqual([{ code: "unresolved-responsive-container", container: "content" }]);
  host.renderer.update();
  expect(host.diagnostics).toHaveLength(1);
  expect(host.shadowRoot!.adoptedStyleSheets.at(-1)!.cssRules[0].cssText).toContain("padding");

  wrapper.style.containerType = "inline-size";
  wrapper.style.containerName = "content";
  expect(findResponsiveContainer(host)).toBe(wrapper);
  expect(findResponsiveContainer(host, "content")).toBe(wrapper);
  expect(findResponsiveContainer(host, "other")).toBeUndefined();
  wrapper.style.display = "contents";
  expect(findResponsiveContainer(host, "content")).toBeUndefined();
  wrapper.style.display = "block";
  host.renderer.update();
  host.remove();
  wrapper.remove();
});

test("defers missing-container diagnostics while disconnected and checks again on reconnect", async () => {
  const host = document.createElement("style-renderer-test") as RendererProbe;
  document.body.append(host);
  await host.updateComplete;
  host.remove();
  host.state = { inputs: [["padding", { medium: 4 }]], target: "container" };
  host.renderer.update();
  expect(host.diagnostics).toEqual([]);
  document.body.append(host);
  await host.updateComplete;
  expect(host.diagnostics).toEqual([{ code: "unresolved-responsive-container" }]);
  host.remove();
});

test("recreates owned delivery in the adopted document and preserves unrelated sheets", async () => {
  const host = document.createElement("style-renderer-test") as RendererProbe;
  host.state = { inputs: [["padding", 2]], target: "window" };
  document.body.append(host);
  await host.updateComplete;
  const root = host.shadowRoot!;
  const first = root.adoptedStyleSheets.at(-1)!;

  const destination = new HappyWindow();
  const view = destination as unknown as Window & typeof globalThis & { ShadyCSS?: { nativeShadow: boolean }; litNonce?: string };
  // Model native adoption after the base class has restored destination-owned static sheets.
  Object.defineProperty(root, "ownerDocument", { value: destination.document, configurable: true });
  let adoptedSheets: CSSStyleSheet[] = [];
  Object.defineProperty(root, "adoptedStyleSheets", {
    configurable: true,
    get: () => adoptedSheets,
    set: (value: CSSStyleSheet[]) => {
      adoptedSheets = [...value];
    },
  });
  const external = new view.CSSStyleSheet();
  external.replaceSync(":host{color:red}");
  adoptedSheets = [external];
  host.renderer.adopted();
  const adopted = root.adoptedStyleSheets.at(-1)!;
  expect(adopted).not.toBe(first);
  expect(adopted).toBeInstanceOf(view.CSSStyleSheet);
  expect(root.adoptedStyleSheets[0]).toBe(external);

  host.state = { inputs: [], target: "window" };
  host.renderer.update();
  expect(root.adoptedStyleSheets).toEqual([external]);
  host.remove();
});

test("uses one nonce-bearing fallback node and removes only that owned node", async () => {
  const view = document.defaultView as Window & typeof globalThis & { ShadyCSS?: { nativeShadow: boolean }; litNonce?: string };
  const previousShady = view.ShadyCSS;
  const previousNonce = view.litNonce;
  view.ShadyCSS = { nativeShadow: false };
  view.litNonce = "runtime";
  try {
    const host = document.createElement("style-renderer-test") as RendererProbe;
    host.state = { inputs: [["padding", 2]], target: "window" };
    document.body.append(host);
    await host.updateComplete;
    const root = host.shadowRoot!;
    const author = document.createElement("style");
    author.textContent = ":host{color:red}";
    root.append(author);
    const owned = [...root.querySelectorAll("style")].find((node) => node !== author && node.textContent?.includes("padding"))!;
    expect(owned.nonce).toBe("runtime");

    host.state = { inputs: [], target: "window" };
    host.renderer.update();
    expect(author.parentNode).toBe(root);
    expect(owned.parentNode).toBeNull();
    host.remove();
  } finally {
    if (previousShady === undefined) {
      delete view.ShadyCSS;
    } else {
      view.ShadyCSS = previousShady;
    }
    if (previousNonce === undefined) {
      delete view.litNonce;
    } else {
      view.litNonce = previousNonce;
    }
  }
});
