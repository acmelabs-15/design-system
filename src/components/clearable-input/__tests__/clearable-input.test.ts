import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeInput } from "../../input/input";
import type { AcmeClearableInput } from "../clearable-input";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.querySelector("acme-clearable-input") as AcmeClearableInput;
  await el.updateComplete;
  const field = el.shadowRoot!.querySelector("acme-input") as AcmeInput;
  await field.updateComplete;
  return el;
};
const field = (el: AcmeClearableInput) => el.shadowRoot!.querySelector("acme-input") as AcmeInput;

describe("acme-clearable-input", () => {
  test("composes a clearable input with the placeholder, label and accessible name", async () => {
    const el = await mount(`<acme-clearable-input label="Email" placeholder="Enter your email..."></acme-clearable-input>`);
    const f = field(el);
    expect(f.className).toBe("input");
    expect(f.hasAttribute("clearable")).toBe(true);
    expect(f.getAttribute("label")).toBe("Email");
    expect(f.getAttribute("aria-label")).toBe("Email");
    expect(f.getAttribute("data-animate")).toBe("false");
    expect(f.shadowRoot!.querySelector("input")!.placeholder).toBe("Enter your email...");
    expect(el.shadowRoot!.querySelector(".clear")).toBeNull();
  });
  test("a value shows the clear button with its Esc key; Escape clears and fires acme-clear", async () => {
    const el = await mount(`<acme-clearable-input value="Some text"></acme-clearable-input>`);
    expect(field(el).getAttribute("data-animate")).toBe("true");
    const btn = el.shadowRoot!.querySelector("button.clear[slot=end]") as HTMLButtonElement;
    expect(btn.querySelector("acme-kbd")!.textContent).toBe("Esc");
    let cleared = 0;
    el.addEventListener("acme-clear", () => cleared++);
    field(el).dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;
    expect(el.value).toBe("");
    expect(cleared).toBe(1);
    expect(el.shadowRoot!.querySelector(".clear")).toBeNull();
  });
  test("cmdk shows the ⌘ K keys in the end place", async () => {
    const el = await mount(`<acme-clearable-input cmdk></acme-clearable-input>`);
    const group = el.shadowRoot!.querySelector(".cmdk[slot=end]") as HTMLElement;
    expect(group.getAttribute("aria-label")).toBe("Press Cmd + K to open the Command Menu");
    expect(group.querySelector("acme-kbd.k-esc .keys [data-key=esc]")!.textContent).toBe("Esc");
    expect(group.querySelector("acme-kbd.k-esc .keys [data-key=cmd]")!.textContent).toBe("⌘");
    expect(group.querySelector("acme-kbd.k-k")!.textContent).toBe("K");
  });
  test("disabled keeps the clear button out of the Tab order and the field disabled; show-clear-button false hides it", async () => {
    const el = await mount(`<acme-clearable-input disabled value="Some text"></acme-clearable-input>`);
    expect(field(el).disabled).toBe(true);
    expect(el.shadowRoot!.querySelector(".clear")!.getAttribute("tabindex")).toBe("-1");
    el.clear();
    expect(el.value).toBe("Some text");
    const hidden = await mount(`<acme-clearable-input show-clear-button="false" value="x"></acme-clearable-input>`);
    expect(hidden.shadowRoot!.querySelector(".clear")).toBeNull();
  });
});
