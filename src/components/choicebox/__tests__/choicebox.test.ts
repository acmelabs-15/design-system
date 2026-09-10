import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeChoiceboxItem } from "../../choicebox-item/choicebox-item";
import type { AcmeChoicebox } from "../choicebox";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeChoicebox;
  await el.updateComplete;
  for (const it of el.items) await it.updateComplete;
  await el.updateComplete;
  for (const it of el.items) await it.updateComplete;
  return el;
};
const tile = (it: AcmeChoiceboxItem) => it.shadowRoot!.querySelector(".tile") as HTMLElement;
const control = (it: AcmeChoiceboxItem) => it.shadowRoot!.querySelector("acme-radio, acme-checkbox") as HTMLElement & { checked: boolean; disabled: boolean; skipTab?: boolean };
const items = `<acme-choicebox-item description="Free for two weeks" title="Pro Trial" value="trial"></acme-choicebox-item><acme-choicebox-item description="Get started now" title="Pro" value="pro"></acme-choicebox-item>`;

describe("acme-choicebox", () => {
  test("a radio group renders a radiogroup of tiles, each a label around a composed acme-radio, the chosen one checked", async () => {
    const el = await mount(`<acme-choicebox label="select a plan" type="radio" value="trial">${items}</acme-choicebox>`);
    const group = el.shadowRoot!.querySelector(".group") as HTMLElement;
    expect(group.getAttribute("role")).toBe("radiogroup");
    expect(group.getAttribute("aria-label")).toBe("select a plan");
    expect(group.getAttribute("aria-multiselectable")).toBe("false");
    expect(el.shadowRoot!.querySelector(".label")).toBeNull();
    expect(el.shadowRoot!.querySelector("ul.list slot")).not.toBeNull();
    const [a, b] = el.items;
    expect(a.hasAttribute("title")).toBe(false);
    expect(tile(a).tagName).toBe("LI");
    expect(tile(a).querySelector("label.body .option .text .title")!.textContent).toBe("Pro Trial");
    expect(tile(a).querySelector(".description")!.textContent).toBe("Free for two weeks");
    expect(control(a).localName).toBe("acme-radio");
    expect(control(a).getAttribute("aria-label")).toBe("Pro Trial Free for two weeks");
    expect(a.checked).toBe(true);
    expect(b.checked).toBe(false);
    expect(tile(a).hasAttribute("data-checked")).toBe(true);
    expect(tile(b).hasAttribute("data-checked")).toBe(false);
    // The control sits after the text; one tile is the Tab stop.
    expect(tile(a).querySelector(".option")!.lastElementChild!.localName).toBe("acme-radio");
    expect(control(a).skipTab).toBe(false);
    expect(control(b).skipTab).toBe(true);
  });

  test("a change on a tile's control moves the value and fires acme-change once", async () => {
    const el = await mount(`<acme-choicebox label="select a plan" type="radio" value="trial">${items}</acme-choicebox>`);
    const [a, b] = el.items;
    const seen: unknown[] = [];
    el.addEventListener("acme-change", (e) => seen.push((e as CustomEvent).detail.value));
    control(b).dispatchEvent(new CustomEvent("acme-change", { detail: { value: "pro" }, bubbles: true, composed: true }));
    await el.updateComplete;
    await a.updateComplete;
    expect(el.value).toBe("pro");
    expect(a.checked).toBe(false);
    expect(b.checked).toBe(true);
    expect(seen).toEqual(["pro"]);
  });

  test("a checkbox group collects values; the label shows with show-label; disabled reaches every tile", async () => {
    const el = await mount(`<acme-choicebox type="checkbox" show-label label="Single input disabled">${items}</acme-choicebox>`);
    const group = el.shadowRoot!.querySelector(".group") as HTMLElement;
    expect(group.getAttribute("role")).toBe("group");
    expect(group.getAttribute("aria-multiselectable")).toBe("true");
    const label = el.shadowRoot!.querySelector("label.label.plain") as HTMLElement;
    expect(label.querySelector(".text")!.textContent).toBe("Single input disabled");
    expect(group.getAttribute("aria-labelledby")).toBe(label.id);
    const [a, b] = el.items;
    expect(control(a).localName).toBe("acme-checkbox");
    for (const it of [a, b]) {
      control(it).dispatchEvent(new CustomEvent("acme-change", { detail: { checked: true }, bubbles: true, composed: true }));
      await el.updateComplete;
    }
    expect(el.value).toEqual(["trial", "pro"]);
    control(a).dispatchEvent(new CustomEvent("acme-change", { detail: { checked: false }, bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.value).toEqual(["pro"]);
    el.disabled = true;
    await el.updateComplete;
    await a.updateComplete;
    expect(a.off).toBe(true);
    expect(control(a).disabled).toBe(true);
    expect(tile(a).hasAttribute("data-disabled")).toBe(true);
  });

  test("arrow keys move the choice of a radio group and skip disabled tiles", async () => {
    const el = await mount(`<acme-choicebox type="radio" value="trial">${items}<acme-choicebox-item disabled title="Enterprise" value="ent"></acme-choicebox-item></acme-choicebox>`);
    const [a, b, c] = el.items;
    expect(c.off).toBe(true);
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await el.updateComplete;
    await b.updateComplete;
    expect(el.value).toBe("pro");
    expect(b.checked).toBe(true);
    // The Tab stop follows the choice.
    expect(control(b).skipTab).toBe(false);
    expect(control(a).skipTab).toBe(true);
    // The disabled tile is skipped: the next move wraps to the first.
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    await el.updateComplete;
    expect(el.value).toBe("trial");
    expect(a.checked).toBe(true);
  });

  test("slotted content opens under the row once the tile is selected; interactive content sits beside the label", async () => {
    const el = await mount(
      `<acme-choicebox type="radio" value="trial"><acme-choicebox-item title="Pro Trial" value="trial"><div>Trial</div></acme-choicebox-item><acme-choicebox-item interactive-content title="Pro" value="pro"><div>Pro</div></acme-choicebox-item></acme-choicebox>`,
    );
    const [a, b] = el.items;
    expect(tile(a).classList.contains("open")).toBe(true);
    const content = tile(a).querySelector("label.body > .content") as HTMLElement;
    expect(content.hidden).toBe(false);
    expect(content.querySelector("slot")).not.toBeNull();
    expect(tile(b).classList.contains("open")).toBe(false);
    expect(tile(b).classList.contains("interactive")).toBe(true);
    const panel = tile(b).querySelector(":scope > .panel") as HTMLElement;
    expect(panel.hidden).toBe(true);
    expect(tile(b).querySelector("label.body .content")).toBeNull();
    el.value = "pro";
    await el.updateComplete;
    await b.updateComplete;
    expect(panel.hidden).toBe(false);
    expect(tile(b).classList.contains("open")).toBe(true);
  });

  test("control-position start puts the control first; a disabled reason wraps the label in a tooltip", async () => {
    const el = await mount(
      `<acme-choicebox type="radio" control-position="start" disabled><acme-choicebox-item description="Get started now" disabled-reason="Available on Pro" title="Pro" value="pro"></acme-choicebox-item></acme-choicebox>`,
    );
    const [a] = el.items;
    expect(tile(a).classList.contains("start")).toBe(true);
    expect(tile(a).querySelector(".option")!.firstElementChild!.localName).toBe("acme-radio");
    const tip = tile(a).querySelector("acme-tooltip") as HTMLElement;
    expect(tip.getAttribute("text")).toBe("Available on Pro");
    expect(tip.querySelector("label.body")).not.toBeNull();
  });

  test("interaction states land as data attributes on the tile; the radio control keeps its own hover", async () => {
    const el = await mount(`<acme-choicebox type="radio" value="trial">${items}</acme-choicebox>`);
    const [a] = el.items;
    const t = tile(a);
    t.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    expect(t.getAttribute("data-hover")).toBe("true");
    t.dispatchEvent(new PointerEvent("pointerdown", { pointerType: "mouse", button: 0 }));
    expect(t.getAttribute("data-active")).toBe("true");
    t.dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse" }));
    expect(t.hasAttribute("data-hover")).toBe(false);
    expect(t.hasAttribute("data-active")).toBe(false);
    const r = control(a);
    r.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    expect(r.getAttribute("data-hover")).toBe("true");
    r.dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse" }));
    expect(r.hasAttribute("data-hover")).toBe(false);
  });
});
