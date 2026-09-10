import { describe, expect, test } from "bun:test";
import "../../../index";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const els = Array.from(document.body.querySelectorAll("acme-radio")) as any[];
  for (const el of els) await el.updateComplete;
  return els;
};

describe("acme-radio", () => {
  test("renders a native radio with the name, value, aria-label and checked state; no text gives a span root", async () => {
    const [el] = await mount(`<acme-radio name="r" value="one" aria-label="Option 1" checked></acme-radio>`);
    const root = el.shadowRoot.querySelector(".radio");
    expect(root.tagName).toBe("SPAN");
    expect(root.hasAttribute("data-checked")).toBe(true);
    expect(root.querySelector(".control > .dot[aria-hidden]")).not.toBeNull();
    const input = root.querySelector(".control > input");
    expect(input.type).toBe("radio");
    expect(input.getAttribute("name")).toBe("r");
    expect(input.value).toBe("one");
    expect(input.getAttribute("aria-label")).toBe("Option 1");
    expect(input.checked).toBe(true);
  });
  test("select() checks it, unchecks its siblings and dispatches acme-change once", async () => {
    const [a, b] = await mount(`<acme-radio name="r" value="one" checked>Option 1</acme-radio><acme-radio name="r" value="two">Option 2</acme-radio>`);
    expect(a.shadowRoot.querySelector(".radio").tagName).toBe("LABEL");
    expect(a.shadowRoot.querySelector(".radio .text slot")).not.toBeNull();
    const seen: string[] = [];
    document.body.addEventListener("acme-change", (e: any) => seen.push(e.detail.value));
    b.select();
    b.select();
    await b.updateComplete;
    await a.updateComplete;
    expect(b.checked).toBe(true);
    expect(a.checked).toBe(false);
    expect(seen).toEqual(["two"]);
  });
  test("disabled, through the group too, disables the input and blocks select()", async () => {
    const [el] = await mount(`<acme-radio name="r" value="one">Option 1</acme-radio>`);
    el.groupDisabled = true;
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("input").disabled).toBe(true);
    expect(el.shadowRoot.querySelector(".radio").hasAttribute("data-disabled")).toBe(true);
    el.select();
    expect(el.checked).toBe(false);
    el.groupDisabled = false;
    el.skipTab = true;
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("input").getAttribute("tabindex")).toBe("-1");
  });
});
