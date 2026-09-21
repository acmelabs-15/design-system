import { afterEach, expect, test } from "bun:test";
import { AcmeBox } from "../box";
import { styleInputSchema } from "../../../shared/style-input-schema";
import type { StructuralTag } from "../../../shared/layout-element";
if (!customElements.get("acme-box")) customElements.define("acme-box", AcmeBox);
afterEach(() => document.body.replaceChildren());
async function mount(markup = "<acme-box>Content</acme-box>") {
  document.body.innerHTML = markup;
  const box = document.querySelector("acme-box") as AcmeBox;
  await box.updateComplete;
  return box;
}
test("all structural tags keep one semantic root and the same author-owned content", async () => {
  const box = await mount("<acme-box><button>Action</button></acme-box>");
  const child = box.firstElementChild;
  for (const tag of ["div", "span", "section", "article", "main", "nav", "aside", "header", "footer"] as StructuralTag[]) {
    box.as = tag;
    await box.updateComplete;
    expect(box.shadowRoot!.querySelector('[part="root"]')?.localName).toBe(tag);
    expect(box.firstElementChild).toBe(child);
  }
});
test("all common inputs have accessors and observed attributes outside Lit metadata", async () => {
  const box = await mount();
  for (const [key, metadata] of Object.entries(styleInputSchema)) {
    expect(key in box).toBe(true);
    expect(AcmeBox.observedAttributes).toContain(metadata.attribute);
    expect(AcmeBox.elementProperties.has(key)).toBe(false);
  }
  expect(box.padding).toBeUndefined();
  expect(box.display).toBeUndefined();
  expect(box.responsiveTarget).toBe("window");
});
test("HTML scalars and structured properties share canonical inputs; removal clears one property", async () => {
  const box = await mount(`<acme-box padding-inline="2" padding="4"></acme-box>`);
  box.padding = { compact: 4, expanded: 8 };
  expect(box.paddingInline).toBe(2);
  expect(box.padding).toEqual({ compact: 4, expanded: 8 });
  box.removeAttribute("padding");
  expect(box.padding).toBeUndefined();
  expect(box.paddingInline).toBe(2);
  box.padding = 0;
  expect(box.padding).toBe(0);
});
test("Box rejects an arrangement display and keeps native semantic naming on its root", async () => {
  const box = await mount('<acme-box as="section" role="region" aria-label="Account"></acme-box>');
  expect(() => {
    box.display = "flex";
  }).toThrow();
  const root = box.shadowRoot!.querySelector('[part="root"]')!;
  expect(root.getAttribute("role")).toBe("region");
  expect(root.getAttribute("aria-label")).toBe("Account");
  expect(Element.prototype.hasAttribute.call(box, "role")).toBe(false);
});
