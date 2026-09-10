import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeMenuButton } from "../../menu-button/menu-button";
import type { AcmeMenuItem } from "../../menu-item/menu-item";
import type { AcmeMenu } from "../menu";

const mount = async <T extends HTMLElement = AcmeMenu>(markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as T & { updateComplete: Promise<boolean> };
  await el.updateComplete;
  return el;
};
/** Waits out the update an `updated()` change queued, the trigger's own update included. */
const settle = async (el: HTMLElement & { updateComplete: Promise<boolean> }) => {
  await el.updateComplete;
  await el.updateComplete;
  for (const c of el.querySelectorAll("*") as Iterable<HTMLElement & { updateComplete?: Promise<boolean> }>) await c.updateComplete;
};
const items = `<acme-menu-item slot="items">One</acme-menu-item><acme-menu-item slot="items">Two</acme-menu-item><acme-menu-item slot="items">Three</acme-menu-item>`;
const trigger = `<acme-menu-button slot="trigger">Actions</acme-menu-button>`;
const list = (el: AcmeMenu) => el.shadowRoot!.querySelector(".menu") as HTMLElement;
const key = (target: EventTarget, k: string) => {
  const e = new KeyboardEvent("keydown", { key: k, bubbles: true, composed: true, cancelable: true });
  target.dispatchEvent(e);
  return e;
};
const active = () => {
  let a: Element | null = document.activeElement;
  while (a?.shadowRoot?.activeElement) a = a.shadowRoot.activeElement;
  return a;
};
/** The element of ours the focused node belongs to: a row's or the trigger's host, through its shadow root. */
const focused = () => {
  const a = active();
  const root = a?.getRootNode();
  return root instanceof ShadowRoot ? root.host : a;
};
const selected = (el: AcmeMenu) => el.items.map((i) => i.selected);

