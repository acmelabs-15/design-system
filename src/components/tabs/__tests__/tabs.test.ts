import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeTab } from "../../tab/tab";
import type { AcmeTabs } from "../tabs";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeTabs;
  await el.updateComplete;
  for (const t of el.querySelectorAll("acme-tab")) await t.updateComplete;
  await el.updateComplete;
  return el;
};
const fruit = (extra = "", mango = "") =>
  `<acme-tabs value="apple"${extra}><acme-tab value="apple">Apple</acme-tab><acme-tab value="orange">Orange</acme-tab><acme-tab value="mango"${mango}>Mango</acme-tab></acme-tabs>`;
const button = (t: AcmeTab) => t.shadowRoot!.querySelector("button.tab")!;
const tablist = (el: AcmeTabs) => el.shadowRoot!.querySelector("[role=tablist]")!;

describe("acme-tabs", () => {
  test("the tab list carries the variant; the selected tab is marked and tabbable", async () => {
    const el = await mount(fruit());
    const row = tablist(el);
    expect(row.className.trim()).toBe("tabs");
    expect(row.getAttribute("data-variant")).toBe("primary");
    expect(row.getAttribute("aria-orientation")).toBe("horizontal");
    const tabs = [...el.querySelectorAll("acme-tab")];
    expect(tabs[0].selected).toBe(true);
    expect(button(tabs[0]).getAttribute("aria-selected")).toBe("true");
    expect(button(tabs[0]).getAttribute("tabindex")).toBe("0");
    expect(button(tabs[1]).getAttribute("tabindex")).toBe("-1");
    expect(button(tabs[1]).getAttribute("type")).toBe("button");
    expect(button(tabs[1]).getAttribute("data-show-focus-ring")).toBe("true");
    expect(button(tabs[1]).querySelector(".icon")).toBeNull();
  });

  test("disabled on the row disables every tab; a tab with a tooltip wraps its button", async () => {
    const el = await mount(fruit(" disabled"));
    for (const t of el.querySelectorAll("acme-tab")) expect(button(t).hasAttribute("disabled")).toBe(true);
    const el2 = await mount(fruit("", ' disabled tooltip="Mangos are not allowed"'));
    const mango = el2.querySelectorAll("acme-tab")[2];
    const tip = mango.shadowRoot!.querySelector("acme-tooltip")!;
    expect(tip.getAttribute("text")).toBe("Mangos are not allowed");
    expect(tip.getAttribute("position")).toBe("bottom");
    expect(tip.querySelector("button.tab")!.hasAttribute("disabled")).toBe(true);
  });

  test("secondary reaches the row and each tab; an icon renders in its own box", async () => {
    const el = await mount(`<acme-tabs variant="secondary" value="a"><acme-tab value="a"><svg slot="icon"></svg>A</acme-tab></acme-tabs>`);
    expect(tablist(el).className).toContain("secondary");
    expect(tablist(el).getAttribute("data-variant")).toBe("secondary");
    const tab = el.querySelector("acme-tab")!;
    expect(button(tab).classList.contains("secondary")).toBe(true);
    expect(button(tab).querySelector(".icon > slot[name=icon]")).not.toBeNull();
  });

  test("ArrowRight selects the neighbour and fires acme-change; a disabled neighbour stops it; the ring hides until a blur", async () => {
    const el = await mount(fruit("", " disabled"));
    const tabs = [...el.querySelectorAll("acme-tab")];
    let got = "";
    el.addEventListener("acme-change", (e) => {
      got = (e as CustomEvent).detail.value;
    });
    const key = (k: string) => tablist(el).dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, composed: true }));
    key("ArrowRight");
    await el.updateComplete;
    expect(el.value).toBe("orange");
    expect(got).toBe("orange");
    await tabs[1].updateComplete;
    expect(button(tabs[1]).getAttribute("data-show-focus-ring")).toBe("false");
    key("ArrowRight");
    await el.updateComplete;
    expect(el.value).toBe("orange");
    tablist(el).dispatchEvent(new FocusEvent("focusout", { bubbles: true, composed: true }));
    await el.updateComplete;
    await tabs[1].updateComplete;
    expect(button(tabs[1]).getAttribute("data-show-focus-ring")).toBe("true");
  });

  test("a click or focus on a tab selects it", async () => {
    const el = await mount(fruit());
    const tabs = [...el.querySelectorAll("acme-tab")];
    (button(tabs[2]) as HTMLElement).click();
    await el.updateComplete;
    expect(el.value).toBe("mango");
    button(tabs[1]).dispatchEvent(new FocusEvent("focus"));
    await el.updateComplete;
    expect(el.value).toBe("orange");
  });
});
