import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeCheckbox } from "../checkbox";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.querySelector("acme-checkbox") as AcmeCheckbox;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeCheckbox) => el.shadowRoot!.querySelector(".checkbox") as HTMLElement;

describe("acme-checkbox", () => {
  test("renders a label root with the hidden checkbox, the box with check and dash, and the text slot", async () => {
    const el = await mount(`<acme-checkbox>Option 1</acme-checkbox>`);
    const r = root(el);
    expect(r.tagName).toBe("LABEL");
    expect(r.querySelector(".control > input[type=checkbox]")).not.toBeNull();
    expect(r.querySelector(".control > .box[aria-hidden] svg path")).not.toBeNull();
    expect(r.querySelector(".control > .box svg line")).not.toBeNull();
    expect(r.querySelector(".text > slot")).not.toBeNull();
    expect(r.hasAttribute("data-checked")).toBe(false);
  });
  test("checked, indeterminate and disabled reach the native input and the root's data attributes", async () => {
    const el = await mount(`<acme-checkbox checked disabled indeterminate>Disabled</acme-checkbox>`);
    const input = root(el).querySelector("input") as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(input.indeterminate).toBe(true);
    expect(input.checked).toBe(true);
    for (const a of ["data-checked", "data-disabled", "data-indeterminate"]) expect(root(el).hasAttribute(a)).toBe(true);
  });
  test("a change on the input updates checked, clears indeterminate and emits acme-change", async () => {
    const el = await mount(`<acme-checkbox indeterminate>Option 1</acme-checkbox>`);
    let got: boolean | undefined;
    el.addEventListener("acme-change", (e) => {
      got = (e as CustomEvent).detail.checked;
    });
    const input = root(el).querySelector("input") as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(el.checked).toBe(true);
    expect(el.indeterminate).toBe(false);
    expect(got).toBe(true);
    expect(root(el).hasAttribute("data-checked")).toBe(true);
    expect(root(el).hasAttribute("data-indeterminate")).toBe(false);
  });
  test("interaction states land on the label root, except while disabled", async () => {
    const el = await mount(`<acme-checkbox>Option 1</acme-checkbox>`);
    const r = root(el);
    r.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    expect(r.getAttribute("data-hover")).toBe("true");
    r.dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse" }));
    el.disabled = true;
    await el.updateComplete;
    r.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    expect(r.hasAttribute("data-hover")).toBe(false);
  });
});
