import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeCopyButton } from "../copy-button";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeCopyButton;
  await el.updateComplete;
  return el;
};
const button = (el: AcmeCopyButton) => el.shadowRoot!.querySelector("acme-button")!;
const stack = (el: AcmeCopyButton) => el.shadowRoot!.querySelector(".stack") as HTMLElement;

describe("acme-copy-button", () => {
  test("composes a secondary square icon-only button named by its label, around a check and a copy layer", async () => {
    const el = await mount(`<acme-copy-button text-to-copy="lipsum" label="copy text"></acme-copy-button>`);
    const b = button(el);
    expect(b.getAttribute("variant")).toBe("secondary");
    expect(b.getAttribute("shape")).toBe("square");
    expect(b.getAttribute("size")).toBe("medium");
    expect(b.hasAttribute("svg-only")).toBe(true);
    expect(b.getAttribute("aria-label")).toBe("copy text");
    expect(el.textToCopy).toBe("lipsum");
    const s = stack(el);
    expect(s.className.trim()).toBe("stack");
    expect(s.children[0].className).toBe("check");
    expect(s.children[1].className).toBe("copy");
    expect(s.querySelector(".copy slot[name=icon]")).not.toBeNull();
    expect(el.shadowRoot!.querySelector("[role=status]")).toBeNull();
  });

  test("copied swaps the layers and announces it", async () => {
    const el = await mount(`<acme-copy-button text-to-copy="x" copied></acme-copy-button>`);
    expect(stack(el).classList.contains("copied")).toBe(true);
    const status = el.shadowRoot!.querySelector("[role=status]")!;
    expect(status.getAttribute("aria-live")).toBe("assertive");
    expect(status.textContent).toBe("Copied!");
  });

  test("a click writes the clipboard, fires acme-copy and shows the check for a second", async () => {
    const written: string[] = [];
    Object.defineProperty(navigator, "clipboard", { value: { writeText: async (t: string) => void written.push(t) }, configurable: true });
    const el = await mount(`<acme-copy-button text-to-copy="lipsum"></acme-copy-button>`);
    let detail: unknown;
    el.addEventListener("acme-copy", (e) => (detail = (e as CustomEvent).detail));
    button(el).dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(written).toEqual(["lipsum"]);
    expect(detail).toEqual({ text: "lipsum" });
    expect(stack(el).classList.contains("copied")).toBe(true);
  });

  test("a failed copy fires acme-copy-error and keeps the copy glyph", async () => {
    Object.defineProperty(navigator, "clipboard", { value: { writeText: async () => Promise.reject(new Error("denied")) }, configurable: true });
    const el = await mount(`<acme-copy-button text-to-copy="lipsum"></acme-copy-button>`);
    let failed = false;
    el.addEventListener("acme-copy-error", () => (failed = true));
    button(el).dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(failed).toBe(true);
    expect(stack(el).classList.contains("copied")).toBe(false);
  });

  test("custom colors switch the button to the custom variant; size and shape pass through", async () => {
    const el = await mount(`<acme-copy-button text-to-copy="x" size="small" shape="circle" normal='{"background":"#000"}'></acme-copy-button>`);
    const b = button(el);
    expect(b.getAttribute("variant")).toBe("custom");
    expect(b.getAttribute("size")).toBe("small");
    expect(b.getAttribute("shape")).toBe("circle");
  });

  test("the icon slot is always rendered, so content assigned at any time reaches it", async () => {
    // The slot must never be removed or replaced conditionally: a removed slot cannot receive an
    // assignment, slotchange never fires, and an icon added after the first render is lost. That was
    // a real regression here, caught by Peter and reproduced in the browser before this test existed.
    //
    // The glyph is rendered BESIDE the slot rather than as its native fallback, because a composing
    // element forwards a slot of its own into this one and a forwarded slot counts as assigned
    // content even when empty — the native fallback would then never show. `hasIcon` is read from
    // `assignedElements({ flatten: true })`, which resolves the forwarded slot to what it holds.
    const bare = await mount(`<acme-copy-button text-to-copy="x"></acme-copy-button>`);
    expect(bare.shadowRoot!.querySelector(".copy slot[name=icon]")).not.toBeNull();
    expect(bare.shadowRoot!.querySelector(".copy > svg")).not.toBeNull();

    const withIcon = await mount(`<acme-copy-button text-to-copy="x"><svg slot="icon"></svg></acme-copy-button>`);
    const slot = withIcon.shadowRoot!.querySelector(".copy slot[name=icon]") as HTMLSlotElement;
    expect(slot).not.toBeNull();
    expect(slot.assignedElements({ flatten: true }).length).toBe(1);

    // Added after the first render: the slot is still there to receive it.
    const late = await mount(`<acme-copy-button text-to-copy="x"></acme-copy-button>`);
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("slot", "icon");
    late.appendChild(svg);
    const lateSlot = late.shadowRoot!.querySelector(".copy slot[name=icon]") as HTMLSlotElement;
    expect(lateSlot.assignedElements({ flatten: true }).length).toBe(1);
  });
});
