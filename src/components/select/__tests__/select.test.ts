import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeSelect } from "../select";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeSelect;
  await el.updateComplete;
  return el;
};
const wrap = (el: AcmeSelect) => el.shadowRoot!.querySelector(".wrap") as HTMLElement;
const field = (el: AcmeSelect) => el.shadowRoot!.querySelector("select") as HTMLSelectElement;

describe("acme-select", () => {
  test("the wrapper carries the size and the placeholder is a disabled first option", async () => {
    const el = await mount(`<acme-select size="small" placeholder="Small"><option>Option 1</option></acme-select>`);
    expect(wrap(el).className.trim()).toBe("wrap sm");
    const opts = field(el).querySelectorAll("option");
    expect(opts.length).toBe(2);
    expect(opts[0].disabled).toBe(true);
    expect(opts[0].className).toBe("ph");
    expect(opts[0].value).toBe("Small");
    expect(opts[1].textContent).toBe("Option 1");
    expect(wrap(await mount(`<acme-select size="large"></acme-select>`)).className.trim()).toBe("wrap lg");
  });

  test("tiny is the tier below small and marks the wrapper", async () => {
    expect(wrap(await mount(`<acme-select size="tiny"></acme-select>`)).className.trim()).toBe("wrap tiny");
    // The medium default is written :not(.sm, .lg) in the generated sheet, so tiny must not also
    // take the medium rules: it carries its own class and no size class of another tier.
    const cls = wrap(await mount(`<acme-select size="tiny"></acme-select>`)).className;
    expect(cls).not.toContain("sm");
    expect(cls).not.toContain("lg");
  });

  test("a start place renders and marks the wrapper; a slotted end replaces the chevron", async () => {
    const el = await mount(`<acme-select placeholder="Default"><svg slot="start"></svg><svg slot="end" id="s"></svg></acme-select>`);
    expect(wrap(el).className.trim()).toBe("wrap has-start");
    expect(wrap(el).querySelector(".start slot[name=start]")).not.toBeNull();
    const slot = wrap(el).querySelector(".end slot[name=end]") as HTMLSlotElement;
    expect(slot.assignedElements()[0].id).toBe("s");
  });

  test("the chevron is the end slot's fallback; end=false leaves the place empty", async () => {
    const el = await mount(`<acme-select placeholder="Default"></acme-select>`);
    expect(wrap(el).querySelector(".end slot > svg.chevron")).not.toBeNull();
    expect(wrap(el).querySelector(".start")).toBeNull();
    const none = await mount(`<acme-select placeholder="Default" end="false"></acme-select>`);
    expect(wrap(none).querySelector(".end")).toBeNull();
  });

  test("label, required, error and disabled reach the field and the wrapper", async () => {
    const el = await mount(`<acme-select label="Required field" placeholder="Please select an option" required error="Please select a value."></acme-select>`);
    const s = field(el);
    expect(s.required).toBe(true);
    expect(s.getAttribute("aria-invalid")).toBe("true");
    expect(wrap(el).className.trim()).toBe("wrap error");
    const label = el.shadowRoot!.querySelector("label.field") as HTMLLabelElement;
    expect(label.getAttribute("for")).toBe(s.id);
    expect(label.querySelector(".text")!.textContent).toBe("Required field");
    const err = el.shadowRoot!.querySelector("acme-error")!;
    expect(err.textContent).toBe("Please select a value.");
    expect(err.getAttribute("size")).toBe("small");
    expect(s.getAttribute("aria-describedby")).toBe(err.id);
    const d = await mount(`<acme-select disabled></acme-select>`);
    expect(field(d).disabled).toBe(true);
    expect(wrap(d).className.trim()).toBe("wrap disabled");
  });

  test("a large field's error message is large; with-label=false drops the label element; bypass-casing marks the label raw", async () => {
    const el = await mount(`<acme-select size="large" error="Nope."></acme-select>`);
    expect(el.shadowRoot!.querySelector("acme-error")!.getAttribute("size")).toBe("large");
    const bare = await mount(`<acme-select with-label="false" placeholder="Bare"></acme-select>`);
    expect(bare.shadowRoot!.querySelector("label.field")).toBeNull();
    expect(wrap(bare)).not.toBeNull();
    const raw = await mount(`<acme-select label="my label" bypass-casing></acme-select>`);
    expect(raw.shadowRoot!.querySelector("label.field")!.className).toContain("raw");
  });

  test("value selects the matching option; a value equal to the placeholder reads as empty", async () => {
    const el = await mount(`<acme-select value="banana"><option value="apple">Apple</option><option value="banana">Banana</option></acme-select>`);
    expect(field(el).value).toBe("banana");
    const empty = await mount(`<acme-select placeholder="Pick" value="Pick"><option value="a">A</option></acme-select>`);
    expect(wrap(empty).className.trim()).toBe("wrap empty");
    expect(field(empty).value).toBe("Pick");
  });

  test("the secondary type and the options property", async () => {
    const el = await mount(`<acme-select variant="secondary" placeholder="Topic"></acme-select>`);
    expect(wrap(el).className.trim()).toBe("wrap secondary");
    el.options = ["One", { value: "two", label: "Two", disabled: true }];
    await el.updateComplete;
    const opts = field(el).querySelectorAll("option");
    expect(opts.length).toBe(3);
    expect(opts[1].value).toBe("One");
    expect(opts[2].value).toBe("two");
    expect(opts[2].disabled).toBe(true);
  });

  test("a change on the field updates value and fires acme-change with it", async () => {
    const el = await mount(`<acme-select placeholder="Pick"><option value="a">A</option><option value="b">B</option></acme-select>`);
    let seen = "";
    el.addEventListener("acme-change", (e) => {
      seen = (e as CustomEvent<{ value: string }>).detail.value;
    });
    const s = field(el);
    s.value = "b";
    s.dispatchEvent(new Event("change"));
    expect(el.value).toBe("b");
    expect(seen).toBe("b");
  });

  test("hover and focus land as data attributes on the wrapper", async () => {
    const el = await mount(`<acme-select placeholder="Pick"><option value="a">A</option></acme-select>`);
    const w = wrap(el);
    w.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    expect(w.getAttribute("data-hover")).toBe("true");
    w.dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse" }));
    expect(w.hasAttribute("data-hover")).toBe(false);
    field(el).dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    expect(w.getAttribute("data-focus")).toBe("true");
    field(el).dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
    expect(w.hasAttribute("data-focus")).toBe(false);
  });
});
