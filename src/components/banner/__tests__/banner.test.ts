import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeBanner } from "../banner";

const mount = async (html: string) => {
  document.body.innerHTML = html;
  const el = document.body.firstElementChild as AcmeBanner;
  await el.updateComplete;
  return el;
};
// The breakpoint state is private: a test sets it the way the media query listener does.
const narrow = async (el: AcmeBanner) => {
  Object.assign(el, { wide: false });
  await el.updateComplete;
};
const sr = (el: AcmeBanner) => el.shadowRoot as ShadowRoot;
const btn = (el: AcmeBanner, cls: string) =>
  sr(el).querySelector(`acme-button.${cls}`) as HTMLElement & { href: string; variant: string; size: string; shape: string; shadow: boolean; block: boolean };

describe("acme-banner", () => {
  test("renders the mobile button and the wide row with the message and the action link", async () => {
    const el = await mount(`<acme-banner href="#more" button="Read more"><b>Big News</b> – text</acme-banner>`);
    const row = sr(el).querySelector(".banner") as HTMLElement;
    expect(row.getAttribute("part")).toBe("banner");
    expect(row.querySelector("p.text > slot:not([name])")).not.toBeNull();
    const action = btn(el, "action");
    expect(action.href).toBe("#more");
    expect(action.variant).toBe("secondary");
    expect(action.size).toBe("small");
    expect(action.shape).toBe("rounded");
    expect(action.shadow).toBe(true);
    expect(action.textContent?.trim()).toBe("Read more");
    expect(action.querySelector("svg[slot=end]")).not.toBeNull();
    const mobile = btn(el, "mobile");
    expect(mobile.getAttribute("part")).toBe("mobile");
    expect(mobile.block).toBe(true);
    expect(mobile.href).toBe("#more");
    expect(mobile.querySelector("svg[slot=end]")).not.toBeNull();
  });

  test("wide: the message and the prefix sit in the row; the mobile copy slot stays in the mobile button", async () => {
    const el = await mount(`<acme-banner button="Go"><svg slot="start"></svg>Message<span slot="mobile">Short</span></acme-banner>`);
    expect((el as unknown as { wide: boolean }).wide).toBe(true);
    const row = sr(el).querySelector(".banner") as HTMLElement;
    expect(row.querySelector(":scope > slot[name=start]")).not.toBeNull();
    expect(row.querySelector("p.text > slot:not([name])")).not.toBeNull();
    const mobile = btn(el, "mobile");
    expect(mobile.querySelector("slot[name=mobile]")).not.toBeNull();
    expect(mobile.querySelector("slot:not([name])")).toBeNull();
    expect(mobile.querySelector("slot[name=start]")).toBeNull();
  });

  test("narrow: the message and the prefix move into the mobile button; slotted mobile copy replaces the message there", async () => {
    const el = await mount(`<acme-banner button="Go"><svg slot="start"></svg>Message</acme-banner>`);
    await narrow(el);
    const mobile = btn(el, "mobile");
    expect(mobile.querySelector("slot[name=start][slot=start]")).not.toBeNull();
    expect(mobile.querySelector("slot:not([name])")).not.toBeNull();
    const row = sr(el).querySelector(".banner") as HTMLElement;
    expect(row.querySelector("slot[name=start]")).toBeNull();
    expect(row.querySelector("p.text > slot")).toBeNull();
    const copy = await mount(`<acme-banner button="Go">Message<span slot="mobile">Short</span></acme-banner>`);
    await narrow(copy);
    expect(btn(copy, "mobile").querySelector("slot:not([name])")).toBeNull();
    expect(btn(copy, "mobile").querySelector("slot[name=mobile]")).not.toBeNull();
    expect((sr(copy).querySelector(".banner") as HTMLElement).querySelector("p.text > slot:not([name])")).not.toBeNull();
  });

  test("no prefix: the mobile button gets no prefix slot, so the composed button renders no prefix", async () => {
    const el = await mount(`<acme-banner button="Go">Message</acme-banner>`);
    await narrow(el);
    expect(btn(el, "mobile").querySelector("slot[name=start]")).toBeNull();
  });
});
