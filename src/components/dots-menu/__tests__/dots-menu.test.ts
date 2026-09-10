import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeMenu } from "../../menu/menu";
import type { AcmeMenuButton } from "../../menu-button/menu-button";
import type { AcmeDotsMenu } from "../dots-menu";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeDotsMenu;
  await el.updateComplete;
  return el;
};
/** Waits out the updates the composed menu and its trigger queue after the host's own. */
const settle = async (el: AcmeDotsMenu) => {
  await el.updateComplete;
  const menu = el.shadowRoot!.querySelector("acme-menu") as AcmeMenu;
  await menu.updateComplete;
  await menu.updateComplete;
  await (menu.querySelector("acme-menu-button") as AcmeMenuButton).updateComplete;
  await el.updateComplete;
};
const items = `<acme-menu-item>View Build Logs</acme-menu-item><acme-menu-item>View Projects</acme-menu-item><acme-menu-item>View Analytics</acme-menu-item>`;
const menuOf = (el: AcmeDotsMenu) => el.shadowRoot!.querySelector("acme-menu") as AcmeMenu;
const triggerOf = (el: AcmeDotsMenu) => menuOf(el).querySelector("acme-menu-button") as AcmeMenuButton;
const buttonOf = (el: AcmeDotsMenu) => triggerOf(el).shadowRoot!.querySelector("button") as HTMLButtonElement;

describe("acme-dots-menu", () => {
  test("composes a bottom-end menu around a small square tertiary trigger named Menu, the dots 18px wide", async () => {
    const el = await mount(`<acme-dots-menu>${items}</acme-dots-menu>`);
    await settle(el);
    const menu = menuOf(el);
    expect(menu.position).toBe("bottom-end");
    expect(menu.closeOnSelect).toBe(true);
    const trigger = triggerOf(el);
    expect(trigger.getAttribute("slot")).toBe("trigger");
    expect(trigger.variant).toBe("tertiary");
    expect(trigger.shape).toBe("square");
    expect(trigger.size).toBe("small");
    expect(trigger.getAttribute("part")).toBe("trigger");
    const button = buttonOf(el);
    expect(button.className).toContain("tertiary");
    expect(button.className).toContain("square");
    expect(button.className).toContain("sm");
    expect(button.className).toContain("icon-only");
    expect(button.getAttribute("aria-label")).toBe("Menu");
    expect(button.disabled).toBe(false);
    const svg = trigger.querySelector(".wrap > .icon > svg") as SVGElement;
    expect(svg.getAttribute("width")).toBe("18");
    expect(svg.getAttribute("height")).toBe("18");
    expect(svg.getAttribute("viewBox")).toBe("0 0 16 16");
    expect(svg.querySelector("path")!.getAttribute("d")!.startsWith("M4 8")).toBe(true);
  });

  test("icon-size sizes the dots; horizontal=false stacks them; label names the trigger", async () => {
    const el = await mount(`<acme-dots-menu icon-size="10" horizontal="false" label="More">${items}</acme-dots-menu>`);
    await settle(el);
    const svg = triggerOf(el).querySelector("svg") as SVGElement;
    expect(svg.getAttribute("width")).toBe("10");
    expect(svg.getAttribute("height")).toBe("10");
    expect(svg.querySelector("path")!.getAttribute("d")!.startsWith("M8 4")).toBe(true);
    expect(buttonOf(el).getAttribute("aria-label")).toBe("More");
  });

  test("the slotted rows are the menu's items, through the forwarded slot", async () => {
    const el = await mount(`<acme-dots-menu>${items}</acme-dots-menu>`);
    await settle(el);
    expect(menuOf(el).items.map((i) => i.textContent?.trim())).toEqual(["View Build Logs", "View Projects", "View Analytics"]);
  });

  test("disabled disables the trigger and marks its host", async () => {
    const el = await mount(`<acme-dots-menu disabled>${items}</acme-dots-menu>`);
    await settle(el);
    expect(triggerOf(el).hasAttribute("disabled")).toBe(true);
    expect(buttonOf(el).disabled).toBe(true);
  });

  test("close-on-select and height reach the menu", async () => {
    const el = await mount(`<acme-dots-menu close-on-select="false" height="120">${items}</acme-dots-menu>`);
    await settle(el);
    expect(menuOf(el).closeOnSelect).toBe(false);
    expect(menuOf(el).height).toBe(120);
  });

  test("open follows the menu both ways, and acme-open and acme-close fire again from the host", async () => {
    const el = await mount(`<acme-dots-menu>${items}</acme-dots-menu>`);
    await settle(el);
    const kinds: string[] = [];
    el.addEventListener("acme-open", (e) => kinds.push(`open:${(e as CustomEvent).detail.kind}`));
    el.addEventListener("acme-close", (e) => kinds.push(`close:${(e as CustomEvent).detail.kind}`));
    el.show("keyboard");
    await settle(el);
    expect(menuOf(el).open).toBe(true);
    expect(el.open).toBe(true);
    expect(el.hasAttribute("open")).toBe(true);
    expect(triggerOf(el).getAttribute("aria-expanded")).toBe("true");
    el.open = false;
    await settle(el);
    expect(menuOf(el).open).toBe(false);
    expect(kinds).toEqual(["open:keyboard", "close:pointer"]);
  });
});
