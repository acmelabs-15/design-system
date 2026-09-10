import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeTooltip } from "../tooltip";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeTooltip;
  await el.updateComplete;
  return el;
};
const sr = (el: AcmeTooltip) => el.shadowRoot!;
const bubble = (el: AcmeTooltip) => sr(el).querySelector(".tip") as HTMLElement | null;
const trigger = (el: AcmeTooltip) => sr(el).querySelector(".trigger") as HTMLElement;
const TEXT = "The Evil Rabbit Jumped over the Fence";

describe("acme-tooltip", () => {
  test("renders a focusable trigger around the content and no bubble until shown", async () => {
    const el = await mount(`<acme-tooltip text="${TEXT}"><span>Top</span></acme-tooltip>`);
    const t = trigger(el);
    expect(t.getAttribute("tabindex")).toBe("0");
    expect(t.hasAttribute("aria-describedby")).toBe(false);
    expect(t.querySelector("slot:not([name])")).not.toBeNull();
    expect(bubble(el)).toBeNull();
    expect(sr(el).querySelector(".layer")).toBeNull();
  });

  test("shown opens the bubble in a manual popover layer, described from the trigger, with the arrow first", async () => {
    const el = await mount(`<acme-tooltip shown="1" text="${TEXT}."><span>Top</span></acme-tooltip>`);
    const layer = sr(el).querySelector(".layer") as HTMLElement;
    expect(layer.getAttribute("popover")).toBe("manual");
    const b = bubble(el)!;
    expect(b.getAttribute("role")).toBe("tooltip");
    // An `auto` alignment at the viewport's left edge (a zero rect here) moves the bubble to the trigger's start.
    expect(b.className.trim()).toBe("tip start");
    const centred = await mount(`<acme-tooltip shown="1" box-align="center" text="x"><span>x</span></acme-tooltip>`);
    expect(centred.shadowRoot!.querySelector(".tip")!.className.trim()).toBe("tip");
    expect(trigger(el).getAttribute("aria-describedby")).toBe(b.id);
    expect(b.firstElementChild?.className).toBe("arrow");
    expect(b.querySelector(".arrow svg")?.getAttribute("width")).toBe("14");
    expect(b.querySelector(".arrow svg")?.getAttribute("height")).toBe("6");
    // A trailing period is dropped from the text.
    expect(b.textContent).toContain(TEXT);
    expect(b.textContent).not.toContain(`${TEXT}.`);
    expect(b.getAttribute("style")).toContain("max-width:250px");
    expect(sr(el).querySelector(".backdrop")).toBeNull();
  });

  test("position, box-align, delay, lower-delay, type, fill, center, wrap and invert-theme map to modifiers", async () => {
    const el = await mount(
      `<acme-tooltip shown="1" position="bottom" box-align="right" delay="false" lower-delay variant="success" fill="false" center="false" wrap="false" invert-theme="false" text="x"><span>x</span></acme-tooltip>`,
    );
    const c = bubble(el)!.className.split(/\s+/);
    for (const m of ["tip", "bottom", "end", "nodelay", "faster", "success", "nofill", "nocenter", "nowrap", "noinvert"]) expect(c).toContain(m);
    expect(bubble(el)!.querySelector(".arrow svg")?.getAttribute("width")).toBe("14");
    const left = await mount(`<acme-tooltip shown="1" position="left" box-align="right" text="x"><span>x</span></acme-tooltip>`);
    // Alignment is a top or bottom thing; a side bubble is centred, with the tall glyph.
    expect(left.shadowRoot!.querySelector(".tip")!.className.trim()).toBe("tip left");
    expect(left.shadowRoot!.querySelector(".arrow svg")?.getAttribute("width")).toBe("6");
  });

  test("tip=false drops the arrow; a touch open adds the backdrop and the faster fade; force-hide keeps it closed", async () => {
    const noTip = await mount(`<acme-tooltip shown="1" tip="false" text="x"><span>x</span></acme-tooltip>`);
    expect(bubble(noTip)!.querySelector(".arrow")).toBeNull();
    const touch = await mount(`<acme-tooltip shown="4" text="x"><span>x</span></acme-tooltip>`);
    expect(touch.shadowRoot!.querySelector(".layer > .backdrop")).not.toBeNull();
    expect(bubble(touch)!.className).toContain("faster");
    const hidden = await mount(`<acme-tooltip shown="1" force-hide text="x"><span>x</span></acme-tooltip>`);
    expect(bubble(hidden)).toBeNull();
  });

  test("a key in the content marks the bubble as a row and the key as the bubble's", async () => {
    const el = await mount(`<acme-tooltip shown="1" text="Search"><acme-kbd slot="content">/</acme-kbd><span>Shortcut</span></acme-tooltip>`);
    await el.updateComplete;
    const b = bubble(el)!;
    expect(b.hasAttribute("data-kbd")).toBe(true);
    expect(b.querySelector("slot[name=content]")).not.toBeNull();
    expect(el.querySelector("acme-kbd")!.hasAttribute("data-in-tooltip")).toBe(true);
    const plain = await mount(`<acme-tooltip shown="1"><span slot="content">The <b>Evil Rabbit</b></span><span>Top</span></acme-tooltip>`);
    expect(bubble(plain)!.hasAttribute("data-kbd")).toBe(false);
  });

  test("without text or content, and with the triggers off while closed, the content stands alone", async () => {
    const bare = await mount(`<acme-tooltip><span>Nothing</span></acme-tooltip>`);
    expect(trigger(bare)).toBeNull();
    expect(sr(bare).querySelector("slot")).not.toBeNull();
    const off = await mount(`<acme-tooltip disable-triggers text="x"><span>Nothing</span></acme-tooltip>`);
    expect(trigger(off)).toBeNull();
    const on = await mount(`<acme-tooltip disable-triggers shown="1" text="x"><span>Nothing</span></acme-tooltip>`);
    expect(trigger(on)).not.toBeNull();
    expect(bubble(on)).not.toBeNull();
  });

  test("a mouse enter opens after delay-time, a leave closes 100ms later; Enter opens, Escape closes; focus opens only with sticky", async () => {
    const el = await mount(`<acme-tooltip text="x"><span>x</span></acme-tooltip>`);
    const t = trigger(el);
    t.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    await new Promise((r) => setTimeout(r, 5));
    await el.updateComplete;
    expect(bubble(el)).not.toBeNull();
    t.dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse" }));
    await el.updateComplete;
    expect(bubble(el)).not.toBeNull();
    await new Promise((r) => setTimeout(r, 120));
    await el.updateComplete;
    expect(bubble(el)).toBeNull();
    t.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await new Promise((r) => setTimeout(r, 5));
    await el.updateComplete;
    expect(bubble(el)).not.toBeNull();
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await el.updateComplete;
    expect(bubble(el)).toBeNull();
    t.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 5));
    await el.updateComplete;
    expect(bubble(el)).toBeNull();
    const sticky = await mount(`<acme-tooltip sticky text="x"><span>x</span></acme-tooltip>`);
    trigger(sticky).dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 5));
    await sticky.updateComplete;
    expect(bubble(sticky)).not.toBeNull();
    trigger(sticky).dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
    await sticky.updateComplete;
    expect(bubble(sticky)).toBeNull();
  });

  test("a touch never opens with desktop-only, and a scroll closes an open bubble", async () => {
    const el = await mount(`<acme-tooltip desktop-only text="x"><span>x</span></acme-tooltip>`);
    trigger(el).dispatchEvent(new PointerEvent("pointerenter", { pointerType: "touch", clientX: 10, clientY: 10 }));
    window.dispatchEvent(new Event("touchend"));
    await el.updateComplete;
    expect(bubble(el)).toBeNull();
    const open = await mount(`<acme-tooltip shown="1" text="x"><span>x</span></acme-tooltip>`);
    window.dispatchEvent(new Event("scroll"));
    await open.updateComplete;
    expect(bubble(open)).toBeNull();
  });
  test("the bubble holds no whitespace text nodes: pre-line would turn them into blank lines", async () => {
    // The bubble renders `white-space: pre-line`, as the reference's does, so a newline left in the
    // template is a real line break on screen. That shipped once: indentation around the arrow and the
    // slot made the bubble 130px tall where the reference's is 29px. The guard is structural, because a
    // height assertion needs layout and happy-dom has none.
    const el = await mount(`<acme-tooltip shown="1" text="${TEXT}"><span>Trigger</span></acme-tooltip>`);
    const bubble = el.shadowRoot!.querySelector('[role="tooltip"]')!;
    const blank = [...bubble.childNodes].filter((n) => n.nodeType === 3 && (n.textContent ?? "") !== "" && (n.textContent ?? "").trim() === "");
    expect(blank.map((n) => JSON.stringify(n.textContent))).toEqual([]);
  });
});
