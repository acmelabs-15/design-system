import { describe, expect, test } from "bun:test";
import { detectPlatform } from "@tanstack/hotkeys";
import "../../../index";
import type { AcmeCommandItem } from "../../command-item/command-item";
import type { AcmeCommandMenu } from "../command-menu";

// A loose row and a divider before the groups: the menu keeps groups after loose rows, so this order holds after the mount.
const groups = `<acme-command-item>Item 1</acme-command-item><acme-command-divider></acme-command-divider><acme-command-group heading="Suggestions"><acme-command-item>Figma Import</acme-command-item></acme-command-group><acme-command-group heading="Commands"><acme-command-item>Import Extension</acme-command-item><acme-command-item value="manage">Manage Extensions<span slot="end">⌘</span></acme-command-item></acme-command-group>`;
const byLabel = (el: AcmeCommandMenu) => Object.fromEntries(items(el).map((r) => [r.label, r.hidden]));
const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.querySelector("acme-command-menu") as AcmeCommandMenu;
  await flush(el);
  return el;
};
/** Every pending update, the ones an update requests included. */
const flush = async (el: AcmeCommandMenu) => {
  do await el.updateComplete;
  while (el.isUpdatePending);
};
const shadow = (el: AcmeCommandMenu) => el.shadowRoot!;
const dialog = (el: AcmeCommandMenu) => shadow(el).querySelector("dialog") as HTMLDialogElement;
const input = (el: AcmeCommandMenu) => shadow(el).querySelector(".input") as HTMLInputElement;
const items = (el: AcmeCommandMenu) => Array.from(el.querySelectorAll("acme-command-item")) as AcmeCommandItem[];
const type = async (el: AcmeCommandMenu, text: string) => {
  const i = input(el);
  i.value = text;
  i.dispatchEvent(new Event("input", { bubbles: true }));
  await flush(el);
};
const key = (el: AcmeCommandMenu, k: string, init: KeyboardEventInit = {}) => {
  input(el).dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, composed: true, cancelable: true, ...init }));
};
const open = async (el: AcmeCommandMenu) => {
  el.show();
  await flush(el);
};

