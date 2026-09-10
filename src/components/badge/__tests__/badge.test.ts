import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeBadge } from "../badge";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeBadge;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeBadge) => el.shadowRoot!.querySelector(".badge") as HTMLElement;

describe("acme-badge", () => {
  test("defaults render the bare root with the icon slot and the label span", async () => {
    const el = await mount(`<acme-badge>gray</acme-badge>`);
    const b = root(el);
    expect(b.className.trim()).toBe("badge");
    expect(b.querySelector('slot[name="icon"]')).not.toBeNull();
    expect(b.querySelector(".label > slot:not([name])")).not.toBeNull();
  });

  test("variant, contrast and size map to modifier classes", async () => {
    const el = await mount(`<acme-badge variant="blue" contrast="low" size="sm">blue</acme-badge>`);
    expect(root(el).className.trim()).toBe("badge blue subtle sm");
    el.size = "lg";
    el.contrast = "high";
    await el.updateComplete;
    expect(root(el).className.trim()).toBe("badge blue lg");
  });

  test("inverted, trial and turbo are variants", async () => {
    for (const v of ["inverted", "trial", "turbo"]) {
      const el = await mount(`<acme-badge variant="${v}">x</acme-badge>`);
      expect(root(el).className.trim()).toBe(`badge ${v}`);
    }
  });

  test("a slotted icon lands in the icon slot; a circular glyph is mirrored onto the slot", async () => {
    const el = await mount(`<acme-badge><svg slot="icon"></svg>gray</acme-badge>`);
    const slot = root(el).querySelector('slot[name="icon"]') as HTMLSlotElement;
    expect(slot.assignedElements().length).toBe(1);
    slot.dispatchEvent(new Event("slotchange"));
    expect(slot.hasAttribute("data-glyph")).toBe(false);
    el.querySelector("svg")!.setAttribute("data-glyph", "circular");
    slot.dispatchEvent(new Event("slotchange"));
    expect(slot.getAttribute("data-glyph")).toBe("circular");
  });
});

describe("acme-pill", () => {
  test("renders a link in the three sizes", async () => {
    document.body.innerHTML = `<acme-pill href="#x" size="lg">Label</acme-pill>`;
    const el = document.body.firstElementChild as HTMLElement & { updateComplete: Promise<boolean> };
    await el.updateComplete;
    const a = el.shadowRoot!.querySelector("a.pill") as HTMLAnchorElement;
    expect(a.getAttribute("href")).toBe("#x");
    expect(a.className).toContain("lg");
  });
});
