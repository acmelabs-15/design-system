import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeComboboxOption } from "../../combobox-option/combobox-option";
import type { AcmeCombobox } from "../combobox";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeCombobox;
  await el.updateComplete;
  await settle(el);
  return el;
};
/** Waits out the update an `updated()` change queued, the rows' own updates included. */
const settle = async (el: AcmeCombobox) => {
  await el.updateComplete;
  await el.updateComplete;
  for (const o of el.querySelectorAll("acme-combobox-option")) await o.updateComplete;
};
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const three = `<acme-combobox-option value="a">One</acme-combobox-option><acme-combobox-option value="b">Two</acme-combobox-option><acme-combobox-option value="c">Three</acme-combobox-option>`;
const shell = (el: AcmeCombobox) => el.shadowRoot!.querySelector(".combobox") as HTMLElement;
const input = (el: AcmeCombobox) => el.shadowRoot!.querySelector(".input") as HTMLInputElement;
const rows = (el: AcmeCombobox) => Array.from(el.querySelectorAll("acme-combobox-option")) as AcmeComboboxOption[];
const type = async (el: AcmeCombobox, text: string) => {
  const i = input(el);
  i.value = text;
  i.dispatchEvent(new Event("input", { bubbles: true }));
  await settle(el);
};
const key = (target: EventTarget, k: string) => {
  const e = new KeyboardEvent("keydown", { key: k, bubbles: true, composed: true, cancelable: true });
  target.dispatchEvent(e);
  return e;
};

