import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeMultiSelectRow } from "../../multi-select-row/multi-select-row";
import type { AcmeMultiSelect } from "../multi-select";

const items = (checked: string[] = ["a", "b"], extra = "") =>
  [
    ["a", "Design System"],
    ["b", "Components"],
    ["c", "Design Tokens"],
  ]
    .map(([v, n]) => `<acme-multi-select-row name="${n}" value="${v}"${checked.includes(v) ? " checked" : ""}${v === "c" ? extra : ""}></acme-multi-select-row>`)
    .join("");
const markup = (checked?: string[], extra = "", attrs = "") => `<acme-multi-select${attrs}><span slot="trigger">2 items selected</span>${items(checked, extra)}</acme-multi-select>`;

/** Waits out the update an `updated()` change queued, the rows' own updates included. */
const settle = async (el: AcmeMultiSelect) => {
  await el.updateComplete;
  await el.updateComplete;
  for (const r of el.rows) await r.updateComplete;
};
const mount = async (html: string) => {
  document.body.innerHTML = html;
  const el = document.body.firstElementChild as AcmeMultiSelect;
  await settle(el);
  return el;
};
const trigger = (el: AcmeMultiSelect) => el.shadowRoot!.querySelector(".trigger") as HTMLButtonElement;
const content = (el: AcmeMultiSelect) => el.shadowRoot!.querySelector(".content") as HTMLElement | null;
const button = (r: AcmeMultiSelectRow) => r.shadowRoot!.querySelector(".action") as HTMLButtonElement;
const hint = (r: AcmeMultiSelectRow) => r.shadowRoot!.querySelector(".hint")?.textContent ?? "";
const key = (target: EventTarget, k: string) => {
  const e = new KeyboardEvent("keydown", { key: k, bubbles: true, composed: true, cancelable: true });
  target.dispatchEvent(e);
  return e;
};

