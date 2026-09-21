import { afterEach, expect, test } from "bun:test";
import "../../../all";
import type { AcmeFlex } from "../flex";
afterEach(() => document.body.replaceChildren());
async function mount(markup = "<acme-flex></acme-flex>") {
  document.body.innerHTML = markup;
  const flex = document.querySelector("acme-flex") as AcmeFlex;
  await flex.updateComplete;
  return flex;
}
test("Flex arrangement inputs are absent until supplied", async () => {
  const flex = await mount();
  expect(flex.gap).toBeUndefined();
  expect(flex.flexDirection).toBeUndefined();
  expect(flex.alignItems).toBeUndefined();
  flex.gap = 0;
  flex.flexDirection = { compact: "column", expanded: "row" };
  await flex.updateComplete;
  expect(flex.gap).toBe(0);
  expect(flex.flexDirection).toEqual({ compact: "column", expanded: "row" });
});
test("Flex has its own display modes and retains semantics and children", async () => {
  const flex = await mount('<acme-flex as="nav"><button>Link</button></acme-flex>');
  const child = flex.firstElementChild;
  expect(() => {
    flex.display = "block";
  }).toThrow();
  flex.display = "inline-flex";
  flex.as = "section";
  await flex.updateComplete;
  expect(flex.shadowRoot!.querySelector('[part="root"]')?.localName).toBe("section");
  expect(flex.firstElementChild).toBe(child);
});