describe("acme-menu", () => {
  test("closed by default; a click on the trigger opens the list in a manual popover at the set width and marks the trigger", async () => {
    const el = await mount(`<acme-menu width="200">${trigger}${items}</acme-menu>`);
    expect(el.shadowRoot!.querySelector(".floating")).toBeNull();
    const button = el.querySelector("acme-menu-button") as AcmeMenuButton;
    expect(button.getAttribute("aria-haspopup")).toBe("true");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    button.shadowRoot!.querySelector("button")!.click();
    await settle(el);
    expect(el.open).toBe(true);
    const floating = el.shadowRoot!.querySelector(".floating") as HTMLElement;
    expect(floating.getAttribute("popover")).toBe("manual");
    expect(floating.dataset.phase).toBe("entered");
    const menu = list(el);
    expect(menu.getAttribute("role")).toBe("menu");
    expect(menu.getAttribute("style")).toBe("width:200px");
    expect(button.open).toBe(true);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(button.shadowRoot!.querySelector("button")!.getAttribute("data-is-open")).toBe("true");
    expect(selected(el)).toEqual([false, false, false]);
    button.shadowRoot!.querySelector("button")!.click();
    await settle(el);
    expect(el.open).toBe(false);
    expect(floating.dataset.phase).toBe("exiting");
    await new Promise((r) => setTimeout(r, 450));
    expect(el.shadowRoot!.querySelector(".floating")).toBeNull();
  });

  test("Arrow Down on the trigger opens on the first enabled row; the width defaults to 150", async () => {
    const el = await mount(`<acme-menu>${trigger}<acme-menu-item slot="items" disabled>Off</acme-menu-item>${items}</acme-menu>`);
    const inner = el.querySelector("acme-menu-button")!.shadowRoot!.querySelector("button")!;
    const e = key(inner, "ArrowDown");
    await settle(el);
    expect(e.defaultPrevented).toBe(true);
    expect(el.open).toBe(true);
    expect(list(el).getAttribute("style")).toBe("width:150px");
    expect(selected(el)).toEqual([false, true, false, false]);
  });

  test("items come from sections, wrappers and forwarded slots, inert rows included", async () => {
    const el = await mount(
      `<acme-menu>${trigger}<acme-menu-section slot="items" title="Section"><acme-menu-item>One</acme-menu-item></acme-menu-section><acme-menu-item slot="items" disabled>Two</acme-menu-item><acme-menu-item slot="items" locked>Three</acme-menu-item><div slot="items"><acme-menu-item>Four</acme-menu-item></div></acme-menu>`,
    );
    expect(el.items.map((i) => i.label)).toEqual(["One", "Two", "Three", "Four"]);
    expect(el.items.map((i) => i.inert)).toEqual([false, true, true, false]);
    const section = el.querySelector("acme-menu-section")!;
    expect(section.hasAttribute("title")).toBe(false);
    expect(section.shadowRoot!.querySelector(".heading")!.textContent).toBe("Section");
  });

  test("arrows, Home, End and typeahead move the highlight; rotate wraps it", async () => {
    const el = await mount(`<acme-menu open>${trigger}${items}<acme-menu-item slot="items" disabled>Twenty</acme-menu-item></acme-menu>`);
    const menu = list(el);
    key(menu, "ArrowDown");
    await settle(el);
    expect(selected(el)).toEqual([true, false, false, false]);
    expect(focused()?.textContent?.trim()).toBe("One");
    key(menu, "End");
    await settle(el);
    expect(selected(el)).toEqual([false, false, true, false]);
    key(menu, "ArrowDown");
    await settle(el);
    expect(selected(el)).toEqual([false, false, true, false]);
    el.rotate = true;
    key(menu, "ArrowDown");
    await settle(el);
    expect(selected(el)).toEqual([true, false, false, false]);
    key(menu, "t");
    await settle(el);
    expect(selected(el)).toEqual([false, true, false, false]);
    key(menu, "h");
    await settle(el);
    expect(selected(el)).toEqual([false, false, true, false]);
    key(menu, "Home");
    await settle(el);
    expect(selected(el)).toEqual([true, false, false, false]);
  });

  test("Enter activates the highlighted row, which selects and closes; close-on-select=false keeps it open", async () => {
    const el = await mount(`<acme-menu open>${trigger}${items}</acme-menu>`);
    let selects = 0;
    el.addEventListener("acme-select", () => selects++);
    const kinds: string[] = [];
    el.addEventListener("acme-close", (e) => kinds.push((e as CustomEvent).detail.kind));
    const menu = list(el);
    key(menu, "ArrowDown");
    await settle(el);
    key(menu, "Enter");
    await settle(el);
    expect(selects).toBe(1);
    expect(el.open).toBe(false);
    expect(kinds).toEqual(["keyboard"]);
    expect(focused()?.localName).toBe("acme-menu-button");
    const keep = await mount(`<acme-menu open close-on-select="false">${trigger}${items}</acme-menu>`);
    keep.items[1].shadowRoot!.querySelector<HTMLElement>(".item")!.click();
    await settle(keep);
    expect(keep.open).toBe(true);
  });

  test("Escape (cancelable) and a press outside close it, Tab is swallowed; disable-interact-outside keeps it open", async () => {
    const el = await mount(`<acme-menu open>${trigger}${items}</acme-menu>`);
    el.addEventListener("acme-escape", (e) => e.preventDefault(), { once: true });
    key(list(el), "Escape");
    await settle(el);
    expect(el.open).toBe(true);
    key(list(el), "Escape");
    await settle(el);
    expect(el.open).toBe(false);
    expect(focused()?.localName).toBe("acme-menu-button");
    el.open = true;
    await settle(el);
    // Tab is swallowed while the menu is open: it stays open and focus stays in the list.
    const tab = key(list(el), "Tab");
    await settle(el);
    expect(el.open).toBe(true);
    expect(tab.defaultPrevented).toBe(true);
    document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true }));
    await settle(el);
    expect(el.open).toBe(false);
    const stay = await mount(`<acme-menu open disable-interact-outside>${trigger}${items}</acme-menu>`);
    document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true }));
    await settle(stay);
    expect(stay.open).toBe(true);
  });

  test("a plain button works as the trigger, and hover mode opens on the pointer", async () => {
    const el = await mount(`<acme-menu hover-mode hover-close-delay="10"><button slot="trigger">More</button>${items}</acme-menu>`);
    const button = el.querySelector("button")!;
    expect(button.getAttribute("aria-haspopup")).toBe("true");
    el.dispatchEvent(new MouseEvent("mouseenter"));
    await settle(el);
    expect(el.open).toBe(true);
    el.dispatchEvent(new MouseEvent("mouseleave"));
    await new Promise((r) => setTimeout(r, 30));
    await settle(el);
    expect(el.open).toBe(false);
    button.click();
    await settle(el);
    expect(el.open).toBe(true);
    expect(button.getAttribute("aria-expanded")).toBe("true");
  });
});

