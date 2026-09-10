import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeTextCopy } from "../text-copy";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeTextCopy;
  await el.updateComplete;
  return el;
};
const sr = (el: AcmeTextCopy) => el.shadowRoot!;

describe("acme-text-copy", () => {
  test("a text button: label, then a swap holding the copy layer at rest", async () => {
    const el = await mount(`<acme-text-copy ellipsis text-label="Copy config digest" text-to-copy="edgeConfigData.digest"></acme-text-copy>`);
    const b = sr(el).querySelector("button.text-copy")!;
    expect(b.getAttribute("type")).toBe("button");
    expect(b.classList.contains("ellipsis")).toBe(true);
    const text = sr(el).querySelector(".body > .text")!;
    expect(text.tagName).toBe("P");
    expect(text.textContent).toBe("Copy config digest");
    const layers = sr(el).querySelectorAll(".body > .swap > .layer");
    expect(layers.length).toBe(1);
    expect(layers[0].getAttribute("data-phase")).toBe("entered");
    expect(layers[0].hasAttribute("data-enter")).toBe(false);
    expect(sr(el).querySelector("acme-tooltip")).toBeNull();
  });

  test("renders nothing without text to copy; as picks the label tag; show-tooltip wraps the body", async () => {
    const empty = await mount(`<acme-text-copy text-label="Copy"></acme-text-copy>`);
    expect(sr(empty).querySelector(".text-copy")).toBeNull();
    const el = await mount(`<acme-text-copy as="span" show-tooltip text-label="Copy" text-to-copy="lipsum"></acme-text-copy>`);
    expect(sr(el).querySelector(".body > .text")!.tagName).toBe("SPAN");
    expect(sr(el).querySelector("acme-tooltip .body")).not.toBeNull();
    expect(sr(el).querySelector("acme-tooltip")!.getAttribute("text")).toBe("lipsum");
  });

  test("a click swaps to the check: the copy layer exits, the check enters animated, and acme-copy fires", async () => {
    const written: string[] = [];
    Object.defineProperty(navigator, "clipboard", { value: { writeText: async (t: string) => void written.push(t) }, configurable: true });
    const el = await mount(`<acme-text-copy text-label="Copy" text-to-copy="lipsum"></acme-text-copy>`);
    let fired = false;
    el.addEventListener("acme-copy", () => (fired = true));
    sr(el).querySelector("button")!.click();
    await el.updateComplete;
    const layers = [...sr(el).querySelectorAll(".layer")];
    expect(layers.map((l) => l.getAttribute("data-phase"))).toEqual(["exiting", "entering"]);
    expect(layers[1].getAttribute("data-enter")).toBe("animate");
    await new Promise((r) => setTimeout(r, 0));
    expect(written).toEqual(["lipsum"]);
    expect(fired).toBe(true);
  });
});
