import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeSlider } from "../slider";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.querySelector("acme-slider") as AcmeSlider;
  await el.updateComplete;
  return el;
};
const q = <T extends Element = HTMLElement>(el: AcmeSlider, sel: string) => el.shadowRoot!.querySelector(sel) as T;
const qa = (el: AcmeSlider, sel: string) => Array.from(el.shadowRoot!.querySelectorAll(sel)) as HTMLElement[];
const inputs = (el: AcmeSlider) => qa(el, ".thumb input") as HTMLInputElement[];
const listen = (el: AcmeSlider) => {
  const seen: string[] = [];
  el.addEventListener("acme-change", (e) => seen.push(`change:${(e as CustomEvent).detail.value}`));
  el.addEventListener("acme-commit", (e) => seen.push(`commit:${(e as CustomEvent).detail.value}`));
  return seen;
};
const key = (input: HTMLInputElement, k: string, init: KeyboardEventInit = {}) => input.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, ...init }));
/** Lays the control out 200px wide, so a pointer position reads as a value. */
const layout = (el: AcmeSlider) => {
  const control = q(el, ".control");
  control.getBoundingClientRect = () => ({ left: 0, right: 200, top: 0, bottom: 14, width: 200, height: 14, x: 0, y: 0, toJSON: () => ({}) });
  for (const t of qa(el, ".thumb")) {
    const pct = parseFloat(t.style.insetInlineStart || t.style.getPropertyValue("inset-inline-start"));
    const x = (pct / 100) * 200;
    t.getBoundingClientRect = () => ({ left: x - 3, right: x + 3, top: 0, bottom: 14, width: 6, height: 14, x: x - 3, y: 0, toJSON: () => ({}) });
  }
  return control;
};
const pointer = (type: string, target: EventTarget, clientX: number, extra: PointerEventInit = {}) =>
  target.dispatchEvent(new PointerEvent(type, { bubbles: true, composed: true, cancelable: true, button: 0, buttons: 1, pointerId: 1, clientX, ...extra }));