describe("acme-command-menu", () => {
  test("renders a closed native dialog with the input block and the list; open shows it in the top layer, locks scroll and focuses the searchbox", async () => {
    const el = await mount(`<acme-command-menu placeholder="What do you need?" label="Palette">${groups}</acme-command-menu>`);
    const d = dialog(el);
    expect(d.open).toBe(false);
    expect(d.hasAttribute("data-state")).toBe(false);
    expect(d.getAttribute("aria-label")).toBe("Palette");
    expect(d.getAttribute("aria-labelledby")).toBe("title");
    expect(shadow(el).querySelector(".title")?.textContent).toBe("Command Menu");
    expect(shadow(el).querySelector(".root > .label")?.getAttribute("for")).toBe("input");
    const i = input(el);
    expect(i.getAttribute("role")).toBe("combobox");
    expect(i.getAttribute("aria-expanded")).toBe("true");
    expect(i.getAttribute("placeholder")).toBe("What do you need?");
    expect(shadow(el).querySelector(".head .field .esc")?.textContent).toBe("Esc");
    expect(shadow(el).querySelector(".list[role=listbox] > .sizer > slot")).not.toBeNull();
    expect(shadow(el).querySelector(".crumbs")).toBeNull();
    let opened = 0;
    el.addEventListener("acme-open", () => opened++);
    await open(el);
    expect(d.open).toBe(true);
    expect(d.getAttribute("data-state")).toBe("open");
    expect(document.body.hasAttribute("data-scroll-lock")).toBe(true);
    expect(shadow(el).activeElement).toBe(i);
    expect(opened).toBe(1);
  });

  test("the first row is highlighted on open; the arrows move the highlight while focus stays in the searchbox; Home, End, Meta and Alt jump", async () => {
    const el = await mount(`<acme-command-menu>${groups}</acme-command-menu>`);
    await open(el);
    expect(items(el).map((r) => r.label)).toEqual(["Item 1", "Figma Import", "Import Extension", "Manage Extensions"]);
    expect(items(el).map((r) => r.selected)).toEqual([true, false, false, false]);
    expect(el.value).toBe("item 1");
    key(el, "ArrowDown");
    await flush(el);
    expect(items(el).map((r) => r.selected)).toEqual([false, true, false, false]);
    expect(shadow(el).activeElement).toBe(input(el));
    key(el, "End");
    await flush(el);
    expect(el.value).toBe("manage");
    key(el, "ArrowDown");
    await flush(el);
    expect(el.value).toBe("manage"); // no wrap past the end
    key(el, "ArrowUp", { metaKey: true });
    await flush(el);
    expect(el.value).toBe("item 1");
    key(el, "ArrowDown", { altKey: true });
    await flush(el);
    expect(el.value).toBe("figma import"); // a loose row steps
    key(el, "ArrowDown", { altKey: true });
    await flush(el);
    expect(el.value).toBe("import extension"); // the next group's first row
    key(el, "n", { ctrlKey: true });
    await flush(el);
    expect(el.value).toBe("manage");
    key(el, "Home");
    await flush(el);
    expect(el.value).toBe("item 1");
  });

  test("typing scores the rows: the others hide, groups without a match hide, dividers hide, the best row is highlighted; an unmatched query shows the empty message", async () => {
    const el = await mount(`<acme-command-menu>${groups}</acme-command-menu>`);
    await open(el);
    const typed: string[] = [];
    el.addEventListener("acme-input", (e) => typed.push((e as CustomEvent).detail.value));
    await type(el, "ext");
    expect(byLabel(el)).toEqual({ "Item 1": true, "Figma Import": true, "Import Extension": false, "Manage Extensions": true }); // the last row scores its value ("manage"), not its label
    expect((el.querySelector("acme-command-group") as HTMLElement).hidden).toBe(true);
    expect((el.querySelector("acme-command-divider") as HTMLElement).hidden).toBe(true);
    expect(items(el).find((r) => r.selected)?.label).toBe("Import Extension");
    expect(shadow(el).querySelector(".empty")).toBeNull();
    expect(typed).toEqual(["ext"]);
    await type(el, "zzz");
    expect(items(el).every((r) => r.hidden)).toBe(true);
    expect(shadow(el).querySelector(".empty .empty-text")?.textContent?.replace(/\s+/g, " ").trim()).toBe('No results found for "zzz".');
    expect(shadow(el).querySelector(".empty .query")?.textContent).toBe('"zzz"');
    await type(el, "");
    expect(items(el).every((r) => !r.hidden)).toBe(true);
    expect((el.querySelector("acme-command-divider") as HTMLElement).hidden).toBe(false);
  });

  test("a query sorts the rows by score and the matched groups by their best row; should-filter=false leaves everything as it is", async () => {
    const el = await mount(
      `<acme-command-menu><acme-command-group heading="A"><acme-command-item>Zebra</acme-command-item></acme-command-group><acme-command-group heading="B"><acme-command-item>Bravo Alpha</acme-command-item><acme-command-item>Alpha</acme-command-item></acme-command-group></acme-command-menu>`,
    );
    await open(el);
    await type(el, "alpha");
    const groups = Array.from(el.querySelectorAll("acme-command-group"));
    expect(groups.map((g) => g.getAttribute("heading"))).toEqual(["A", "B"]);
    expect(
      items(el)
        .filter((r) => !r.hidden)
        .map((r) => r.label),
    ).toEqual(["Alpha", "Bravo Alpha"]);
    expect(el.value).toBe("alpha");
    const plain = await mount(`<acme-command-menu should-filter="false"><acme-command-item>Zebra</acme-command-item><acme-command-item>Alpha</acme-command-item></acme-command-menu>`);
    await open(plain);
    await type(plain, "alpha");
    expect(items(plain).map((r) => [r.label, r.hidden])).toEqual([
      ["Zebra", false],
      ["Alpha", false],
    ]);
  });

  test("Enter selects the highlighted row: acme-select carries the value and the menu closes; close-on-callback=false and a canceled event keep it open", async () => {
    const el = await mount(`<acme-command-menu>${groups}</acme-command-menu>`);
    await open(el);
    const picked: string[] = [];
    el.addEventListener("acme-select", (e) => picked.push((e as CustomEvent).detail.value));
    await type(el, "manage");
    key(el, "Enter");
    await flush(el);
    expect(picked).toEqual(["manage"]);
    expect(el.open).toBe(false);
    const stay = await mount(`<acme-command-menu><acme-command-item close-on-callback="false">Keep</acme-command-item><acme-command-item>Go</acme-command-item></acme-command-menu>`);
    await open(stay);
    key(stay, "Enter");
    await flush(stay);
    expect(stay.open).toBe(true);
    stay.addEventListener("acme-select", (e) => e.preventDefault());
    key(stay, "ArrowDown");
    await flush(stay);
    key(stay, "Enter");
    await flush(stay);
    expect(stay.open).toBe(true);
  });

  test("Escape, the Esc chip and a press on the backdrop close the menu; acme-close fires once it has left and the page scrolls again", async () => {
    const el = await mount(`<acme-command-menu>${groups}</acme-command-menu>`);
    await open(el);
    let closed = 0;
    el.addEventListener("acme-close", () => closed++);
    dialog(el).dispatchEvent(new Event("cancel", { cancelable: true }));
    await flush(el);
    await new Promise((r) => setTimeout(r, 0));
    expect(el.open).toBe(false);
    expect(dialog(el).open).toBe(false);
    expect(document.body.hasAttribute("data-scroll-lock")).toBe(false);
    expect(closed).toBe(1);
    await open(el);
    (shadow(el).querySelector(".esc") as HTMLButtonElement).click();
    await flush(el);
    expect(el.open).toBe(false);
    await open(el);
    dialog(el).dispatchEvent(new PointerEvent("pointerdown", { button: 0, bubbles: true }));
    await flush(el);
    expect(el.open).toBe(false);
    await open(el);
    dialog(el).dispatchEvent(new PointerEvent("pointerdown", { button: 2, bubbles: true }));
    await flush(el);
    expect(el.open).toBe(true);
  });

  test("pages: the crumbs show the stack, the active page's placeholder and rows apply, a crumb and Backspace on an empty searchbox go up, addPage goes down", async () => {
    const el = await mount(
      `<acme-command-menu placeholder="Root…" pages='[{"label":"Home"},{"label":"Projects","placeholder":"Search projects…"}]'><acme-command-item>Root Row</acme-command-item><acme-command-group heading="Projects" page="Projects"><acme-command-item>acme-site</acme-command-item></acme-command-group></acme-command-menu>`,
    );
    await open(el);
    const crumbs = Array.from(shadow(el).querySelectorAll(".crumbs acme-breadcrumbs[type=menu] acme-breadcrumb"));
    expect(crumbs.map((c) => c.textContent)).toEqual(["Home", "Projects"]);
    expect(input(el).getAttribute("placeholder")).toBe("Search projects…");
    expect(items(el).map((r) => r.hidden)).toEqual([true, false]);
    expect(el.value).toBe("acme-site");
    const stacks: number[] = [];
    el.addEventListener("acme-pages", (e) => stacks.push((e as CustomEvent).detail.pages.length));
    key(el, "Backspace");
    await flush(el);
    expect(el.pages.map((p) => p.label)).toEqual(["Home"]);
    expect(input(el).getAttribute("placeholder")).toBe("Root…");
    expect(items(el).map((r) => r.hidden)).toEqual([false, true]);
    expect(shadow(el).querySelectorAll(".crumbs acme-breadcrumb").length).toBe(1);
    el.addPage({ label: "Projects", placeholder: "Search projects…" });
    await flush(el);
    expect(shadow(el).querySelectorAll(".crumbs acme-breadcrumb").length).toBe(2);
    (shadow(el).querySelector(".crumbs acme-breadcrumb") as HTMLElement).click();
    await flush(el);
    expect(el.pages.length).toBe(1);
    expect(stacks).toEqual([1, 2, 1]);
    // A typed query blocks Backspace from leaving the page until it has emptied and settled.
    el.addPage({ label: "Projects" });
    await flush(el);
    await type(el, "a");
    await type(el, "");
    key(el, "Backspace");
    await flush(el);
    expect(el.pages.length).toBe(2);
  });

  test("the hotkey toggles the menu from the document; hotkey=false turns it off", async () => {
    const el = await mount(`<acme-command-menu>${groups}</acme-command-menu>`);
    const mod = detectPlatform() === "mac" ? { metaKey: true } : { ctrlKey: true };
    const press = () => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", code: "KeyK", ...mod, bubbles: true, cancelable: true }));
    press();
    await flush(el);
    expect(el.open).toBe(true);
    press();
    await flush(el);
    expect(el.open).toBe(false);
    el.hotkey = "false";
    await flush(el);
    press();
    await flush(el);
    expect(el.open).toBe(false);
  });

  test("rows: the row renders its parts, a keybind as kbd chips, a disabled row takes no highlight or selection; groups and dividers render their boxes", async () => {
    const el = await mount(
      `<acme-command-menu><acme-command-group heading="Actions"><acme-command-item keybind="Meta D"><svg slot="start"></svg>Deploy<span slot="end">S</span></acme-command-item><acme-command-item disabled>Archive</acme-command-item></acme-command-group><acme-command-divider></acme-command-divider></acme-command-menu>`,
    );
    await open(el);
    const [row, off] = items(el);
    await row.updateComplete;
    const box = row.shadowRoot!.querySelector(".item") as HTMLElement;
    expect(box.getAttribute("role")).toBe("option");
    expect(box.getAttribute("data-value")).toBe("deploy");
    expect(box.getAttribute("aria-selected")).toBe("true");
    expect(box.getAttribute("data-selected")).toBe("true");
    expect(box.querySelector(".start > slot[name=start]")).not.toBeNull();
    expect(Array.from(box.querySelectorAll(".keys > kbd.key")).map((k) => k.textContent)).toEqual(["⌘", "D"]);
    expect(box.querySelector(".end > slot[name=end]")).not.toBeNull();
    expect(off.shadowRoot!.querySelector(".item")?.getAttribute("aria-disabled")).toBe("true");
    key(el, "ArrowDown");
    await flush(el);
    expect(el.value).toBe("deploy");
    let picked = 0;
    el.addEventListener("acme-select", () => picked++);
    off.select();
    expect(picked).toBe(0);
    const g = el.querySelector("acme-command-group")!;
    expect(g.shadowRoot!.querySelector(".group > .heading")?.textContent).toBe("Actions");
    expect(g.shadowRoot!.querySelector(".group > .items[role=group] > slot")).not.toBeNull();
    expect(el.querySelector("acme-command-divider")!.shadowRoot!.querySelector(".divider[role=separator]")).not.toBeNull();
  });

  test("loading renders the bar under the input block; value from outside highlights that row", async () => {
    const el = await mount(`<acme-command-menu loading>${groups}</acme-command-menu>`);
    await open(el);
    expect(shadow(el).querySelector(".head > .loading")).not.toBeNull();
    el.value = "manage";
    await flush(el);
    expect(
      items(el)
        .filter((r) => r.selected)
        .map((r) => r.label),
    ).toEqual(["Manage Extensions"]);
  });
});
