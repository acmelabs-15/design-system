import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmePagination } from "../pagination";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmePagination;
  await el.updateComplete;
  return el;
};

describe("acme-pagination", () => {
  test("two links with the accessible names: a direction label over a title row with the chevron", async () => {
    const el = await mount(`<acme-pagination prev-title="Home" prev-href="/" next-title="Introduction" next-href="/intro"></acme-pagination>`);
    const nav = el.shadowRoot!.querySelector("nav.pagination")!;
    expect(nav.getAttribute("aria-label")).toBe("pagination");
    expect([...nav.children].map((c) => c.className)).toEqual(["link prev", "center", "link next"]);
    const [prev, next] = nav.querySelectorAll("a");
    expect(prev.getAttribute("aria-label")).toBe("Go to previous page: Home");
    expect(prev.querySelector(".label")!.textContent).toBe("Previous");
    expect(prev.querySelector(".row > .title")!.textContent).toBe("Home");
    expect(prev.querySelector(".row > .chev svg")).not.toBeNull();
    expect(next.getAttribute("aria-label")).toBe("Go to next page: Introduction");
    expect(next.getAttribute("href")).toBe("/intro");
    expect(next.querySelector(".label")!.textContent).toBe("Next");
  });

  test("an end without a title renders no link; hover lands on the link as data-hover", async () => {
    const el = await mount(`<acme-pagination next-title="Introduction" next-href="#"></acme-pagination>`);
    const links = el.shadowRoot!.querySelectorAll("a");
    expect(links.length).toBe(1);
    expect(links[0].className).toBe("link next");
    links[0].dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    expect(links[0].getAttribute("data-hover")).toBe("true");
    links[0].dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse" }));
    expect(links[0].hasAttribute("data-hover")).toBe(false);
  });
});
