import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeScroller } from "../scroller";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeScroller;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeScroller) => el.shadowRoot!.querySelector(".scroller") as HTMLElement;
const settle = () => new Promise((r) => setTimeout(r, 150));
/** Gives the container a scroll geometry (happy-dom lays nothing out). */
const geometry = (c: HTMLElement, g: Record<string, number>) => {
  for (const [k, v] of Object.entries(g)) Object.defineProperty(c, k, { value: v, configurable: true, writable: true });
};

describe("acme-scroller", () => {
  test("renders the viewport, the overlay and the container; the axis lands on the root and the container", async () => {
    const el = await mount(`<acme-scroller height="220" overflow="y" width="100%"><div></div></acme-scroller>`);
    const r = root(el);
    expect(r.className.trim()).toBe("scroller y");
    expect(r.style.height).toBe("220px");
    expect(r.style.width).toBe("100%");
    expect(r.querySelector(".overlay")).not.toBeNull();
    const c = r.querySelector(".container") as HTMLElement;
    expect(c.getAttribute("data-overflow")).toBe("y");
    expect(c.querySelector(".content > slot")).not.toBeNull();
    expect(el.container).toBe(c);
    expect(el.shadowRoot!.querySelector(".buttons")).toBeNull();
  });

  test("both is the default axis; gradient and mobile-grid reach the overlay and the root", async () => {
    const el = await mount(`<acme-scroller gradient="#f00 0, #f000 40px" mobile-grid><div></div></acme-scroller>`);
    const r = root(el);
    expect(r.className.trim()).toBe("scroller both grid");
    expect(r.style.width).toBe("100%");
    expect(r.style.height).toBe("100%");
    expect((r.querySelector(".overlay") as HTMLElement).style.getPropertyValue("--scroller-gradient")).toBe("#f00 0, #f000 40px");
    expect((r.querySelector(".container") as HTMLElement).getAttribute("data-overflow")).toBe("both");
  });

  test("with-buttons: two round secondary buttons above a vertical viewport, below a horizontal one, none for both", async () => {
    const el = await mount(`<acme-scroller overflow="y" with-buttons><div></div><div></div></acme-scroller>`);
    const sr = el.shadowRoot!;
    const row = sr.querySelector(".buttons") as HTMLElement;
    expect(row.className.trim()).toBe("buttons y");
    expect(row.nextElementSibling).toBe(root(el));
    const btns = row.querySelectorAll("acme-button");
    expect(btns.length).toBe(2);
    expect(btns[0].getAttribute("aria-label")).toBe("scroll top");
    expect(btns[1].getAttribute("aria-label")).toBe("scroll bottom");
    expect(btns[0].getAttribute("variant")).toBe("secondary");
    expect(btns[0].getAttribute("size")).toBe("small");
    expect(btns[0].getAttribute("shape")).toBe("circle");
    expect(btns[0].hasAttribute("svg-only")).toBe(true);
    el.overflow = "x";
    await el.updateComplete;
    const after = sr.querySelector(".buttons") as HTMLElement;
    expect(after.className.trim()).toBe("buttons x");
    expect(after.previousElementSibling).toBe(root(el));
    expect(after.querySelector("acme-button")!.getAttribute("aria-label")).toBe("scroll left");
    el.overflow = "both";
    await el.updateComplete;
    expect(sr.querySelector(".buttons")).toBeNull();
  });

  test("the edges the content lies past land on the root 100ms after a scroll, and data-overflowing on the host", async () => {
    const el = await mount(`<acme-scroller overflow="y" height="220"><div></div></acme-scroller>`);
    const c = el.container!;
    geometry(c, { scrollTop: 0, clientHeight: 220, scrollHeight: 600, scrollLeft: 0, clientWidth: 400, scrollWidth: 400 });
    c.dispatchEvent(new Event("scroll"));
    expect(root(el).className.trim()).toBe("scroller y");
    await settle();
    await el.updateComplete;
    expect(root(el).className.trim()).toBe("scroller y bottom");
    expect(el.hasAttribute("data-overflowing")).toBe(true);
    geometry(c, { scrollTop: 380 });
    c.dispatchEvent(new Event("scroll"));
    await settle();
    await el.updateComplete;
    expect(root(el).className.trim()).toBe("scroller y top");
    geometry(c, { scrollTop: 0, scrollHeight: 220 });
    c.dispatchEvent(new Event("scroll"));
    await settle();
    await el.updateComplete;
    expect(root(el).className.trim()).toBe("scroller y");
    expect(el.hasAttribute("data-overflowing")).toBe(false);
  });

  test("the buttons scroll smoothly to the next and previous direct child, and hold for 400ms after a move", async () => {
    const el = await mount(`<acme-scroller overflow="x" with-buttons><div></div><div></div><div></div></acme-scroller>`);
    const c = el.container!;
    geometry(c, { scrollLeft: 0, clientWidth: 400, scrollWidth: 1200 });
    c.getBoundingClientRect = () => ({ left: 0, top: 0 }) as DOMRect;
    // Each child sits 272px further along; a rect moves left as the container scrolls, as in a browser.
    [...el.children].forEach((child, i) => {
      child.getBoundingClientRect = () => ({ left: i * 272 - c.scrollLeft, top: 0 }) as DOMRect;
    });
    const calls: ScrollToOptions[] = [];
    c.scrollTo = ((o: ScrollToOptions) => {
      calls.push(o);
      geometry(c, { scrollLeft: o.left ?? 0 });
    }) as typeof c.scrollTo;
    const [prev, next] = [...el.shadowRoot!.querySelectorAll("acme-button")];
    next.click();
    expect(calls).toEqual([{ behavior: "smooth", left: 272 }]);
    next.click();
    expect(calls.length).toBe(1); // held
    await new Promise((r) => setTimeout(r, 420));
    next.click();
    expect(calls[1]).toEqual({ behavior: "smooth", left: 544 });
    await new Promise((r) => setTimeout(r, 420));
    next.click();
    expect(calls.length).toBe(2); // the last child
    await new Promise((r) => setTimeout(r, 420));
    prev.click();
    expect(calls[2]).toEqual({ behavior: "smooth", left: 272 });
  });
});
