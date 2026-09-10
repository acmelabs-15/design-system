import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeNote } from "../note";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeNote;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeNote) => el.shadowRoot!.querySelector(".note") as HTMLElement;

describe("acme-note", () => {
  test("renders role=note with the body, icon, text and content parts", async () => {
    const el = await mount(`<acme-note>A default note.</acme-note>`);
    const n = root(el);
    expect(n.getAttribute("role")).toBe("note");
    expect(n.className.trim()).toBe("note");
    expect(n.querySelector(".body > .icon > slot[name=icon] > svg")).not.toBeNull();
    expect(n.querySelector(".body > .text > .content > slot:not([name])")).not.toBeNull();
    expect(n.querySelector(".action")).toBeNull();
    expect(n.querySelector(".label")).toBeNull();
    expect(n.hasAttribute("data-disabled")).toBe(false);
  });

  test("variant, fill, size and disabled map to modifier classes; disabled marks the root", async () => {
    const el = await mount(`<acme-note variant="warning" fill size="small" disabled>Careful.</acme-note>`);
    const n = root(el);
    for (const k of ["warning", "fill", "sm", "disabled"]) expect(n.classList.contains(k)).toBe(true);
    expect(n.getAttribute("data-disabled")).toBe("true");
  });

  test("a slotted icon replaces the variant's icon; no-icon draws no icon span", async () => {
    const a = await mount(`<acme-note variant="success"><svg slot="icon"></svg>Passed.</acme-note>`);
    const slot = root(a).querySelector("slot[name=icon]") as HTMLSlotElement;
    expect(slot.assignedElements().length).toBe(1);
    const b = await mount(`<acme-note no-icon>Plain.</acme-note>`);
    expect(root(b).querySelector(".icon")).toBeNull();
  });

  test("a slotted label renders the label span inside the content", async () => {
    const el = await mount(`<acme-note><span slot="label">Region Change:</span>Changing this region restarts all functions.</acme-note>`);
    expect(root(el).querySelector(".content > .label > slot[name=label]")).not.toBeNull();
  });

  test("a slotted action renders the action wrapper and rounds the root; a disabled note disables the button", async () => {
    const el = await mount(`<acme-note disabled fill variant="warning">Upgrade.<acme-button slot="action" size="small">Upgrade</acme-button></acme-note>`);
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const n = root(el);
    expect(n.classList.contains("with-action")).toBe(true);
    expect(n.querySelector(".action > slot[name=action]")).not.toBeNull();
    const b = el.querySelector("acme-button") as HTMLElement & { disabled: boolean; updateComplete: Promise<boolean> };
    await b.updateComplete;
    expect(b.disabled).toBe(true);
  });
});
