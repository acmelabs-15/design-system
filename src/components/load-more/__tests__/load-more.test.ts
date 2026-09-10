import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeLoadMore } from "../load-more";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeLoadMore;
  await el.updateComplete;
  return el;
};
const button = (el: AcmeLoadMore) => el.shadowRoot!.querySelector("acme-button")!;

describe("acme-load-more", () => {
  test("composes a secondary submit button around the slotted text", async () => {
    const el = await mount(`<acme-load-more>Load More</acme-load-more>`);
    const b = button(el);
    expect(b.getAttribute("variant")).toBe("secondary");
    expect(b.getAttribute("type")).toBe("submit");
    expect(b.hasAttribute("loading")).toBe(false);
    expect(b.className.trim()).toBe("");
    expect(b.querySelector("slot:not([name])")).not.toBeNull();
  });
  test("loading passes to the button", async () => {
    const el = await mount(`<acme-load-more loading>Loading...</acme-load-more>`);
    expect(button(el).hasAttribute("loading")).toBe(true);
  });
  test("no-gap and no-border-radius become modifier classes on the button", async () => {
    const el = await mount(`<acme-load-more no-gap no-border-radius>Load More</acme-load-more>`);
    const b = button(el);
    expect(b.classList.contains("no-gap")).toBe(true);
    expect(b.classList.contains("no-radius")).toBe(true);
  });
});

describe("acme-load-more placeholder and disabled", () => {
  test("placeholder renders an empty block instead of the button; disabled passes through", async () => {
    const ph = await mount(`<acme-load-more placeholder no-gap></acme-load-more>`);
    expect(ph.shadowRoot!.querySelector("acme-button")).toBeNull();
    const block = ph.shadowRoot!.querySelector(".placeholder")!;
    expect(block.classList.contains("no-gap")).toBe(true);
    expect(block.textContent).toBe("");
    const el = await mount(`<acme-load-more disabled></acme-load-more>`);
    expect(button(el).hasAttribute("disabled")).toBe(true);
    expect(button(el).querySelector("slot")!.textContent).toBe("Load More");
  });
});
