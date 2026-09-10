import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeMenu } from "../../menu/menu";
import type { AcmeMenuItem } from "../../menu-item/menu-item";
import type { AcmeContextMenu } from "../context-menu";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeContextMenu;
  await el.updateComplete;
  return el;
};
/** Waits out the updates the composed menu queues after the host's own. */
const settle = async (el: AcmeContextMenu) => {
  await el.updateComplete;
  const menu = menuOf(el);
  await menu.updateComplete;
  await menu.updateComplete;
  await el.updateComplete;
};
const menuOf = (el: AcmeContextMenu) => el.shadowRoot!.querySelector("acme-menu") as AcmeMenu;
const listOf = (el: AcmeContextMenu) => menuOf(el).shadowRoot!.querySelector(".menu") as HTMLElement | null;
const rightClick = (on: EventTarget, x = 40, y = 30) => {
  const e = new MouseEvent("contextmenu", { bubbles: true, composed: true, cancelable: true, clientX: x, clientY: y });
  on.dispatchEvent(e);
  return e;
};
const rows = `<acme-menu-item slot="items">Item one</acme-menu-item><acme-menu-item slot="items" href="/">Item Two</acme-menu-item>`;

describe("acme-context-menu", () => {
  test("composes a right-start menu, 160 wide, anchored to an empty box; the host wraps the content, closed", async () => {
    const el = await mount(`<acme-context-menu><div>Right click here</div>${rows}</acme-context-menu>`);
    const menu = menuOf(el);
    expect(menu.position).toBe("right-start");
    expect(menu.width).toBe(160);
    expect(menu.open).toBe(false);
    expect(menu.querySelector('[slot="trigger"]')!.className).toBe("anchor");
    expect(el.getAttribute("data-state")).toBe("closed");
    expect(el.hasAttribute("data-disabled")).toBe(false);
    expect(el.shadowRoot!.querySelector("slot:not([name])")).not.toBeNull();
    expect(menu.items.map((i) => i.textContent?.trim())).toEqual(["Item one", "Item Two"]);
  });

  test("a right click on the content opens the menu at the point and keeps the browser's own menu off", async () => {
    const el = await mount(`<acme-context-menu><div>Right click here</div>${rows}</acme-context-menu>`);
    const e = rightClick(el.querySelector("div")!, 120, 60);
    await settle(el);
    expect(e.defaultPrevented).toBe(true);
    expect(el.open).toBe(true);
    expect(el.hasAttribute("open")).toBe(true);
    expect(el.getAttribute("data-state")).toBe("open");
    const list = listOf(el)!;
    expect(list.getAttribute("role")).toBe("menu");
    expect(list.getAttribute("style")).toBe("width:160px");
    // The anchor box sits at the point; the composed menu opens 2px to its right.
    const menu = menuOf(el);
    expect(menu.getAttribute("offset")).toBe("2");
    expect(menu.style.left).toBe("120px");
    expect(menu.style.top).toBe("60px");
  });

  test("width sizes the list; disabled keeps the menu shut and marks the host", async () => {
    const el = await mount(`<acme-context-menu width="220" disabled><div>Target</div>${rows}</acme-context-menu>`);
    expect(menuOf(el).width).toBe(220);
    expect(el.hasAttribute("data-disabled")).toBe(true);
    const e = rightClick(el.querySelector("div")!);
    await settle(el);
    expect(e.defaultPrevented).toBe(false);
    expect(el.open).toBe(false);
  });

  test("a selected row closes the menu; acme-open and acme-close fire again from the host", async () => {
    const el = await mount(`<acme-context-menu><div>Target</div>${rows}</acme-context-menu>`);
    const kinds: string[] = [];
    el.addEventListener("acme-open", (e) => kinds.push(`open:${(e as CustomEvent).detail.kind}`));
    el.addEventListener("acme-close", (e) => kinds.push(`close:${(e as CustomEvent).detail.kind}`));
    let selected = 0;
    el.addEventListener("acme-select", () => selected++);
    rightClick(el.querySelector("div")!);
    await settle(el);
    // A row's acme-select bubbles up the flat tree to the composed menu; happy-dom routes no event through a slot, so the menu is the dispatch point here.
    menuOf(el).dispatchEvent(new CustomEvent("acme-select", { bubbles: true, composed: true }));
    await settle(el);
    expect(el.open).toBe(false);
    expect(selected).toBe(1);
    expect(kinds).toEqual(["open:pointer", "close:pointer"]);
  });

  test("show and close drive the menu, and open follows it both ways", async () => {
    const el = await mount(`<acme-context-menu><div>Target</div>${rows}</acme-context-menu>`);
    el.show(10, 20, "keyboard");
    await settle(el);
    expect(menuOf(el).open).toBe(true);
    expect(el.open).toBe(true);
    el.close("keyboard");
    await settle(el);
    expect(el.open).toBe(false);
    el.open = true;
    await settle(el);
    expect(menuOf(el).open).toBe(true);
    el.open = false;
    await settle(el);
    expect(menuOf(el).open).toBe(false);
  });

  test("the open menu is modal: the page takes no pointer events and stops scrolling until it closes", async () => {
    const el = await mount(`<acme-context-menu><div>Target</div>${rows}</acme-context-menu>`);
    document.body.style.pointerEvents = "";
    el.show(10, 20, "keyboard");
    await settle(el);
    expect(document.body.style.pointerEvents).toBe("none");
    expect(document.body.hasAttribute("data-scroll-lock")).toBe(true);
    el.close("keyboard");
    await settle(el);
    expect(document.body.style.pointerEvents).toBe("");
    expect(document.body.hasAttribute("data-scroll-lock")).toBe(false);
  });

  test("over a link, the list leads with Open in New Tab and Copy Link Address before a separator, and forgets them on close", async () => {
    const el = await mount(`<acme-context-menu><div><a href="https://example.com/docs">Docs</a></div>${rows}</acme-context-menu>`);
    rightClick(el.querySelector("a")!);
    await settle(el);
    expect(el.open).toBe(true);
    const own = Array.from(menuOf(el).querySelectorAll(":scope > [slot=items]"));
    expect(own.map((n) => n.localName)).toEqual(["acme-menu-item", "acme-menu-item", "div", "slot"]);
    const [openIn, copy, separator] = own as [AcmeMenuItem, AcmeMenuItem, HTMLElement];
    expect(openIn.textContent?.trim()).toBe("Open in New Tab");
    expect(openIn.href).toBe("https://example.com/docs");
    expect(openIn.external).toBe(true);
    expect(copy.textContent?.trim()).toBe("Copy Link Address");
    expect(separator.className).toBe("separator");
    expect(separator.getAttribute("role")).toBe("separator");
    expect(menuOf(el).items.length).toBe(4);
    let selected = 0;
    el.addEventListener("acme-select", () => selected++);
    openIn.dispatchEvent(new CustomEvent("acme-select", { bubbles: true, composed: true }));
    await settle(el);
    expect(selected).toBe(0);
    expect(el.open).toBe(false);
    expect(menuOf(el).querySelectorAll(":scope > acme-menu-item").length).toBe(0);
  });

  test("a link to nowhere adds no rows", async () => {
    const el = await mount(`<acme-context-menu><div><a href="#">Top</a></div>${rows}</acme-context-menu>`);
    rightClick(el.querySelector("a")!);
    await settle(el);
    expect(menuOf(el).querySelectorAll(":scope > acme-menu-item").length).toBe(0);
  });

  test("a long press of a touch pointer opens the menu; a lifted one does not", async () => {
    const el = await mount(`<acme-context-menu><div>Target</div>${rows}</acme-context-menu>`);
    const target = el.querySelector("div")!;
    const press = () => target.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true, pointerType: "touch", clientX: 5, clientY: 6 }));
    press();
    target.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, composed: true, pointerType: "touch" }));
    await new Promise((r) => setTimeout(r, 720));
    await settle(el);
    expect(el.open).toBe(false);
    press();
    await new Promise((r) => setTimeout(r, 720));
    await settle(el);
    expect(el.open).toBe(true);
  });

  test("Escape closes the menu and returns focus to where it was", async () => {
    const el = await mount(`<acme-context-menu><div><button id="b">Focused</button></div>${rows}</acme-context-menu>`);
    const button = el.querySelector("button")!;
    button.focus();
    expect(document.activeElement).toBe(button);
    rightClick(el.querySelector("div")!);
    await settle(el);
    listOf(el)!.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, composed: true, cancelable: true }));
    await settle(el);
    expect(el.open).toBe(false);
    expect(document.activeElement).toBe(button);
  });
});
