import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeContextCard } from "../context-card";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeContextCard;
  await el.updateComplete;
  return el;
};
const sr = (el: AcmeContextCard) => el.shadowRoot!;
const trigger = (el: AcmeContextCard) => sr(el).querySelector(".trigger") as HTMLElement;
const layer = (el: AcmeContextCard) => sr(el).querySelector(".layer") as HTMLElement | null;
const fade = (el: AcmeContextCard) => sr(el).querySelector(".fade") as HTMLElement | null;
const tick = (ms = 5) => new Promise((r) => setTimeout(r, ms));
/** The class list as a set: an update appends a newly true class, so the order carries no meaning. */
const classes = (el: Element | null) => [...(el?.classList ?? [])].sort().join(" ");
const TEXT = "The Evil Rabbit Jumped over the Fence";

describe("acme-context-card", () => {
  test("renders a trigger around the content, with no tab stop of its own, and no layer until shown", async () => {
    const el = await mount(`<acme-context-card content="${TEXT}"><span>Right</span></acme-context-card>`);
    const t = trigger(el);
    expect(t.tagName).toBe("DIV");
    expect(t.hasAttribute("tabindex")).toBe(false);
    expect(t.querySelector("slot:not([name])")).not.toBeNull();
    expect(layer(el)).toBeNull();
  });

  test("shown opens the card in a manual popover layer: fader, shell, stem, content box and body, skipping the move", async () => {
    const el = await mount(`<acme-context-card shown="1" content="${TEXT}"><span>Right</span></acme-context-card>`);
    const l = layer(el)!;
    expect(l.getAttribute("popover")).toBe("manual");
    // The right side is the default: no side class; opened from rest, the move transition is skipped.
    expect(classes(l)).toBe("layer skip");
    expect(fade(el)!.style.opacity).toBe("1");
    const card = l.querySelector(".fade > .card") as HTMLElement;
    expect(card).not.toBeNull();
    expect(card.style.transform).toMatch(/^translate\(/);
    const arrow = card.querySelector(":scope > .arrow svg") as SVGElement;
    expect(arrow.getAttribute("width")).toBe("14");
    expect(arrow.getAttribute("height")).toBe("7");
    const box = card.querySelector(":scope > div > .box") as HTMLElement;
    expect(box.style.pointerEvents).toBe("all");
    expect(box.style.width).toBe("max-content");
    expect(box.style.position).toBe("absolute");
    const body = box.querySelector(":scope > .body") as HTMLElement;
    expect(body.style.opacity).toBe("1");
    expect(body.textContent).toContain(TEXT);
    expect(body.querySelector("slot[name=content]")).not.toBeNull();
  });

  test("side maps to a class on the layer, 8 in shown keeps the move transition, no-padding and ignore-card-pointer-events land on the box, hide keeps it closed", async () => {
    const top = await mount(`<acme-context-card shown="1" side="top" content="x"><span>x</span></acme-context-card>`);
    expect(classes(layer(top))).toBe("layer skip top");
    const moved = await mount(`<acme-context-card shown="9" side="bottom" content="x"><span>x</span></acme-context-card>`);
    expect(classes(layer(moved))).toBe("bottom layer");
    const bare = await mount(`<acme-context-card shown="1" side="left" no-padding ignore-card-pointer-events content="x"><span>x</span></acme-context-card>`);
    expect(classes(layer(bare))).toBe("layer left skip");
    const box = sr(bare).querySelector(".box") as HTMLElement;
    expect(box.style.padding).toBe("0px");
    expect(box.style.pointerEvents).toBe("none");
    const hidden = await mount(`<acme-context-card shown="1" hide content="x"><span>x</span></acme-context-card>`);
    expect(layer(hidden)).toBeNull();
  });

  test("a mouse enter mounts the content at once and raises the card after the entry delay; a leave lowers it after the inactive timeout", async () => {
    const el = await mount(`<acme-context-card inactive-timeout-ms="10" content="x"><span>x</span></acme-context-card>`);
    const t = trigger(el);
    t.dispatchEvent(new MouseEvent("mouseenter"));
    await el.updateComplete;
    expect(layer(el)).not.toBeNull();
    expect(fade(el)!.style.opacity).toBe("0");
    await tick(170);
    await el.updateComplete;
    expect(fade(el)!.style.opacity).toBe("1");
    expect(classes(layer(el))).toBe("layer skip");
    t.dispatchEvent(new MouseEvent("mouseleave"));
    await el.updateComplete;
    expect(fade(el)!.style.opacity).toBe("1");
    await tick(30);
    await el.updateComplete;
    expect(fade(el)!.style.opacity).toBe("0");
    // The content stays mounted for its fade.
    expect(layer(el)).not.toBeNull();
  });

  test("a neighbouring card entered while one is up opens at once and slides there; the first drops its layer", async () => {
    document.body.innerHTML = `<div><acme-context-card inactive-timeout-ms="200" content="a"><span>a</span></acme-context-card><acme-context-card inactive-timeout-ms="200" content="b"><span>b</span></acme-context-card></div>`;
    const [a, b] = [...document.querySelectorAll("acme-context-card")] as AcmeContextCard[];
    await a.updateComplete;
    await b.updateComplete;
    trigger(a).dispatchEvent(new MouseEvent("mouseenter"));
    await tick(170);
    await a.updateComplete;
    expect(fade(a)!.style.opacity).toBe("1");
    trigger(a).dispatchEvent(new MouseEvent("mouseleave"));
    trigger(b).dispatchEvent(new MouseEvent("mouseenter"));
    await tick(5);
    await b.updateComplete;
    await a.updateComplete;
    expect(fade(b)!.style.opacity).toBe("1");
    // Every box measures as zero here, so the move is within reach: the transition is kept.
    expect(classes(layer(b))).toBe("layer");
    expect(layer(a)).toBeNull();
  });

  test("focus on slotted content opens the card, Escape closes it and returns focus, a click on a link closes it", async () => {
    const el = await mount(`<acme-context-card inactive-timeout-ms="10" content="x"><a href="#">Link</a></acme-context-card>`);
    const link = el.querySelector("a")!;
    // Focus lands on the slotted link, as it does in a browser: the event bubbles to the host.
    link.dispatchEvent(new FocusEvent("focusin", { bubbles: true, composed: true }));
    await tick(5);
    await el.updateComplete;
    expect(fade(el)!.style.opacity).toBe("1");
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;
    expect(layer(el)).toBeNull();
    expect(document.activeElement).toBe(link);
    trigger(el).dispatchEvent(new MouseEvent("mouseenter"));
    await tick(170);
    await el.updateComplete;
    expect(fade(el)!.style.opacity).toBe("1");
    link.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    await tick(30);
    await el.updateComplete;
    expect(fade(el)!.style.opacity).toBe("0");
  });

  test("Escape keeps the card shut while focus stays on the content, and focus opens it again once focus has left and returned", async () => {
    const el = await mount(`<acme-context-card inactive-timeout-ms="10" content="x"><a href="#">Link</a></acme-context-card>`);
    const link = el.querySelector("a")!;
    link.dispatchEvent(new FocusEvent("focusin", { bubbles: true, composed: true }));
    await tick(5);
    await el.updateComplete;
    expect(layer(el)).not.toBeNull();
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;
    expect(layer(el)).toBeNull();
    // The focus Escape restores does not reopen it.
    link.dispatchEvent(new FocusEvent("focusin", { bubbles: true, composed: true }));
    await tick(5);
    await el.updateComplete;
    expect(layer(el)).toBeNull();
    // Focus leaves for good, then comes back: the card opens again.
    link.dispatchEvent(new FocusEvent("focusout", { bubbles: true, composed: true, relatedTarget: document.body }));
    await tick(30);
    await el.updateComplete;
    link.dispatchEvent(new FocusEvent("focusin", { bubbles: true, composed: true }));
    await tick(5);
    await el.updateComplete;
    expect(layer(el)).not.toBeNull();
  });

  test("disable-triggers ignores hover and focus; shown still opens", async () => {
    const el = await mount(`<acme-context-card disable-triggers content="x"><span>x</span></acme-context-card>`);
    trigger(el).dispatchEvent(new MouseEvent("mouseenter"));
    trigger(el).dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    await tick(170);
    await el.updateComplete;
    expect(layer(el)).toBeNull();
    el.shown = 1;
    await el.updateComplete;
    expect(layer(el)).not.toBeNull();
  });
});
