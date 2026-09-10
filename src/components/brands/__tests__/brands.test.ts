import { describe, expect, test } from "bun:test";
import "../../../index";
import { assetsBase } from "../../../base";
import type { AcmeCopyButton } from "../../copy-button/copy-button";
import { type AcmeBrands, BRANDS, brandSize } from "../brands";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeBrands;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeBrands) => el.shadowRoot!.querySelector(".brands") as HTMLElement;
const frame = (el: AcmeBrands) => el.shadowRoot!.querySelector(".frame") as HTMLElement;

describe("acme-brands", () => {
  test("an inline mark at its natural size is the slot's fallback, drawn in the current color", async () => {
    const el = await mount(`<acme-brands brand="vercel"></acme-brands>`);
    expect(root(el).className.trim()).toBe("brands");
    const mark = frame(el).querySelector("slot > svg") as SVGElement;
    expect(mark.getAttribute("viewBox")).toBe("0 0 115 100");
    expect(mark.getAttribute("height")).toBe("100");
    expect(mark.getAttribute("width")).toBe("115");
    expect(mark.getAttribute("aria-label")).toBe("Vercel");
    expect(mark.querySelector("path")?.getAttribute("fill")).toBe("currentColor");
    expect(frame(el).querySelector("img")).toBeNull();
    expect(el.shadowRoot!.querySelector("acme-copy-button.copy")).toBeNull();
  });

  test("height sizes a mark by its aspect ratio; balanced by its multipliers", async () => {
    const el = await mount(`<acme-brands brand="vercel-logotype" height="64"></acme-brands>`);
    const mark = frame(el).querySelector("svg")!;
    expect(mark.getAttribute("width")).toBe("321");
    expect(mark.getAttribute("height")).toBe("64");
    expect(brandSize(BRANDS.vercel, 32)).toEqual({ width: 37, height: 32 });
    expect(brandSize(BRANDS.vercel, 32, true)).toEqual({ width: 54, height: 47 });
    expect(brandSize(BRANDS["nextjs-logotype"])).toEqual({ width: 318, height: 64 });
  });

  test("mode, full-width and white land as classes on the box", async () => {
    const el = await mount(`<acme-brands brand="eve" height="24" mode="dark" full-width white></acme-brands>`);
    expect(root(el).className.trim()).toBe("brands dark full white");
    el.mode = "light";
    await el.updateComplete;
    expect([...root(el).classList].sort()).toEqual(["brands", "full", "light", "white"]);
  });

  test("an image mark is a light and a dark file at the mark's size; dark mode wraps them in the forced-dark box", async () => {
    const el = await mount(`<acme-brands brand="nextjs-logotype"></acme-brands>`);
    const imgs = frame(el).querySelectorAll(":scope > img");
    expect(imgs.length).toBe(2);
    expect(imgs[0].className).toBe("light");
    expect(imgs[0].getAttribute("src")).toBe(`${assetsBase}nextjs-logotype-light.svg`);
    expect(imgs[1].className).toBe("dark");
    expect(imgs[1].getAttribute("src")).toBe(`${assetsBase}nextjs-logotype-dark.svg`);
    expect(imgs[0].getAttribute("width")).toBe("318");
    expect(imgs[0].getAttribute("height")).toBe("64");
    expect(imgs[0].getAttribute("alt")).toBe("Next.js logotype");
    expect(frame(el).querySelector(".force")).toBeNull();
    const dark = await mount(`<acme-brands brand="next-js" mode="dark"></acme-brands>`);
    expect(frame(dark).querySelectorAll(":scope > .force > img").length).toBe(2);
    expect(frame(dark).querySelector(":scope > img")).toBeNull();
  });

  test("image shows the image pair of a brand that also has an inline drawing", async () => {
    const el = await mount(`<acme-brands brand="v0" image height="10"></acme-brands>`);
    const imgs = frame(el).querySelectorAll("img");
    expect(imgs.length).toBe(2);
    expect(imgs[0].getAttribute("src")).toBe(`${assetsBase}v-zero-light.svg`);
    expect(imgs[0].getAttribute("width")).toBe("21");
    expect(frame(el).querySelector("slot > svg")).toBeNull();
  });

  test("slotted content shows in place of a mark, and is what the copy button copies", async () => {
    const el = await mount(`<acme-brands copy full-width><svg viewBox="0 0 10 10" width="10" height="10"><title>Custom</title></svg></acme-brands>`);
    expect(frame(el).querySelector("slot > svg")).toBeNull();
    expect(el.markup()).toContain("<title>Custom</title>");
    // The box composes acme-copy-button rather than rebuilding the stack, so the icon layers are
    // that element's business; what this element owns is the properties it hands over.
    const button = el.shadowRoot!.querySelector("acme-copy-button.copy")!;
    expect(button.getAttribute("label")).toBe("Copy code");
    expect(button.getAttribute("variant")).toBe("secondary");
    expect(button.getAttribute("shape")).toBe("square");
    expect(el.shadowRoot!.querySelector("acme-button.copy")).toBeNull();
  });

  test("the copy button's markup is the mark's own: the drawing or the image pair", async () => {
    const el = await mount(`<acme-brands brand="vercel" copy></acme-brands>`);
    expect(el.markup()).toMatch(/^<svg [^>]*viewBox="0 0 115 100"/);
    expect(el.markup()).not.toContain("<!--");
    expect(el.markup()).not.toContain("part=");
    const imgs = await mount(`<acme-brands brand="turbo" copy mode="dark"></acme-brands>`);
    expect(imgs.markup().split("\n").length).toBe(2);
    expect(imgs.markup()).toContain("turbo-color-dark.svg");
  });

  test("the box takes the hover state; the copy button's host takes the focus state", async () => {
    const el = await mount(`<acme-brands brand="vercel" copy></acme-brands>`);
    const b = root(el);
    b.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    expect(b.getAttribute("data-hover")).toBe("true");
    b.dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse" }));
    expect(b.hasAttribute("data-hover")).toBe(false);
    const button = el.shadowRoot!.querySelector("acme-copy-button.copy") as HTMLElement;
    button.dispatchEvent(new FocusEvent("focusin"));
    expect(button.hasAttribute("data-focus")).toBe(true);
    button.dispatchEvent(new FocusEvent("focusout"));
    expect(button.hasAttribute("data-focus")).toBe(false);
  });

  test("copying hands the markup to the composed copy button, which writes it and fires acme-copy", async () => {
    const el = await mount(`<acme-brands brand="ai-sdk" copy></acme-brands>`);
    const written: string[] = [];
    Object.defineProperty(navigator, "clipboard", { value: { writeText: async (t: string) => void written.push(t) }, configurable: true });
    let detail = "";
    el.addEventListener("acme-copy", (e) => {
      detail = (e as CustomEvent).detail.text;
    });
    const button = el.shadowRoot!.querySelector("acme-copy-button.copy") as AcmeCopyButton;
    // `markup()` reads the rendered frame, so the text cannot be bound in the template: it is handed
    // over when the press starts. Empty until then.
    expect(button.textToCopy).toBe("");
    button.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    expect(button.textToCopy).toBe(el.markup());
    await button.copy();
    expect(written[0]).toContain('viewBox="0 0 146 40"');
    expect(detail).toBe(written[0]);
    // The check and the status line belong to the copy button now.
    await button.updateComplete;
    expect(button.shadowRoot!.querySelector(".stack.copied")).not.toBeNull();
    expect(button.shadowRoot!.querySelector("[role=status]")?.textContent).toBe("Copied!");
  });

  test("the keyboard path hands the markup over too", async () => {
    const el = await mount(`<acme-brands brand="vercel" copy></acme-brands>`);
    const button = el.shadowRoot!.querySelector("acme-copy-button.copy") as AcmeCopyButton;
    expect(button.textToCopy).toBe("");
    button.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(button.textToCopy).toBe(el.markup());
  });
});