describe("acme-multi-select", () => {
  test("the trigger is a button that names a dialog, with the slotted text in its label and a chevron in its suffix; the list is not rendered while closed", async () => {
    const el = await mount(markup());
    const t = trigger(el);
    expect(t.tagName).toBe("BUTTON");
    expect(t.getAttribute("type")).toBe("button");
    expect(t.querySelector(".end")).not.toBeNull();
    expect(t.getAttribute("aria-haspopup")).toBe("dialog");
    expect(t.getAttribute("aria-expanded")).toBe("false");
    expect(t.getAttribute("data-state")).toBe("closed");
    expect(t.querySelector(".label .text slot[name=trigger]")).not.toBeNull();
    expect(t.querySelector(".end .chev svg")).not.toBeNull();
    expect(content(el)).toBeNull();
    expect(el.value).toEqual(["a", "b"]);
  });

  test("the rows learn the counts and read the hint for a mixed selection; a press on a checked row checks all, on an unchecked row checks it alone", async () => {
    const el = await mount(markup());
    const rows = el.rows;
    expect(rows.map((r) => r.selectedCount)).toEqual([2, 2, 2]);
    expect(rows.map((r) => r.totalCount)).toEqual([3, 3, 3]);
    expect(rows.map(hint)).toEqual(["Check All", "Check All", "Only"]);
    expect(button(rows[0]).getAttribute("aria-label")).toBe("Design System. Check All");
    const seen: { value: string[]; action: string }[] = [];
    el.addEventListener("acme-change", (e) => seen.push((e as CustomEvent).detail));
    button(rows[2]).click();
    await settle(el);
    expect(el.value).toEqual(["c"]);
    expect(seen[0]).toMatchObject({ value: ["c"], action: "selectOnly" });
    expect(el.rows.map(hint)).toEqual(["Only", "Only", "Check All"]);
    button(el.rows[2]).click();
    await settle(el);
    expect(el.value).toEqual(["a", "b", "c"]);
    expect(seen[1].action).toBe("selectAll");
    expect(el.rows.map(hint)).toEqual(["Only", "Only", "Only"]);
  });

  test("with nothing checked every hint reads Check and a press toggles; the hint press runs the action it names", async () => {
    const el = await mount(markup([]));
    expect(el.rows.map(hint)).toEqual(["Check", "Check", "Check"]);
    button(el.rows[1]).click();
    await settle(el);
    expect(el.value).toEqual(["b"]);
    (el.rows[0].shadowRoot!.querySelector(".hint") as HTMLElement).click();
    await settle(el);
    expect(el.value).toEqual(["a"]);
  });

  test("value set from outside checks those rows and no other, before and after the rows arrive", async () => {
    const el = await mount(markup(["a"]));
    el.value = ["b", "c"];
    await settle(el);
    expect(el.rows.map((r) => r.checked)).toEqual([false, true, true]);
    const late = await mount(`<acme-multi-select value='["c"]'><span slot="trigger">x</span></acme-multi-select>`);
    late.insertAdjacentHTML("beforeend", items([]));
    await new Promise((r) => setTimeout(r, 0));
    await settle(late);
    expect(late.value).toEqual(["c"]);
  });

  test("a cancelled acme-select leaves the selection alone", async () => {
    const el = await mount(markup());
    el.addEventListener("acme-select", (e) => e.preventDefault());
    button(el.rows[2]).click();
    await settle(el);
    expect(el.value).toEqual(["a", "b"]);
  });

  test("a click on the trigger opens the list as a dialog the trigger controls, and closes it again", async () => {
    const el = await mount(markup());
    const events: string[] = [];
    el.addEventListener("acme-open", () => events.push("open"));
    el.addEventListener("acme-close", () => events.push("close"));
    trigger(el).click();
    await settle(el);
    expect(el.open).toBe(true);
    const c = content(el)!;
    expect(c.getAttribute("role")).toBe("dialog");
    expect(c.getAttribute("tabindex")).toBe("-1");
    expect(c.getAttribute("data-state")).toBe("open");
    expect(trigger(el).getAttribute("aria-controls")).toBe(c.id);
    expect(trigger(el).getAttribute("aria-expanded")).toBe("true");
    expect(trigger(el).getAttribute("data-state")).toBe("open");
    trigger(el).click();
    await settle(el);
    expect(el.open).toBe(false);
    expect(content(el)!.getAttribute("data-state")).toBe("closed");
    expect(events).toEqual(["open", "close"]);
  });

  test("Arrow Down on the trigger opens; in the list the arrows move focus between the rows and keep the column, Left and Right switch it, Escape closes", async () => {
    const el = await mount(markup());
    key(trigger(el), "ArrowDown");
    await settle(el);
    expect(el.open).toBe(true);
    const c = content(el)!;
    key(c, "ArrowDown");
    await settle(el);
    expect(el.rows.map((r) => r.hovered)).toEqual([true, false, false]);
    expect(el.rows[0].focused).toBe(true);
    key(c, "ArrowLeft");
    await settle(el);
    expect(el.rows[0].checkboxHovered).toBe(true);
    expect(hint(el.rows[0])).toBe("Uncheck");
    key(c, "ArrowDown");
    await settle(el);
    expect(el.rows.map((r) => r.hovered)).toEqual([false, true, false]);
    expect(el.rows[1].checkboxHovered).toBe(true);
    key(c, "ArrowRight");
    await settle(el);
    expect(el.rows[1].checkboxHovered).toBe(false);
    expect(hint(el.rows[1])).toBe("Check All");
    key(c, "ArrowUp");
    key(c, "ArrowUp");
    await settle(el);
    expect(el.rows.map((r) => r.hovered)).toEqual([false, false, true]);
    key(c, "Escape");
    await settle(el);
    expect(el.open).toBe(false);
    expect(el.rows.map((r) => r.hovered)).toEqual([false, false, false]);
  });

  test("Enter on a focused row runs its action, or toggles it while the checkbox column is active", async () => {
    const el = await mount(markup());
    el.show();
    await settle(el);
    const c = content(el)!;
    key(c, "ArrowDown");
    await settle(el);
    key(button(el.rows[0]), "Enter");
    await settle(el);
    expect(el.value).toEqual(["a", "b", "c"]);
    key(c, "ArrowLeft");
    await settle(el);
    key(button(el.rows[0]), " ");
    await settle(el);
    expect(el.value).toEqual(["b", "c"]);
  });

  test("a press outside closes the list", async () => {
    const el = await mount(markup());
    el.show();
    await settle(el);
    document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true }));
    await settle(el);
    expect(el.open).toBe(false);
  });

  test("the rows' pointer states reach the list: a hovered row, then its checkbox", async () => {
    const el = await mount(markup());
    el.show();
    await settle(el);
    const r = el.rows[2];
    r.shadowRoot!.querySelector(".row")!.dispatchEvent(new MouseEvent("mouseenter"));
    await settle(el);
    expect(r.hovered).toBe(true);
    expect(r.shadowRoot!.querySelector(".row")!.className).toContain("hovered");
    r.shadowRoot!.querySelector(".box")!.dispatchEvent(new MouseEvent("mouseenter"));
    await settle(el);
    expect(r.checkboxHovered).toBe(true);
    expect(r.shadowRoot!.querySelector(".row")!.className).toContain("checkbox-hovered");
    expect(hint(r)).toBe("Check");
    r.shadowRoot!.querySelector(".row")!.dispatchEvent(new MouseEvent("mouseleave"));
    await settle(el);
    expect(r.hovered).toBe(false);
  });

  test("a disabled row takes no press; a disabled multi select does not open", async () => {
    const el = await mount(markup(["a", "b"], " disabled"));
    button(el.rows[2]).click();
    await settle(el);
    expect(el.value).toEqual(["a", "b"]);
    expect(el.rows[2].shadowRoot!.querySelector(".row")!.className).toContain("disabled");
    const off = await mount(markup(["a"], "", " disabled"));
    off.show();
    await settle(off);
    expect(off.open).toBe(false);
  });
});
