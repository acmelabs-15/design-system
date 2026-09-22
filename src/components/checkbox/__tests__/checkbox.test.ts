import { describe, expect, test } from "bun:test";
import "../../../all";
import type { AcmeCheckbox } from "../checkbox";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.querySelector("acme-checkbox") as AcmeCheckbox;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeCheckbox) => el.shadowRoot!.querySelector("[part=root]") as HTMLElement;

describe("acme-checkbox", () => {
  test("renders one native checkbox with named indicator, label and description parts", async () => {
    const el = await mount(`<acme-checkbox>Option 1</acme-checkbox>`);
    const r = root(el);
    expect(r.tagName).toBe("LABEL");
    expect(r.querySelector(".control > input[type=checkbox]")).not.toBeNull();
    expect(r.querySelector("[part=indicator][aria-hidden]")).not.toBeNull();
    expect(r.querySelector("[part=label] > slot")).not.toBeNull();
    expect(r.querySelector("[part=description] > slot[name=description]")).not.toBeNull();
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

test("current checked state and explicit reset defaults remain separate", async () => {
  const checkbox = await mount("<acme-checkbox checked>Option</acme-checkbox>");
  checkbox.checked = false;
  expect(checkbox.defaultChecked).toBe(true);
  expect(checkbox.hasAttribute("checked")).toBe(true);
  checkbox.defaultChecked = false;
  checkbox.checked = true;
  checkbox.formResetCallback();
  expect(checkbox.checked).toBe(false);
  expect(checkbox.shadowRoot!.querySelector("input")!.checked).toBe(false);
});
test("programmatic changes stay silent and user changes report the cleared mixed state", async () => {
  const checkbox = await mount("<acme-checkbox>Option</acme-checkbox>");
  const changes: unknown[] = [];
  checkbox.addEventListener("acme-change", (event) => changes.push((event as CustomEvent).detail));
  checkbox.checked = true;
  checkbox.indeterminate = true;
  expect(changes).toHaveLength(0);
  checkbox.click();
  expect(changes).toEqual([{ checked: false, indeterminate: false }]);
  expect(checkbox.indeterminate).toBe(false);
});