describe("acme-menu-item", () => {
  test("a link, an error row, a locked row, a disabled row and a highlighted row render their states", async () => {
    const link = await mount<AcmeMenuItem>(`<acme-menu-item href="/x" external>One</acme-menu-item>`);
    const a = link.shadowRoot!.querySelector("li.link[role=none] > a.item[role=menuitem]") as HTMLAnchorElement;
    expect(a.getAttribute("href")).toBe("/x");
    expect(a.getAttribute("target")).toBe("_blank");
    const err = await mount<AcmeMenuItem>(`<acme-menu-item type="error">Delete</acme-menu-item>`);
    expect(err.shadowRoot!.querySelector(".item")!.className).toContain("error");
    const locked = await mount<AcmeMenuItem>(`<acme-menu-item locked>Delete</acme-menu-item>`);
    const row = locked.shadowRoot!.querySelector(".item")!;
    expect(row.getAttribute("aria-disabled")).toBe("true");
    expect(locked.shadowRoot!.querySelector(".suffix svg")).not.toBeNull();
    expect(locked.inert).toBe(true);
    let fired = 0;
    locked.addEventListener("acme-select", () => fired++);
    (row as HTMLElement).click();
    expect(fired).toBe(0);
    const off = await mount<AcmeMenuItem>(`<acme-menu-item href="/x" disabled>One</acme-menu-item>`);
    expect(off.shadowRoot!.querySelector("a")!.getAttribute("aria-disabled")).toBe("true");
    const on = await mount<AcmeMenuItem>(`<acme-menu-item selected><svg slot="prefix"></svg>One</acme-menu-item>`);
    expect(on.shadowRoot!.querySelector(".item")!.hasAttribute("data-selected")).toBe(true);
    expect(on.shadowRoot!.querySelector(".prefix slot[name=prefix]")).not.toBeNull();
    expect(on.shadowRoot!.querySelector(".suffix")).toBeNull();
  });
});

describe("acme-menu-button", () => {
  test("a text trigger is a plain button; show-chevron adds the turning chevron; open marks the root", async () => {
    const el = await mount<AcmeMenuButton>(`<acme-menu-button show-chevron variant="secondary">Actions</acme-menu-button>`);
    const b = el.shadowRoot!.querySelector(".btn")!;
    expect(b.className.trim()).toBe("btn secondary chevron");
    expect(b.querySelector(".label > .inner > .chev svg")).not.toBeNull();
    expect(b.hasAttribute("aria-label")).toBe(false);
    el.open = true;
    await el.updateComplete;
    expect(b.className).toContain("open");
    expect(b.querySelector(".chev")!.getAttribute("data-open")).toBe("true");
  });

  test("an element child makes an icon-only trigger named Menu; unstyled takes none of the button's root classes", async () => {
    const el = await mount<AcmeMenuButton>(`<acme-menu-button shape="square" size="small" variant="secondary"><svg></svg></acme-menu-button>`);
    const b = el.shadowRoot!.querySelector(".btn")!;
    expect(b.className.trim()).toBe("btn secondary sm square icon icon-only");
    expect(b.getAttribute("aria-label")).toBe("Menu");
    const bare = await mount<AcmeMenuButton>(`<acme-menu-button type="unstyled"><span>av</span></acme-menu-button>`);
    const r = bare.shadowRoot!.querySelector(".btn")!;
    expect(r.className.trim()).toBe("btn unstyled icon-only");
    expect(r.getAttribute("type")).toBe("button");
  });
});
