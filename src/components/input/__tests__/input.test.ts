import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeInput } from "../input";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.querySelector("acme-input") as AcmeInput;
  await el.updateComplete;
  return el;
};
const wrap = (el: AcmeInput) => el.shadowRoot!.querySelector(".wrap") as HTMLElement;
// The class list as a sorted set: the order classMap writes them follows the render that added each, which carries no meaning.
const classes = (el: HTMLElement) => Array.from(el.classList).sort().join(" ");

describe("acme-input", () => {
  test("renders the wrapper with the field first; size, label, error and disabled reach the DOM", async () => {
    const el = await mount(`<acme-input size="small" label="Label" error="An error message." disabled placeholder="Email"></acme-input>`);
    const w = wrap(el);
    expect(classes(w)).toBe("error sm wrap");
    expect(w.firstElementChild!.tagName).toBe("INPUT");
    const input = w.querySelector("input") as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.placeholder).toBe("Email");
    const field = el.shadowRoot!.querySelector("label.field") as HTMLLabelElement;
    expect(field.querySelector(".text")!.textContent).toBe("Label");
    expect(field.getAttribute("for")).toBe(input.id);
    const err = el.shadowRoot!.querySelector("acme-error") as HTMLElement;
    expect(err.textContent).toBe("An error message.");
    expect(err.getAttribute("size")).toBe("small");
  });
  test("each side renders one cell, whichever of its two places is occupied", async () => {
    const el = await mount(`<acme-input rounded><span slot="start-addon">www.</span><span slot="end-addon">.com</span></acme-input>`);
    const w = wrap(el);
    expect(classes(w)).toBe("has-end has-start rounded wrap");
    const kids = Array.from(w.children);
    expect(kids.map((k) => k.tagName)).toEqual(["INPUT", "LABEL", "LABEL"]);
    expect(kids[1].className).toBe("start");
    expect(kids[2].className).toBe("end");
    expect(kids[2].getAttribute("aria-hidden")).toBe("true");
    expect(w.querySelector(".start > slot[name=start-addon]")).not.toBeNull();
    expect(w.querySelector(".end > slot[name=end-addon]")).not.toBeNull();
  });
  test("an in-field place uses the same cell and marks the side inside", async () => {
    const el = await mount(`<acme-input><svg slot="start"></svg><svg slot="end"></svg></acme-input>`);
    const w = wrap(el);
    // The cell is the same box either way; `start-inside` and `end-inside` carry the ground and the hairline.
    expect(classes(w)).toBe("end-inside has-end has-start start-inside wrap");
    expect(w.querySelector(".start > slot[name=start]")).not.toBeNull();
    expect(w.querySelector(".end > slot[name=end]")).not.toBeNull();
  });
  test("the sides are independent: an add-on at the start, an in-field place at the end", async () => {
    const el = await mount(`<acme-input><span slot="start-addon">vercel/</span><svg slot="end"></svg></acme-input>`);
    const w = wrap(el);
    expect(classes(w)).toBe("end-inside has-end has-start wrap");
    expect(w.querySelector(".start > slot[name=start-addon]")).not.toBeNull();
    expect(w.querySelector(".end > slot[name=end]")).not.toBeNull();
  });
  test("an add-on wins its side, so the two places never render together", async () => {
    const el = await mount(`<acme-input><span slot="end-addon">.com</span><svg slot="end"></svg></acme-input>`);
    const w = wrap(el);
    expect(classes(w)).toBe("has-end wrap");
    expect(Array.from(w.children).map((k) => k.tagName)).toEqual(["INPUT", "LABEL"]);
    expect(w.querySelector(".end > slot[name=end-addon]")).not.toBeNull();
    expect(w.querySelector("slot[name=end]")).toBeNull();
  });
  test("a side with nothing in it renders no cell at all", async () => {
    const el = await mount(`<acme-input><svg slot="end"></svg></acme-input>`);
    const w = wrap(el);
    expect(classes(w)).toBe("end-inside has-end wrap");
    expect(Array.from(w.children).map((k) => k.tagName)).toEqual(["INPUT", "LABEL"]);
    expect(w.querySelector(".start")).toBeNull();
  });
  test("input events carry the value; width and the large icon size land on the wrapper", async () => {
    const el = await mount(`<acme-input size="large" width="221px"></acme-input>`);
    expect(wrap(el).getAttribute("style")).toContain("--acme-icon-size:24px");
    expect(wrap(el).getAttribute("style")).toContain("width:221px");
    const seen: string[] = [];
    el.addEventListener("acme-input", (e) => seen.push((e as CustomEvent).detail.value));
    const input = wrap(el).querySelector("input") as HTMLInputElement;
    input.value = "hi";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(el.value).toBe("hi");
    expect(seen).toEqual(["hi"]);
  });
  test("hover lands on the wrapper as data-hover", async () => {
    const el = await mount(`<acme-input></acme-input>`);
    wrap(el).dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    expect(wrap(el).getAttribute("data-hover")).toBe("true");
  });
});
