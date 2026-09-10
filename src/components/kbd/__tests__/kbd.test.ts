import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeKbd } from "../kbd";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeKbd;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeKbd) => el.shadowRoot!.querySelector(".kbd") as HTMLElement;
const keys = (el: AcmeKbd) => Array.from(root(el).querySelectorAll(".key")).map((k) => k.textContent?.trim());

describe("acme-kbd", () => {
  test("a modifier alone renders one key span; meta is an inline block of 1em", async () => {
    const el = await mount(`<acme-kbd meta></acme-kbd>`);
    const r = root(el);
    expect(r.tagName).toBe("KBD");
    expect(r.className.trim()).toBe("kbd");
    const key = r.querySelector(".key") as HTMLElement;
    expect(key.getAttribute("style")).toBe("min-width:1em;display:inline-block");
    expect(r.querySelectorAll(".key").length).toBe(1);
    expect(r.querySelector(".key slot")).toBeNull();
  });

  test("modifiers keep the order meta, shift, alt, ctrl", async () => {
    const el = await mount(`<acme-kbd ctrl alt shift meta></acme-kbd>`);
    expect(keys(el).length).toBe(4);
    expect(keys(el)[1]).toBe("⇧");
  });

  test("the key content gets its own span after the modifiers; small maps to the class", async () => {
    const el = await mount(`<acme-kbd small meta>K</acme-kbd>`);
    expect(root(el).className.trim()).toBe("kbd sm");
    const spans = root(el).querySelectorAll(".key");
    expect(spans.length).toBe(2);
    expect(spans[1].querySelector("slot")).not.toBeNull();
  });
});