describe("acme-slider", () => {
  test("a single value draws one thumb, fills the track to it and has no value text; a bare number is accepted", async () => {
    const el = await mount(`<acme-slider value="[40]"></acme-slider>`);
    expect(qa(el, ".thumb").length).toBe(1);
    expect(q(el, ".slider").className.trim()).toBe("slider");
    expect(q(el, ".fill").getAttribute("style")).toBe("position:relative;height:inherit;inset-inline-start:0;width:40%");
    expect(q(el, ".thumb").getAttribute("style")).toBe("position:absolute;inset-inline-start:40%;top:50%;translate:-50% -50%");
    const input = inputs(el)[0];
    expect(input.type).toBe("range");
    expect(input.getAttribute("aria-valuenow")).toBe("40");
    expect(input.hasAttribute("aria-valuetext")).toBe(false);
    expect(input.getAttribute("style")).toContain("clip-path:inset(50%)");
    expect(q(el, ".group").getAttribute("role")).toBe("group");
    expect(q(el, ".start-input")).toBeNull();
    expect(q(el, "acme-label")).toBeNull();
    const plain = await mount(`<acme-slider value="25"></acme-slider>`);
    expect(plain.value).toEqual([25]);
    const bare = await mount(`<acme-slider min="10"></acme-slider>`);
    expect(inputs(bare)[0].getAttribute("aria-valuenow")).toBe("10");
  });

  test("a range draws two thumbs, fills between them, speaks start and end, and the fields are small inputs with the reference labels", async () => {
    const el = await mount(`<acme-slider show-start-input show-end-input value="[50, 75]"></acme-slider>`);
    expect(qa(el, ".thumb").length).toBe(2);
    expect(q(el, ".fill").getAttribute("style")).toBe("position:relative;height:inherit;inset-inline-start:50%;width:25%");
    expect(qa(el, ".thumb")[1].getAttribute("style")).toContain("inset-inline-start:75%");
    const [a, b] = inputs(el);
    expect(a.getAttribute("aria-valuetext")).toBe("50 start range");
    expect(b.getAttribute("aria-valuetext")).toBe("75 end range");
    const start = q(el, ".start-input");
    const end = q(el, ".end-input");
    expect(start.tagName).toBe("ACME-INPUT");
    expect(start.getAttribute("size")).toBe("small");
    expect(start.getAttribute("type")).toBe("text");
    expect(start.getAttribute("aria-label")).toBe("Starting range value");
    expect(end.getAttribute("type")).toBe("number");
    expect(end.getAttribute("aria-label")).toBe("Ending range value");
    expect((start as HTMLInputElement).value).toBe("50");
    expect((end as HTMLInputElement).value).toBe("75");
    // A typed number replaces the value at its index, as typed, and reports a change.
    const seen = listen(el);
    end.dispatchEvent(new CustomEvent("acme-input", { detail: { value: "90" }, bubbles: true, composed: true }));
    expect(el.value).toEqual([50, 90]);
    expect(seen).toEqual(["change:50,90"]);
  });

  test("disabled reaches the group, its parts, the range inputs and the fields", async () => {
    const el = await mount(`<acme-slider disabled show-start-input show-end-input value="[50, 75]"></acme-slider>`);
    for (const sel of [".group", ".control", ".track", ".fill", ".thumb"]) expect(q(el, sel).hasAttribute("data-disabled")).toBe(true);
    for (const i of inputs(el)) expect(i.disabled).toBe(true);
    expect(q(el, ".start-input").hasAttribute("disabled")).toBe(true);
    expect(q(el, ".end-input").hasAttribute("disabled")).toBe(true);
    const on = await mount(`<acme-slider value="[50]"></acme-slider>`);
    expect(q(on, ".group").hasAttribute("data-disabled")).toBe(false);
  });

  test("the label is a label element above the row, tied to the first thumb or to the start field; full-width marks the root", async () => {
    const el = await mount(`<acme-slider label="Volume" bypass-casing full-width value="[40]"></acme-slider>`);
    const label = q<HTMLLabelElement>(el, ".label");
    expect(label.tagName).toBe("LABEL");
    expect(label.className.trim()).toBe("label plain");
    expect(label.querySelector(".text")?.textContent).toBe("Volume");
    expect(label.htmlFor).toBe(inputs(el)[0].id);
    expect(label.nextElementSibling?.className).toBe("row");
    expect(q(el, ".slider").className.trim()).toBe("slider full");
    expect(inputs(el)[0].getAttribute("aria-label")).toBe("Volume");
    label.click();
    expect(el.shadowRoot!.activeElement).toBe(inputs(el)[0]);
    const cased = await mount(`<acme-slider label="Volume" value="[40]"></acme-slider>`);
    expect(q(cased, ".label").className.trim()).toBe("label");
    const withField = await mount(`<acme-slider label="Range" show-start-input value="[40, 60]"></acme-slider>`);
    expect(q<HTMLLabelElement>(withField, ".label").htmlFor).toBe(q(withField, ".start-input").id);
  });

  test("keys move a thumb by a step, a large step, or to a bound, and commit each move", async () => {
    const el = await mount(`<acme-slider value="[40]"></acme-slider>`);
    const seen = listen(el);
    let input = inputs(el)[0];
    key(input, "ArrowRight");
    expect(el.value).toEqual([41]);
    await el.updateComplete;
    input = inputs(el)[0];
    key(input, "ArrowLeft", { shiftKey: true });
    expect(el.value).toEqual([31]);
    await el.updateComplete;
    input = inputs(el)[0];
    key(input, "PageUp");
    expect(el.value).toEqual([41]);
    await el.updateComplete;
    input = inputs(el)[0];
    key(input, "End");
    expect(el.value).toEqual([100]);
    await el.updateComplete;
    input = inputs(el)[0];
    key(input, "Home");
    expect(el.value).toEqual([0]);
    expect(seen).toEqual(["change:41", "commit:41", "change:31", "commit:31", "change:41", "commit:41", "change:100", "commit:100", "change:0", "commit:0"]);
    await el.updateComplete;
    const e = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
    inputs(el)[0].dispatchEvent(e);
    expect(e.defaultPrevented).toBe(false);
  });

  test("in a range a key keeps a thumb between its neighbours and End and Home stop at them", async () => {
    const el = await mount(`<acme-slider min-steps-between-values="2" value="[50, 52]"></acme-slider>`);
    key(inputs(el)[0], "ArrowRight");
    expect(el.value).toEqual([50, 52]);
    await el.updateComplete;
    key(inputs(el)[1], "Home");
    expect(el.value).toEqual([50, 52]);
    await el.updateComplete;
    const wide = await mount(`<acme-slider value="[50, 75]"></acme-slider>`);
    key(inputs(wide)[0], "End");
    expect(wide.value).toEqual([75, 75]);
  });

  test("a press on the track sets the nearest thumb and focuses it, a drag follows the pointer, and release commits once", async () => {
    const el = await mount(`<acme-slider value="[40]"></acme-slider>`);
    const seen = listen(el);
    const control = layout(el);
    const down = new PointerEvent("pointerdown", { bubbles: true, composed: true, cancelable: true, button: 0, buttons: 1, pointerId: 1, clientX: 100 });
    control.dispatchEvent(down);
    expect(down.defaultPrevented).toBe(true);
    expect(el.value).toEqual([50]);
    await el.updateComplete;
    expect(q(el, ".thumb").hasAttribute("data-dragging")).toBe(true);
    expect(q(el, ".group").hasAttribute("data-dragging")).toBe(true);
    expect(el.shadowRoot!.activeElement).toBe(inputs(el)[0]);
    pointer("pointermove", window, 150);
    expect(el.value).toEqual([75]);
    pointer("pointermove", window, 500);
    expect(el.value).toEqual([100]);
    pointer("pointerup", window, 500, { buttons: 0 });
    await el.updateComplete;
    expect(q(el, ".thumb").hasAttribute("data-dragging")).toBe(false);
    expect(seen).toEqual(["change:50", "change:75", "change:100", "commit:100"]);
    // A disabled slider ignores the pointer.
    const off = await mount(`<acme-slider disabled value="[40]"></acme-slider>`);
    pointer("pointerdown", layout(off), 100);
    expect(off.value).toEqual([40]);
  });

  test("dragging a range thumb pushes its neighbour along and lets it fall back to where it stood", async () => {
    const el = await mount(`<acme-slider value="[50, 75]"></acme-slider>`);
    const seen = listen(el);
    layout(el);
    const first = qa(el, ".thumb")[0];
    // A press on the thumb itself keeps the value: the thumb moves from where it is.
    pointer("pointerdown", first.querySelector("input")!, 100);
    expect(el.value).toEqual([50, 75]);
    pointer("pointermove", window, 170);
    expect(el.value).toEqual([85, 85]);
    pointer("pointermove", window, 120);
    expect(el.value).toEqual([60, 75]);
    pointer("pointerup", window, 120, { buttons: 0 });
    expect(seen).toEqual(["change:85,85", "change:60,75", "commit:60,75"]);
  });

  test("focus inside a thumb lands on the thumb as data-focus-within, and a visible focus as data-focus", async () => {
    const el = await mount(`<acme-slider value="[40, 60]"></acme-slider>`);
    const [first, second] = qa(el, ".thumb");
    const input = first.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focusin", { bubbles: true, composed: true }));
    expect(first.getAttribute("data-focus-within")).toBe("true");
    expect(first.hasAttribute("data-focus")).toBe(false);
    expect(second.hasAttribute("data-focus-within")).toBe(false);
    input.dispatchEvent(new FocusEvent("focusout", { bubbles: true, composed: true }));
    expect(first.hasAttribute("data-focus-within")).toBe(false);
    // The keyboard makes the focus visible: the input is refocused and reports focus-visible.
    input.matches = (sel: string) => sel === ":focus-visible";
    input.dispatchEvent(new FocusEvent("focusin", { bubbles: true, composed: true }));
    expect(first.getAttribute("data-focus")).toBe("true");
    key(input, "ArrowUp");
    expect(el.value).toEqual([41, 60]);
    // The focused thumb of a range sits above the other, and stays above it after the focus leaves.
    inputs(el)[0].dispatchEvent(new FocusEvent("focus"));
    await el.updateComplete;
    expect(qa(el, ".thumb")[0].style.zIndex).toBe("2");
    inputs(el)[0].dispatchEvent(new FocusEvent("blur"));
    await el.updateComplete;
    expect(qa(el, ".thumb")[0].style.zIndex).toBe("1");
    expect(qa(el, ".thumb")[1].style.zIndex).toBe("");
  });

  test("a form reset restores the initial value", async () => {
    const el = await mount(`<form><acme-slider name="v" value="[30]"></acme-slider></form>`);
    key(inputs(el)[0], "ArrowRight");
    expect(el.value).toEqual([31]);
    el.formResetCallback();
    expect(el.value).toEqual([30]);
  });
});
