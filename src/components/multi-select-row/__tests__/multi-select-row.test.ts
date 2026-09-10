import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeMultiSelectRow } from "../multi-select-row";

const mount = async (html: string) => {
  document.body.innerHTML = html;
  const el = document.body.firstElementChild as AcmeMultiSelectRow;
  await el.updateComplete;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeMultiSelectRow) => el.shadowRoot!.querySelector(".row") as HTMLElement;
const button = (el: AcmeMultiSelectRow) => el.shadowRoot!.querySelector(".action") as HTMLButtonElement;
const checkbox = (el: AcmeMultiSelectRow) => el.shadowRoot!.querySelector("acme-checkbox") as HTMLElement & { checked: boolean };
const hint = (el: AcmeMultiSelectRow) => el.shadowRoot!.querySelector(".hint")?.textContent ?? "";

describe("acme-multi-select-row", () => {
  test("renders the box with a labelled checkbox before a button that names the row", async () => {
    const el = await mount(`<acme-multi-select-row name="Design System" value="design" checked selected-count="2" total-count="3"></acme-multi-select-row>`);
    expect(root(el).className.trim()).toBe("row");
    const c = checkbox(el);
    expect(c.getAttribute("aria-label")).toBe("Design System");
    expect(c.getAttribute("name")).toBe("Design System");
    expect(c.getAttribute("value")).toBe("design");
    expect(c.hasAttribute("checked")).toBe(true);
    const b = button(el);
    expect(b.getAttribute("type")).toBe("button");
    expect(b.getAttribute("tabindex")).toBe("-1");
    expect(b.getAttribute("aria-label")).toBe("Design System. Check All");
    expect(b.querySelector(".body .name slot")).not.toBeNull();
    expect(b.querySelector(".body .name")!.textContent).toContain("Design System");
    expect(hint(el)).toBe("Check All");
    expect(el.formValue).toBe("design");
  });

  test("the hint follows the selection: Only on an unchecked row of a mixed selection, Only for all, Check for none, Check or Uncheck in the checkbox column; none without the label", async () => {
    const el = await mount(`<acme-multi-select-row name="A" selected-count="1" total-count="3"></acme-multi-select-row>`);
    expect(hint(el)).toBe("Only");
    el.selectedCount = 3;
    el.checked = true;
    await el.updateComplete;
    expect(hint(el)).toBe("Only");
    el.selectedCount = 0;
    el.checked = false;
    await el.updateComplete;
    expect(hint(el)).toBe("Check");
    el.hovered = true;
    el.checkboxHovered = true;
    await el.updateComplete;
    expect(hint(el)).toBe("Check");
    expect(root(el).className).toContain("checkbox-hovered");
    el.checked = true;
    await el.updateComplete;
    expect(hint(el)).toBe("Uncheck");
    el.showActionLabel = false;
    await el.updateComplete;
    expect(hint(el)).toBe("");
    expect(button(el).getAttribute("aria-label")).toBe("A");
  });

  test("a press asks for the action its state names, cancelable; the checkbox asks for a toggle and follows the answer", async () => {
    const el = await mount(`<acme-multi-select-row name="A" selected-count="0" total-count="3"></acme-multi-select-row>`);
    const seen: string[] = [];
    el.addEventListener("acme-select", (e) => {
      seen.push((e as CustomEvent).detail.action);
      e.preventDefault();
    });
    button(el).click();
    expect(seen).toEqual(["toggle"]);
    expect(el.checked).toBe(false);
    el.selectedCount = 1;
    await el.updateComplete;
    button(el).click();
    expect(seen).toEqual(["toggle", "selectOnly"]);
    el.checked = true;
    await el.updateComplete;
    button(el).click();
    expect(seen).toEqual(["toggle", "selectOnly", "selectAll"]);
    const c = checkbox(el);
    c.checked = false;
    c.dispatchEvent(new CustomEvent("acme-change", { detail: { checked: false }, bubbles: true, composed: true }));
    await el.updateComplete;
    expect(seen.at(-1)).toBe("toggle");
    expect(c.checked).toBe(true);
    expect(el.checked).toBe(true);
  });

  test("the checkbox at the end, leading content and a disabled row take their classes; a disabled row fires nothing", async () => {
    const el = await mount(`<acme-multi-select-row name="A" checkbox-position="end" disabled><svg slot="leading"></svg></acme-multi-select-row>`);
    expect(root(el).className).toContain("end");
    expect(root(el).className).toContain("disabled");
    expect(el.shadowRoot!.querySelector(".body .leading slot[name=leading]")).not.toBeNull();
    expect(button(el).disabled).toBe(true);
    expect(checkbox(el).hasAttribute("disabled")).toBe(true);
    let fired = false;
    el.addEventListener("acme-select", () => {
      fired = true;
    });
    el.toggle();
    expect(fired).toBe(false);
  });
});
