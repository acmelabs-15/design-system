import { describe, expect, test } from "bun:test";
import "../../../all";
const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  for (let n = 0; n < 3; n++) for (const el of document.querySelectorAll("*")) if ("updateComplete" in el) await el.updateComplete;
  return document.body.firstElementChild!;
};
describe("Menu authoring contracts", () => {
  test("public defaults and canonical store", async () => {
    const menu = (await mount("<acme-menu></acme-menu>")) as HTMLElementTagNameMap["acme-menu"];
    expect(menu.open).toBe(false);
    expect(menu.closeOnSelect).toBe(true);
    expect(menu.loop).toBe(true);
    expect(menu.placement).toBe("bottom-start");
    expect(menu.sideOffset).toBe(4);
    menu.setAttribute("close-on-select", "false");
    expect(menu.closeOnSelect).toBe(false);
    menu.removeAttribute("close-on-select");
    expect(menu.closeOnSelect).toBe(true);
    expect("position" in menu).toBe(false);
    expect("rotate" in menu).toBe(false);
  });
  test("native disabled links cannot navigate", async () => {
    const item = (await mount('<acme-menu-item value="docs" href="/docs" disabled>Docs</acme-menu-item>')) as HTMLElementTagNameMap["acme-menu-item"];
    const link = item.shadowRoot!.querySelector("a")!;
    expect(link.hasAttribute("href")).toBe(false);
    expect(link.getAttribute("aria-disabled")).toBe("true");
    expect(link.getAttribute("role")).toBe("menuitem");
    const event = new MouseEvent("click", { cancelable: true, bubbles: true });
    link.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });
  test("checked types and descriptions retain native semantics", async () => {
    const item = await mount('<acme-menu-item type="checkbox" value="status" checked>Status<span slot="description">Visibility</span></acme-menu-item>');
    const root = item.shadowRoot!.querySelector("[part=root]")!;
    expect(root.getAttribute("role")).toBe("menuitemcheckbox");
    expect(root.getAttribute("aria-checked")).toBe("true");
    expect((root as HTMLElement).ariaDescribedByElements?.[0]).toBe(item.shadowRoot!.querySelector(".description"));
  });
  test("programmatic visibility does not fabricate a user notification", async () => {
    const menu = (await mount("<acme-menu></acme-menu>")) as HTMLElementTagNameMap["acme-menu"];
    let changes = 0;
    menu.addEventListener("acme-open-change", () => changes++);
    menu.show();
    expect(menu.open).toBe(true);
    menu.hide();
    expect(menu.open).toBe(false);
    expect(changes).toBe(0);
  });
  test("typeahead text excludes descriptions, affixes and submenus", async () => {
    const item = (await mount(
      '<acme-menu-item value="export">Export<span slot="description">Details</span><span slot="end">Shortcut</span><acme-menu slot="submenu"></acme-menu></acme-menu-item>',
    )) as HTMLElementTagNameMap["acme-menu-item"];
    expect(item.label).toBe("Export");
    item.textValue = "Download";
    expect(item.label).toBe("Download");
  });
});
