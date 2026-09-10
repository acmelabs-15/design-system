import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeButton } from "../button";

const mount = async (html: string) => {
  document.body.innerHTML = html;
  const el = document.body.firstElementChild as AcmeButton;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeButton) => el.shadowRoot!.querySelector(".btn") as HTMLElement;

describe("acme-button", () => {
  test("renders a root with data-prefix/data-suffix and a label span", async () => {
    const el = await mount(`<acme-button size="small">Upload</acme-button>`);
    const b = root(el);
    expect(b.tagName).toBe("BUTTON");
    expect(b.className.trim()).toBe("btn sm");
    expect(b.getAttribute("data-prefix")).toBe("false");
    expect(b.getAttribute("data-suffix")).toBe("false");
    expect(b.getAttribute("style")).toContain("--acme-icon-size:16px");
    expect(b.querySelector(".label slot:not([name])")).not.toBeNull();
    expect(b.querySelector(".prefix")).toBeNull();
  });

  test("variant default is the primary look (no modifier); tiny, svg-only and shapes map to classes", async () => {
    const el = await mount(`<acme-button variant="default" size="tiny" shape="circle" svg-only aria-label="Upload"><svg></svg></acme-button>`);
    const b = root(el);
    expect(b.className.trim()).toBe("btn tiny circle icon");
    expect(b.getAttribute("aria-label")).toBe("Upload");
  });

  test("a prefix in the slot renders the prefix span and data-prefix", async () => {
    const el = await mount(`<acme-button><svg slot="prefix"></svg>Export</acme-button>`);
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const b = root(el);
    expect(b.getAttribute("data-prefix")).toBe("true");
    expect(b.querySelector(".prefix slot[name=prefix]")).not.toBeNull();
  });

  test("loading shows the spinner in the prefix, disables the button and announces busy", async () => {
    const el = await mount(`<acme-button loading>Saving</acme-button>`);
    const b = root(el) as HTMLButtonElement;
    expect(b.getAttribute("aria-busy")).toBe("true");
    expect(b.disabled).toBe(true);
    expect(b.className).toContain("loading");
    expect(b.querySelector(".prefix[aria-hidden] acme-spinner")).not.toBeNull();
    expect(b.getAttribute("data-prefix")).toBe("true");
  });

  test("href renders an anchor with role=link", async () => {
    const el = await mount(`<acme-button href="/deploy">Deploy</acme-button>`);
    const a = root(el) as HTMLAnchorElement;
    expect(a.tagName).toBe("A");
    expect(a.getAttribute("role")).toBe("link");
    expect(a.getAttribute("href")).toBe("/deploy");
    expect(a.className).toContain("link");
  });

  test("custom colors become --button-custom-* variables and width sets min and max", async () => {
    const el = await mount(`<acme-button variant="custom" width="160" normal='{"foreground":"#fff","background":"var(--ds-blue-700)"}' hover='{"background":"#0B7BFE"}'>Upgrade to Pro</acme-button>`);
    const b = root(el);
    expect(b.hasAttribute("data-custom-button")).toBe(true);
    const style = b.getAttribute("style") ?? "";
    expect(style).toContain("min-width:160px");
    expect(style).toContain("max-width:160px");
    expect(style).toContain("--button-custom-bg:var(--ds-blue-700)");
    expect(style).toContain("--button-custom-bg-hover:#0B7BFE");
  });

  test("an element-only child marks the label as a flex box; text does not; svg-only wins", async () => {
    const el = await mount(`<acme-button aria-label="Menu" aria-haspopup="menu" aria-expanded="false" aria-controls="m1"><svg></svg></acme-button>`);
    const b = root(el);
    expect(b.className.trim()).toBe("btn el");
    expect(b.getAttribute("aria-haspopup")).toBe("menu");
    expect(b.getAttribute("aria-expanded")).toBe("false");
    expect(b.getAttribute("aria-controls")).toBe("m1");
    const text = await mount(`<acme-button>Save</acme-button>`);
    expect(root(text).className.trim()).toBe("btn");
    expect(root(text).hasAttribute("aria-haspopup")).toBe(false);
    const icon = await mount(`<acme-button svg-only aria-label="Up"><svg></svg></acme-button>`);
    expect(root(icon).className.trim()).toBe("btn icon");
  });

  test("interaction states land as data attributes on the root", async () => {
    const el = await mount(`<acme-button>Hover</acme-button>`);
    const b = root(el);
    b.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    expect(b.getAttribute("data-hover")).toBe("true");
    b.dispatchEvent(new PointerEvent("pointerdown", { pointerType: "mouse", button: 0 }));
    expect(b.getAttribute("data-active")).toBe("true");
    b.dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse" }));
    expect(b.hasAttribute("data-hover")).toBe(false);
    expect(b.hasAttribute("data-active")).toBe(false);
    b.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "touch" }));
    expect(b.hasAttribute("data-hover")).toBe(false);
  });
});
