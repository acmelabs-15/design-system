import { expect, test } from "bun:test";
import { css, html } from "lit";
import { AcmeElement } from "../base";

class StaticStylesProbe extends AcmeElement {
  static styles = css`
    :host {
      display: block;
    }
  `;
  value = "first";
  alternate = false;
  get root(): ShadowRoot {
    return this.renderRoot as ShadowRoot;
  }
  get boundary() {
    return this.renderOptions.renderBefore;
  }
  render() {
    return this.alternate ? html`<p>${this.value}</p>` : html`<span>${this.value}</span>`;
  }
}
customElements.define("base-static-styles-probe", StaticStylesProbe);

class ClosedStylesProbe extends StaticStylesProbe {
  static shadowRootOptions = { mode: "closed" as const };
}
customElements.define("base-closed-styles-probe", ClosedStylesProbe);

class LightDomStylesProbe extends StaticStylesProbe {
  host = this;
  protected createRenderRoot(): HTMLElement {
    return this;
  }
}
customElements.define("base-light-dom-styles-probe", LightDomStylesProbe);

test("allows light DOM render roots with a host property without applying shadow styles", async () => {
  const element = document.createElement("base-light-dom-styles-probe") as LightDomStylesProbe;
  document.body.append(element);
  await element.updateComplete;
  expect(element.querySelector("span")?.textContent).toBe("first");
  expect(element.querySelector("style")).toBeNull();
  const children = [...element.childNodes];
  element.adoptedCallback();
  expect(element.querySelectorAll("style")).toHaveLength(0);
  expect([...element.childNodes]).toEqual(children);
  element.remove();
});

test("restores styles through the render root when the shadow root is closed", async () => {
  const element = document.createElement("base-closed-styles-probe") as ClosedStylesProbe;
  document.body.append(element);
  await element.updateComplete;
  expect(element.shadowRoot).toBeNull();
  expect(element.root.adoptedStyleSheets).toHaveLength(1);
  element.root.adoptedStyleSheets = [];
  element.adoptedCallback();
  expect(element.root.adoptedStyleSheets).toHaveLength(1);
  element.remove();
});

test("keeps Lit's rendering boundary when inert-document style nodes are removed", async () => {
  const inert = document.implementation.createHTMLDocument("Detached");
  const element = document.createElement("base-static-styles-probe") as StaticStylesProbe;
  document.body.append(element);
  await element.updateComplete;
  // Model the document changes: happy-dom does not move a shadow root's ownerDocument during adoption.
  Object.defineProperty(element.root, "ownerDocument", { value: inert, configurable: true });
  element.adoptedCallback();
  expect(element.root.querySelector("style")).not.toBeNull();
  expect(element.root.querySelector("span")?.textContent).toBe("first");
  const boundary = element.boundary;

  Reflect.deleteProperty(element.root, "ownerDocument");
  element.adoptedCallback();
  element.value = "second";
  element.alternate = true;
  element.requestUpdate();
  await element.updateComplete;
  expect(element.root.querySelector("style")).toBeNull();
  expect(element.root.adoptedStyleSheets).toHaveLength(1);
  expect(element.boundary).toBe(boundary);
  expect(boundary?.parentNode).toBe(element.root);
  expect(element.root.querySelector("p")?.textContent).toBe("second");
  element.remove();
});
