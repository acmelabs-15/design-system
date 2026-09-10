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
  test("text prefix and suffix render as cells after the field; rounded is a modifier", async () => {
    const el = await mount(`<acme-input prefix="www." suffix=".com" rounded></acme-input>`);
    const w = wrap(el);
    expect(classes(w)).toBe("rounded with-prefix with-suffix wrap");
    const kids = Array.from(w.children);
    expect(kids.map((k) => k.tagName)).toEqual(["INPUT", "LABEL", "LABEL"]);
    expect(kids[1].className).toBe("prefix");
    expect(kids[1].textContent).toContain("www.");
    expect(kids[2].className).toBe("suffix");
    expect(kids[2].getAttribute("aria-hidden")).toBe("true");
  });
  test("a slotted icon makes a cell; styling false marks the cell plain", async () => {
    const el = await mount(`<acme-input prefix-styling="false" suffix-styling="false"><svg slot="prefix"></svg><svg slot="suffix"></svg></acme-input>`);
    const w = wrap(el);
    expect(classes(w)).toBe("plain-prefix plain-suffix with-prefix with-suffix wrap");
    expect(w.querySelector(".prefix > slot[name=prefix]")).not.toBeNull();
    expect(w.querySelector(".suffix > slot[name=suffix]")).not.toBeNull();
  });
  test("suffix-container false slots the suffix straight into the wrapper", async () => {
    const el = await mount(`<acme-input prefix="vercel/" suffix-container="false" suffix-styling="false"><svg slot="suffix"></svg></acme-input>`);
    const w = wrap(el);
    expect(classes(w)).toBe("plain-suffix with-prefix with-suffix wrap");
    expect(w.querySelector(".suffix")).toBeNull();
    expect(w.querySelector(":scope > slot[name=suffix]")).not.toBeNull();
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
