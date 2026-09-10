import { describe, expect, test } from "bun:test";
import "../../../index";
import { type AcmeBrowser, formatAddress } from "../browser";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeBrowser;
  await el.updateComplete;
  return el;
};
const frame = (el: AcmeBrowser) => el.shadowRoot!.querySelector(".frame") as HTMLElement;
const button = (el: AcmeBrowser) => frame(el).querySelector("acme-button")!;
const stack = (el: AcmeBrowser) => frame(el).querySelector(".stack") as HTMLElement;
const clipboard = (writeText: (t: string) => Promise<void>) => Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });

describe("acme-browser", () => {
  test("formatAddress drops the scheme, www. and a trailing slash", () => {
    expect(formatAddress("https://www.example.com")).toBe("example.com");
    expect(formatAddress("http://example.com/docs/")).toBe("example.com/docs");
    expect(formatAddress("")).toBe("");
  });

  test("renders the frame in an inline-size container: a header of dots, controls, the address pill and a spacer, then the slot", async () => {
    const el = await mount(`<acme-browser address="https://www.example.com"><div>shot</div></acme-browser>`);
    const f = frame(el);
    expect((f.parentElement as HTMLElement).style.containerType).toBe("inline-size");
    const header = f.querySelector(".header")!;
    expect([...header.children].map((c) => c.className)).toEqual(["section", "section", "spacer"]);
    const dots = header.querySelector(".section .dots")!;
    expect([...dots.children].map((c) => c.className)).toEqual(["dot-close", "dot-min", "dot-zoom"]);
    const controls = header.querySelectorAll(".section .controls svg");
    expect(controls.length).toBe(3);
    expect(controls[0].getAttribute("width")).toBe("14");
    expect(controls[0].getAttribute("style")).toContain("--ds-gray-900");
    expect(f.querySelector(":scope > slot")).not.toBeNull();
    expect(el.textContent).toContain("shot");
  });

  test("the address pill shows the formatted address beside a tertiary, tiny, square icon-only copy button", async () => {
    const el = await mount(`<acme-browser address="https://www.example.com/"></acme-browser>`);
    expect(frame(el).querySelector(".address .text")!.textContent).toBe("example.com");
    const b = button(el);
    expect(b.getAttribute("variant")).toBe("tertiary");
    expect(b.getAttribute("size")).toBe("tiny");
    expect(b.getAttribute("shape")).toBe("square");
    expect(b.hasAttribute("svg-only")).toBe(true);
    expect(b.getAttribute("aria-label")).toBe("Copy");
    const s = stack(el);
    expect(s.className.trim()).toBe("stack");
    expect(s.children[0].className).toBe("check");
    expect(s.children[1].className).toBe("copy");
    expect(s.querySelectorAll("svg[width='12']").length).toBe(2);
  });

  test("a click copies the full address, names the button Copied and shows the check for a second", async () => {
    const written: string[] = [];
    clipboard(async (t) => void written.push(t));
    const el = await mount(`<acme-browser address="https://www.example.com/"></acme-browser>`);
    button(el).dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(written).toEqual(["https://www.example.com/"]);
    expect(stack(el).classList.contains("copied")).toBe(true);
    expect(button(el).getAttribute("aria-label")).toBe("Copied");
    await new Promise((r) => setTimeout(r, 1050));
    await el.updateComplete;
    expect(stack(el).classList.contains("copied")).toBe(false);
    expect(button(el).getAttribute("aria-label")).toBe("Copy");
  });

  test("a failed copy keeps the copy glyph", async () => {
    clipboard(async () => Promise.reject(new Error("denied")));
    const el = await mount(`<acme-browser address="https://example.com"></acme-browser>`);
    button(el).dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(stack(el).classList.contains("copied")).toBe(false);
    expect(button(el).getAttribute("aria-label")).toBe("Copy");
  });

  test("carries no theme variant and no aria-hidden of its own", async () => {
    const el = await mount(`<acme-browser address="https://example.com" variant="dark"></acme-browser>`);
    expect("variant" in el).toBe(false);
    expect(frame(el).className.trim()).toBe("frame");
    expect(frame(el).hasAttribute("aria-hidden")).toBe(false);
  });
});