describe("acme-combobox", () => {
  test("the shell is a combobox around a searchbox with the glass, the hidden clear button and the menu button; the rows are not rendered while closed", async () => {
    const el = await mount(`<acme-combobox aria-label="Search" placeholder="Search...">${three}</acme-combobox>`);
    const s = shell(el);
    expect(s.getAttribute("role")).toBe("combobox");
    expect(s.getAttribute("aria-expanded")).toBe("false");
    expect(s.getAttribute("aria-haspopup")).toBe("listbox");
    expect(s.className.trim()).toBe("combobox");
    const i = input(el);
    expect(i.getAttribute("role")).toBe("searchbox");
    expect(i.getAttribute("aria-label")).toBe("Search");
    expect(i.getAttribute("aria-autocomplete")).toBe("list");
    expect(i.getAttribute("aria-controls")).toBe(s.getAttribute("aria-controls"));
    expect(el.shadowRoot!.querySelector(".prefix .icon")).not.toBeNull();
    expect((el.shadowRoot!.querySelector(".clear") as HTMLElement).getAttribute("style")).toContain("display:none");
    expect(el.shadowRoot!.querySelector(".toggle")!.getAttribute("aria-label")).toBe("Open menu");
    expect(el.shadowRoot!.querySelector(".floating")).toBeNull();
    expect(el.shadowRoot!.querySelector("slot:not([name])")).toBeNull();
  });

  test("a value shows its row's label, swaps the menu button for the clear button and marks the row once open", async () => {
    const el = await mount(`<acme-combobox aria-label="Search" value="b">${three}</acme-combobox>`);
    expect(input(el).value).toBe("Two");
    expect((el.shadowRoot!.querySelector(".clear") as HTMLElement).getAttribute("style")).toBeNull();
    expect(el.shadowRoot!.querySelector(".toggle")).toBeNull();
    el.open = true;
    await settle(el);
    expect(rows(el).map((o) => o.chosen)).toEqual([false, true, false]);
    expect(rows(el).map((o) => o.active)).toEqual([true, false, false]);
    expect(rows(el)[1].shadowRoot!.querySelector(".check")).not.toBeNull();
  });

  test("open renders the list in a manual popover at the field's width with every row, the first highlighted and announced", async () => {
    const el = await mount(`<acme-combobox aria-label="Search">${three}</acme-combobox>`);
    let opened = 0;
    el.addEventListener("acme-open", () => opened++);
    el.open = true;
    await settle(el);
    expect(opened).toBe(1);
    const floating = el.shadowRoot!.querySelector(".floating") as HTMLElement;
    expect(floating.getAttribute("popover")).toBe("manual");
    const list = el.shadowRoot!.querySelector(".list") as HTMLElement;
    expect(list.getAttribute("role")).toBe("dialog");
    expect(list.dataset.pristine).toBe("true");
    // Three rows of the default 36px in the 6px padding: 3 * 36 + 12; five and a half rows at most.
    expect(list.style.height).toBe("120px");
    expect(list.style.maxHeight).toBe("210px");
    expect(list.style.overflowY).toBe("hidden");
    expect(el.shadowRoot!.querySelector(".options")!.getAttribute("role")).toBe("listbox");
    expect(shell(el).className).toContain("open");
    expect(el.shadowRoot!.querySelector(".toggle")!.getAttribute("aria-label")).toBe("Close menu");
    expect(input(el).getAttribute("aria-activedescendant")).toBe(rows(el)[0].rowId);
    expect(el.shadowRoot!.querySelector(".status")!.textContent).toBe("3 results available");
    expect(rows(el).map((o) => o.hidden)).toEqual([false, false, false]);
  });

  test("typing filters and ranks the rows, highlights the first match and marks the list typed; Enter takes it, closes and fills the label after a beat", async () => {
    const el = await mount(`<acme-combobox aria-label="Search">${three}</acme-combobox>`);
    const inputs: string[] = [];
    el.addEventListener("acme-input", (e) => inputs.push((e as CustomEvent).detail.value));
    await type(el, "tw");
    expect(el.open).toBe(true);
    expect(inputs).toEqual(["tw"]);
    expect((el.shadowRoot!.querySelector(".list") as HTMLElement).dataset.pristine).toBe("false");
    expect(rows(el).map((o) => o.hidden)).toEqual([true, false, true]);
    expect(rows(el).map((o) => o.active)).toEqual([false, true, false]);
    // Two rows starting with the text tie on rank and sort by their text: Three lists before Two, and the rows move to match.
    await type(el, "t");
    expect(rows(el).map((o) => o.value)).toEqual(["a", "c", "b"]);
    expect(rows(el).map((o) => o.active)).toEqual([false, true, false]);
    await type(el, "tw");
    let changed: string | null | undefined;
    el.addEventListener("acme-change", (e) => {
      changed = (e as CustomEvent).detail.value;
    });
    const e = key(input(el), "Enter");
    await settle(el);
    expect(e.defaultPrevented).toBe(true);
    expect(changed).toBe("b");
    expect(el.value).toBe("b");
    expect(el.open).toBe(false);
    expect(input(el).value).toBe("tw");
    await wait(170);
    await settle(el);
    expect(input(el).value).toBe("Two");
    expect(rows(el).map((o) => o.hidden)).toEqual([false, false, false]);
  });

  test("no match shows the empty message and announces it; a custom message replaces it", async () => {
    const el = await mount(`<acme-combobox aria-label="Search" empty-message="Nothing to see here...">${three}</acme-combobox>`);
    await type(el, "zzz");
    expect(el.shadowRoot!.querySelector(".empty")!.textContent).toBe("Nothing to see here...");
    expect(el.shadowRoot!.querySelector(".status")!.textContent).toBe("Nothing to see here...");
    expect((el.shadowRoot!.querySelector(".list") as HTMLElement).style.height).toBe("48px");
    const plain = await mount(`<acme-combobox aria-label="Search"></acme-combobox>`);
    plain.open = true;
    await settle(plain);
    expect(plain.shadowRoot!.querySelector(".empty")!.textContent).toBe("No results");
  });

  test("the arrows move the highlight around the ends and past a disabled row; Home and End jump; Escape closes", async () => {
    const el = await mount(
      `<acme-combobox aria-label="Search"><acme-combobox-option value="a">One</acme-combobox-option><acme-combobox-option value="b" disabled>Two</acme-combobox-option><acme-combobox-option value="c">Three</acme-combobox-option></acme-combobox>`,
    );
    const i = input(el);
    key(i, "ArrowDown");
    await settle(el);
    expect(el.open).toBe(true);
    expect(rows(el).map((o) => o.active)).toEqual([true, false, false]);
    key(i, "ArrowDown");
    await settle(el);
    expect(rows(el).map((o) => o.active)).toEqual([false, false, true]);
    key(i, "ArrowDown");
    await settle(el);
    expect(rows(el).map((o) => o.active)).toEqual([true, false, false]);
    key(i, "ArrowUp");
    await settle(el);
    expect(rows(el).map((o) => o.active)).toEqual([false, false, true]);
    key(i, "Home");
    await settle(el);
    expect(el.getSelectedIndex()).toBe(0);
    key(i, "End");
    await settle(el);
    expect(el.getSelectedIndex()).toBe(2);
    let closed = 0;
    el.addEventListener("acme-close", () => closed++);
    key(i, "Escape");
    await settle(el);
    expect(el.open).toBe(false);
    expect(closed).toBe(1);
    expect(el.shadowRoot!.querySelector(".floating")).toBeNull();
  });

  test("the clear button empties the value and the field and fires acme-clear and acme-change with null", async () => {
    const el = await mount(`<acme-combobox aria-label="Search" value="b">${three}</acme-combobox>`);
    const events: string[] = [];
    el.addEventListener("acme-clear", () => events.push("clear"));
    el.addEventListener("acme-change", (e) => events.push(`change:${(e as CustomEvent).detail.value}`));
    (el.shadowRoot!.querySelector(".clear") as HTMLButtonElement).click();
    await settle(el);
    expect(events).toEqual(["clear", "change:null"]);
    expect(el.value).toBe("");
    expect(el.open).toBe(false);
    expect(input(el).value).toBe("");
    expect(el.shadowRoot!.querySelector(".toggle")).not.toBeNull();
  });

  test("a row's pointer release chooses it; a handler that prevents acme-select takes the choice over", async () => {
    const el = await mount(`<acme-combobox aria-label="Search">${three}</acme-combobox>`);
    el.open = true;
    await settle(el);
    rows(el)[2]
      .shadowRoot!.querySelector(".option")!
      .dispatchEvent(new MouseEvent("mouseup", { bubbles: true, composed: true, cancelable: true }));
    await settle(el);
    expect(el.value).toBe("c");
    expect(el.open).toBe(false);
    const custom = await mount(`<acme-combobox aria-label="Search">${three}</acme-combobox>`);
    rows(custom)[0].addEventListener("acme-select", (e) => e.preventDefault());
    custom.open = true;
    await settle(custom);
    rows(custom)[0].select();
    await settle(custom);
    expect(custom.value).toBe("");
    expect(custom.open).toBe(true);
  });

  test("size, errored, loading, width, no-input-prefix, show-menu-button and display-selected-suffix map to the classes and the parts", async () => {
    const el = await mount(`<acme-combobox aria-label="Search" errored loading size="small" width="256" no-input-prefix show-menu-button="false">${three}</acme-combobox>`);
    const s = shell(el);
    for (const c of ["sm", "errored", "loading", "no-prefix", "no-menu"]) expect(s.className).toContain(c);
    expect(s.getAttribute("style")).toContain("width:256px");
    expect(input(el).getAttribute("aria-invalid")).toBe("true");
    expect(el.shadowRoot!.querySelector(".prefix")).toBeNull();
    expect(el.shadowRoot!.querySelector(".toggle")).toBeNull();
    const loading = await mount(`<acme-combobox aria-label="Search" loading>${three}</acme-combobox>`);
    expect(loading.shadowRoot!.querySelector(".prefix acme-spinner")).not.toBeNull();
    const suffix = await mount(
      `<acme-combobox aria-label="Search" display-selected-suffix value="b"><acme-combobox-option value="b"><svg slot="suffix" width="16" height="16"></svg>Two</acme-combobox-option></acme-combobox>`,
    );
    expect(shell(suffix).className).toContain("with-suffix");
    expect(suffix.shadowRoot!.querySelector(".suffix svg")).not.toBeNull();
    expect(input(suffix).style.paddingRight).toContain("var(--acme-gap)");
    expect(rows(suffix)[0].size).toBe("medium");
    expect(rows(el)[0].size).toBe("small");
  });

  test("the footer slot renders under the rows while open; Arrow Down past the last row moves focus into it and back", async () => {
    const el = await mount(`<acme-combobox aria-label="Search">${three}<button slot="footer">Create new</button></acme-combobox>`);
    const i = input(el);
    key(i, "ArrowDown");
    await settle(el);
    expect(el.shadowRoot!.querySelector(".footer slot[name=footer]")).not.toBeNull();
    key(i, "End");
    await settle(el);
    key(i, "ArrowDown");
    await settle(el);
    expect(el.getSelectedIndex()).toBe(-1);
    expect(rows(el).map((o) => o.active)).toEqual([true, false, false]);
    const button = el.querySelector("button")!;
    key(button, "ArrowUp");
    await settle(el);
    expect(el.getSelectedIndex()).toBe(2);
    expect(el.open).toBe(true);
  });

  test("the form value follows the value, a reset restores the attribute, and a value no row carries shows raw unless no-raw-selected-value", async () => {
    const el = await mount(`<form><acme-combobox name="pick" aria-label="Search" value="a">${three}</acme-combobox></form>`).then((f) => f.querySelector("acme-combobox") as AcmeCombobox);
    el.value = "zz";
    await settle(el);
    expect(input(el).value).toBe("zz");
    // happy-dom has no ElementInternals: the form's reset is played straight to the callback.
    el.formResetCallback();
    await settle(el);
    expect(el.value).toBe("a");
    await wait(170);
    await settle(el);
    expect(input(el).value).toBe("One");
    const raw = await mount(`<acme-combobox aria-label="Search" no-raw-selected-value value="zz">${three}</acme-combobox>`);
    expect(input(raw).value).toBe("");
  });
});

