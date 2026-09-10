import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeSplitButtonItem } from "../../split-button-item/split-button-item";
import type { AcmeSplitButton } from "../split-button";

const mount = async <T extends HTMLElement & { updateComplete: Promise<boolean> }>(markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as T;
  await el.updateComplete;
  return el;
};
const items = `<acme-split-button-item slot="items" description="Save changes">Save</acme-split-button-item><acme-split-button-item slot="items" description="Save changes and create a new production deployment">Save + Redeploy</acme-split-button-item>`;
const sr = (el: HTMLElement) => el.shadowRoot!;

describe("acme-split-button", () => {
  test("two composed buttons of the variant and size in a divided row; the chevron carries the menu label", async () => {
    const el = await mount<AcmeSplitButton>(`<acme-split-button variant="secondary" size="small" menu-button-label="Select save method">Save${items}</acme-split-button>`);
    const split = sr(el).querySelector(".split")!;
    expect(split.className.trim()).toBe("split sm secondary");
    expect(split.getAttribute("style")).toBe("--divider-color:var(--ds-gray-300)");
    const [main, trigger] = split.querySelectorAll("acme-button");
    expect(main.className).toBe("main");
    expect(main.getAttribute("variant")).toBe("secondary");
    expect(main.getAttribute("size")).toBe("small");
    expect(main.getAttribute("type")).toBe("button");
    expect(main.querySelector("slot:not([name])")).not.toBeNull();
    expect(trigger.className).toBe("trigger");
    expect(trigger.getAttribute("aria-label")).toBe("Select save method");
    expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.querySelector(".inner svg")).not.toBeNull();
    expect(sr(el).querySelector(".menu")).toBeNull();
    const p = await mount<AcmeSplitButton>(`<acme-split-button>Save</acme-split-button>`);
    expect(sr(p).querySelector(".split")!.className.trim()).toBe("split");
    expect(sr(p).querySelector("acme-button")!.getAttribute("variant")).toBe("default");
    expect(sr(p).querySelector(".split")!.getAttribute("style")).toBe("--divider-color:var(--ds-gray-alpha-900)");
  });

  test("the chevron opens a role=menu list of the given width and alignment; Escape starts the fade and closes", async () => {
    const el = await mount<AcmeSplitButton>(`<acme-split-button menu-alignment="bottom-end" menu-width="264">Save${items}</acme-split-button>`);
    sr(el).querySelector<HTMLElement>("acme-button.trigger")!.click();
    await el.updateComplete;
    await el.updateComplete;
    const menu = sr(el).querySelector(".popover > .menu")!;
    expect(menu.className.trim()).toBe("menu end");
    expect(menu.getAttribute("data-phase")).toBe("entered");
    const list = menu.querySelector("ul.list")!;
    expect(list.getAttribute("role")).toBe("menu");
    expect(list.getAttribute("style")).toBe("width:264px");
    expect(list.id).toBe(sr(el).querySelector("acme-button.trigger")!.getAttribute("aria-controls") ?? "");
    expect(list.querySelector("slot[name=items]")).not.toBeNull();
    list.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(sr(el).querySelector(".menu")!.getAttribute("data-phase")).toBe("exiting");
    await new Promise((r) => setTimeout(r, 450));
    expect(sr(el).querySelector(".menu")).toBeNull();
  });

  test("the primary button fires acme-click; an item fires acme-select and closes the menu", async () => {
    const el = await mount<AcmeSplitButton>(`<acme-split-button open>Save${items}</acme-split-button>`);
    const seen: string[] = [];
    el.addEventListener("acme-click", () => seen.push("click"));
    el.addEventListener("acme-select", (e) => seen.push(`select:${(e.target as HTMLElement).textContent!.trim()}`));
    sr(el).querySelector<HTMLElement>("acme-button.main")!.click();
    const second = el.querySelectorAll<AcmeSplitButtonItem>("acme-split-button-item")[1];
    second.shadowRoot!.querySelector<HTMLElement>(".item")!.click();
    await el.updateComplete;
    expect(seen).toEqual(["click", "select:Save + Redeploy"]);
    expect(el.open).toBe(false);
  });
});

describe("acme-split-button-item", () => {
  test("a menuitem row: the icon slot and title in a row, the description below; disabled rows do not select", async () => {
    const el = await mount<AcmeSplitButtonItem>(`<acme-split-button-item description="Open this page in v0"><svg slot="icon"></svg>Open in v0</acme-split-button-item>`);
    const li = sr(el).querySelector("li.item")!;
    expect(li.getAttribute("role")).toBe("menuitem");
    expect(li.getAttribute("tabindex")).toBe("-1");
    expect(li.getAttribute("style")).toContain("--acme-icon-size:18px");
    expect(li.querySelector(".body > .row > slot[name=icon]")).not.toBeNull();
    expect(li.querySelector(".body > .row > .title > slot")).not.toBeNull();
    expect(li.querySelector(".body > .desc")!.textContent).toBe("Open this page in v0");
    const plain = await mount<AcmeSplitButtonItem>(`<acme-split-button-item disabled>Save</acme-split-button-item>`);
    const row = sr(plain).querySelector("li.item")!;
    expect(row.querySelector(".desc")).toBeNull();
    expect(row.getAttribute("aria-disabled")).toBe("true");
    let fired = false;
    plain.addEventListener("acme-select", () => (fired = true));
    (row as HTMLElement).click();
    expect(fired).toBe(false);
  });
});
