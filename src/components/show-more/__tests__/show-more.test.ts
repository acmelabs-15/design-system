import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeShowMore } from "../show-more";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeShowMore;
  await el.updateComplete;
  return el;
};
const sr = (el: AcmeShowMore) => el.shadowRoot!;
const text = (el: AcmeShowMore) => sr(el).querySelector(".text")!.textContent!.replace(/\s+/g, " ").trim();

describe("acme-show-more", () => {
  test("two hairlines around a pill holding a small rounded secondary button that reads Show More", async () => {
    const el = await mount(`<acme-show-more></acme-show-more>`);
    const root = sr(el).querySelector(".show-more")!;
    expect(root.className.trim()).toBe("show-more");
    const kids = [...root.children];
    expect(kids.map((k) => k.className)).toEqual(["line", "pill", "line"]);
    expect(kids[0].getAttribute("data-line")).toBe("true");
    const b = root.querySelector(".pill > acme-button")!;
    expect(b.getAttribute("variant")).toBe("secondary");
    expect(b.getAttribute("size")).toBe("small");
    expect(b.getAttribute("shape")).toBe("rounded");
    expect(b.hasAttribute("loading")).toBe(false);
    expect(text(el)).toBe("Show More");
    expect(root.querySelector(".text > .chev svg")).not.toBeNull();
  });

  test("expanded reads Show Less and turns the chevron; loading only counts while expanded", async () => {
    const el = await mount(`<acme-show-more expanded></acme-show-more>`);
    expect(sr(el).querySelector(".show-more")!.classList.contains("expanded")).toBe(true);
    expect(text(el)).toBe("Show Less");
    el.loading = true;
    await el.updateComplete;
    expect(sr(el).querySelector("acme-button")!.hasAttribute("loading")).toBe(true);
    expect(text(el)).toBe("Show More");
    el.expanded = false;
    await el.updateComplete;
    expect(sr(el).querySelector("acme-button")!.hasAttribute("loading")).toBe(false);
  });

  test("no-border marks the root; slotted content replaces the text; a click does not toggle by itself", async () => {
    const el = await mount(`<acme-show-more no-border>See all</acme-show-more>`);
    expect(sr(el).querySelector(".show-more")!.classList.contains("no-border")).toBe(true);
    expect(sr(el).querySelector("slot:not([name])")).not.toBeNull();
    sr(el)
      .querySelector("acme-button")!
      .dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.expanded).toBe(false);
  });
});