describe("acme-combobox-option", () => {
  test("a plain row wraps its text in the label span; rich content renders as given with the value as its text", async () => {
    document.body.innerHTML = `<acme-combobox-option value="k" ignore-default-height truncate-prefix><span slot="prefix">i</span>Key</acme-combobox-option>`;
    const el = document.body.firstElementChild as AcmeComboboxOption;
    await el.updateComplete;
    await el.updateComplete;
    const o = el.shadowRoot!.querySelector(".option") as HTMLElement;
    expect(o.getAttribute("role")).toBe("option");
    expect(o.className).toContain("auto");
    expect(o.className).toContain("truncate-prefix");
    expect(o.querySelector(".prefix slot[name=prefix]")).not.toBeNull();
    expect(o.querySelector(".label")!.getAttribute("title")).toBe("Key");
    expect(el.text).toBe("Key");
    document.body.innerHTML = `<acme-combobox-option value="DATABASE_URL::Production"><div><p>DATABASE_URL</p><p>Production</p></div></acme-combobox-option>`;
    const rich = document.body.firstElementChild as AcmeComboboxOption;
    await rich.updateComplete;
    await rich.updateComplete;
    expect(rich.shadowRoot!.querySelector(".label")).toBeNull();
    expect(rich.text).toBe("DATABASE_URL::Production");
    rich.label = "Database";
    expect(rich.text).toBe("Database");
  });
});
