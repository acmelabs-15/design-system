import { describe, expect, test } from "bun:test";
import "../../../index";
import { deepActive } from "../../modal/modal";
import type { AcmeSheet } from "../sheet";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.querySelector("acme-sheet") as AcmeSheet;
  await el.updateComplete;
  return el;
};
const settle = () => new Promise((r) => setTimeout(r, 0));
const shadow = (el: AcmeSheet) => el.shadowRoot!;
const dialog = (el: AcmeSheet) => shadow(el).querySelector("dialog") as HTMLDialogElement;
/** Every pending update, the ones an update requests included. */
const flush = async (el: AcmeSheet) => {
  do await el.updateComplete;
  while (el.isUpdatePending);
};
const open = async (el: AcmeSheet) => {
  el.show();
  await flush(el);
};
// The focused element's host when focus sits inside a shadow root (an acme-button's inner button), else the element itself.
const focused = () => {
  const a = deepActive();
  if (!a) return null;
  const root = a.getRootNode();
  return root instanceof ShadowRoot ? root.host : a;
};

describe("acme-sheet", () => {
  test("renders a closed dialog with the header, body and footer; right is the default side", async () => {
    const el = await mount(
      `<acme-sheet heading="Sheet Title"><acme-button slot="trigger">Open Sheet</acme-button><p slot="header">Sub</p>Body<acme-button slot="footer">Close</acme-button></acme-sheet>`,
    );
    await settle();
    await flush(el);
    const d = dialog(el);
    expect(d.open).toBe(false);
    expect(d.getAttribute("data-state")).toBe("closed");
    expect(d.className.trim()).toBe("sheet bare");
    expect(d.getAttribute("aria-labelledby")).toBe("title");
    expect(d.getAttribute("aria-describedby")).toBe("body");
    expect(d.getAttribute("tabindex")).toBe("-1");
    expect(shadow(el).querySelector(".header > .title#title")?.textContent).toContain("Sheet Title");
    expect(shadow(el).querySelector(".header > slot[name=header]")).not.toBeNull();
    expect(shadow(el).querySelector(".body#body > slot:not([name])")).not.toBeNull();
    expect(shadow(el).querySelector(".footer > slot[name=footer]")).not.toBeNull();
    expect(el.side).toBe("right");
    const trigger = el.querySelector('[slot="trigger"]')!;
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  test("side, inset and modal map to the dialog's classes; no body and no footer leave their boxes out", async () => {
    for (const side of ["top", "bottom", "left"]) {
      const el = await mount(`<acme-sheet side="${side}" modal inset heading="x"></acme-sheet>`);
      expect(dialog(el).className.trim()).toBe(`sheet ${side} inset`);
      expect(shadow(el).querySelector(".body")).toBeNull();
      expect(shadow(el).querySelector(".footer")).toBeNull();
      expect(dialog(el).hasAttribute("aria-describedby")).toBe(false);
    }
    const bare = await mount(`<acme-sheet modal no-overlay heading="x"></acme-sheet>`);
    expect(dialog(bare).className.trim()).toBe("sheet bare");
  });

  test("the trigger opens it in the top layer, a modal sheet locks the page scroll, and the trigger says so", async () => {
    const el = await mount(`<acme-sheet modal heading="x"><button slot="trigger">Open Sheet</button>Body</acme-sheet>`);
    (el.querySelector("button") as HTMLButtonElement).click();
    await flush(el);
    expect(el.open).toBe(true);
    expect(dialog(el).open).toBe(true);
    expect(dialog(el).getAttribute("data-state")).toBe("open");
    expect(el.querySelector("button")?.getAttribute("aria-expanded")).toBe("true");
    expect(document.body.hasAttribute("data-scroll-lock")).toBe(true);
    el.close();
    await flush(el);
    await settle();
    expect(dialog(el).open).toBe(false);
    expect(document.body.hasAttribute("data-scroll-lock")).toBe(false);
    expect(el.querySelector("button")?.getAttribute("aria-expanded")).toBe("false");
  });

  test("focus lands on the first tabbable element, else the panel, and returns to the opener on close", async () => {
    const el = await mount(`<button id="opener">Open</button><acme-sheet heading="Focus"><input id="name"><acme-button slot="footer" id="close">Close</acme-button></acme-sheet>`);
    for (const b of document.querySelectorAll("acme-button")) await (b as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete;
    const opener = document.getElementById("opener")!;
    opener.focus();
    await open(el);
    expect(focused()).toBe(document.getElementById("name"));
    el.close();
    await flush(el);
    await settle();
    expect(document.activeElement).toBe(opener);
    const bare = await mount(`<acme-sheet heading="Focus">Body</acme-sheet>`);
    await open(bare);
    expect(deepActive()).toBe(dialog(bare));
  });

  test("Escape asks to close through a cancelable acme-dismiss", async () => {
    const el = await mount(`<acme-sheet open heading="x"></acme-sheet>`);
    await flush(el);
    const reasons: string[] = [];
    el.addEventListener("acme-dismiss", (e) => reasons.push((e as CustomEvent).detail.reason));
    el.addEventListener("acme-dismiss", (e) => e.preventDefault(), { once: true });
    dialog(el).dispatchEvent(new Event("cancel", { cancelable: true }));
    await flush(el);
    expect(el.open).toBe(true);
    dialog(el).dispatchEvent(new Event("cancel", { cancelable: true }));
    await flush(el);
    expect(el.open).toBe(false);
    expect(reasons).toEqual(["escape", "escape"]);
  });

  test("a press outside the panel closes it; one inside does not; a data-close element closes it", async () => {
    const el = await mount(`<acme-sheet heading="x"><p>Body</p><button slot="footer" data-close>Close</button></acme-sheet>`);
    const events: string[] = [];
    for (const t of ["acme-open", "acme-close"]) el.addEventListener(t, () => events.push(t));
    await open(el);
    // The dialog's box is empty in the test document: a press at its origin is inside it, one before it is outside.
    dialog(el).dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: 0, clientY: 0 }));
    await flush(el);
    expect(el.open).toBe(true);
    dialog(el).dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: -1, clientY: -1 }));
    await flush(el);
    expect(el.open).toBe(false);
    await settle();
    await open(el);
    (el.querySelector("[data-close]") as HTMLButtonElement).click();
    await flush(el);
    expect(el.open).toBe(false);
    await settle();
    expect(events).toEqual(["acme-open", "acme-close", "acme-open", "acme-close"]);
  });
});
