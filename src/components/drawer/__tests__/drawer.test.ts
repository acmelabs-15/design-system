import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeDrawer } from "../drawer";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.querySelector("acme-drawer") as AcmeDrawer;
  await el.updateComplete;
  return el;
};
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const shadow = (el: AcmeDrawer) => el.shadowRoot!;
const dialog = (el: AcmeDrawer) => shadow(el).querySelector("dialog") as HTMLDialogElement;
const panel = (el: AcmeDrawer) => shadow(el).querySelector(".drawer") as HTMLElement;
/** Every pending update, the ones an update requests included. */
const flush = async (el: AcmeDrawer) => {
  do await el.updateComplete;
  while (el.isUpdatePending);
};
const open = async (el: AcmeDrawer) => {
  el.show();
  await flush(el);
};
/** The entrance has ended: a request to close is taken up from here on. */
const entered = () => wait(520);
const pointer = (type: string, y: number, time: number, id = 7) => {
  const e = new PointerEvent(type, { clientY: y, pointerId: id, pointerType: "mouse", button: 0, bubbles: true, composed: true });
  Object.defineProperty(e, "timeStamp", { value: time });
  return e;
};
const swipe = (p: HTMLElement, steps: [number, number][]) => {
  p.dispatchEvent(pointer("pointerdown", steps[0][0], steps[0][1]));
  for (const [y, t] of steps.slice(1)) p.dispatchEvent(pointer("pointermove", y, t));
};

describe("acme-drawer", () => {
  test("renders an empty closed dialog, then the popup in the top layer when open, scroll locked", async () => {
    const el = await mount(`<acme-drawer heading="Filter Logs"><p>Body</p></acme-drawer>`);
    expect(dialog(el).open).toBe(false);
    expect(panel(el)).toBeNull();
    await open(el);
    expect(dialog(el).open).toBe(true);
    expect(dialog(el).className.trim()).toBe("dialog");
    const p = panel(el);
    expect(p.className.trim()).toBe("drawer");
    expect(p.getAttribute("role")).toBe("dialog");
    expect(p.getAttribute("aria-modal")).toBe("true");
    expect(p.getAttribute("aria-labelledby")).toBe("title");
    expect(p.getAttribute("tabindex")).toBe("-1");
    expect(p.querySelector("h2.title#title")?.textContent).toBe("Filter Logs");
    expect(p.querySelector("h2 + slot:not([name])")).not.toBeNull();
    expect(p.hasAttribute("data-starting-style")).toBe(false);
    expect(document.body.hasAttribute("data-scroll-lock")).toBe(true);
    el.close();
    await wait(520);
  });

  test("height, vertical-scroll and nested map to the popup and the dialog", async () => {
    const el = await mount(`<acme-drawer open height="200" vertical-scroll="false" nested><p>Body</p></acme-drawer>`);
    await flush(el);
    expect(panel(el).className.trim()).toBe("drawer noscroll");
    expect(panel(el).style.height).toBe("200px");
    expect(dialog(el).className.trim()).toBe("dialog nested");
    expect(panel(el).hasAttribute("aria-labelledby")).toBe(false);
    // The `max` height's inline 100dvh is a unit this DOM rejects: the census reads it in the browser.
    el.height = "max";
    await flush(el);
    expect(panel(el).className).toContain("max");
    el.close();
    await wait(520);
  });

  test("focus lands on the first tabbable, else the popup, and returns to the opener after the exit", async () => {
    const el = await mount(`<button id="opener">Open</button><acme-drawer><input id="name"></acme-drawer>`);
    const opener = document.getElementById("opener")!;
    opener.focus();
    await open(el);
    expect(document.activeElement).toBe(document.getElementById("name"));
    await entered();
    el.close();
    await flush(el);
    expect(dialog(el).open).toBe(true); // the exit is still on screen
    expect(panel(el).hasAttribute("data-ending-style")).toBe(true);
    expect(dialog(el).hasAttribute("data-ending-style")).toBe(true);
    await wait(520);
    expect(dialog(el).open).toBe(false);
    expect(document.activeElement).toBe(opener);
    expect(document.body.hasAttribute("data-scroll-lock")).toBe(false);
    const bare = await mount(`<acme-drawer><p>Body</p></acme-drawer>`);
    await open(bare);
    expect(shadow(bare).activeElement).toBe(panel(bare));
    bare.close();
    await wait(520);
  });

  test("Escape and an outside press ask to close through a cancelable acme-dismiss, only once the entrance has ended", async () => {
    const el = await mount(`<acme-drawer><p>Body</p></acme-drawer>`);
    const reasons: string[] = [];
    el.addEventListener("acme-dismiss", (e) => reasons.push((e as CustomEvent).detail.reason));
    await open(el);
    dialog(el).dispatchEvent(new Event("cancel", { cancelable: true }));
    await flush(el);
    expect(el.open).toBe(true); // still entering
    expect(reasons).toEqual([]);
    await entered();
    dialog(el).dispatchEvent(new Event("cancel", { cancelable: true }));
    await flush(el);
    expect(el.open).toBe(false);
    expect(reasons).toEqual(["escape"]);
    await wait(520);
    await open(el);
    await entered();
    el.addEventListener("acme-dismiss", (e) => e.preventDefault(), { once: true });
    dialog(el).dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    await flush(el);
    expect(el.open).toBe(true);
    expect(reasons).toEqual(["escape", "outside"]);
    dialog(el).dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    await flush(el);
    expect(el.open).toBe(false);
    // A press on the popup itself is not an outside press.
    await wait(520);
    await open(el);
    await entered();
    panel(el).dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true, pointerType: "touch" }));
    await flush(el);
    expect(el.open).toBe(true);
    el.close();
    await wait(520);
  });

  test("a swipe down moves the popup with the pointer, damped upward, and springs back when released short and slow", async () => {
    const el = await mount(`<acme-drawer><p>Body</p></acme-drawer>`);
    await open(el);
    await entered();
    const p = panel(el);
    Object.defineProperty(p, "offsetHeight", { value: 400 });
    swipe(p, [
      [100, 0],
      [100.5, 20],
    ]);
    expect(p.hasAttribute("data-swiping")).toBe(false); // under the start distance
    swipe(p, [
      [100, 0],
      [180, 100],
    ]);
    await flush(el);
    expect(p.hasAttribute("data-swiping")).toBe(true);
    expect(p.getAttribute("data-swipe-direction")).toBe("down");
    expect(dialog(el).hasAttribute("data-swiping")).toBe(true);
    expect(p.style.getPropertyValue("--drawer-swipe-movement-y")).toBe("80px");
    expect(p.style.transition).toBe("none");
    p.dispatchEvent(pointer("pointermove", 64, 200));
    expect(p.style.getPropertyValue("--drawer-swipe-movement-y")).toBe("-6px");
    p.dispatchEvent(pointer("pointermove", 180, 300));
    // Released 80px down, well under half the height, and after a long pause: no speed.
    p.dispatchEvent(pointer("pointerup", 180, 500));
    await flush(el);
    expect(el.open).toBe(true);
    expect(p.hasAttribute("data-swiping")).toBe(false);
    expect(dialog(el).hasAttribute("data-swiping")).toBe(false);
    expect(p.style.getPropertyValue("--drawer-swipe-movement-y")).toBe("");
    expect(p.style.transition).toBe("");
    el.close();
    await wait(520);
  });

  test("a swipe past half the height, or a fast flick, closes the drawer with the swipe reason", async () => {
    const el = await mount(`<acme-drawer><p>Body</p></acme-drawer>`);
    const reasons: string[] = [];
    el.addEventListener("acme-dismiss", (e) => reasons.push((e as CustomEvent).detail.reason));
    await open(el);
    await entered();
    let p = panel(el);
    Object.defineProperty(p, "offsetHeight", { value: 400 });
    swipe(p, [
      [100, 0],
      [200, 100],
      [320, 300],
    ]);
    p.dispatchEvent(pointer("pointerup", 320, 500));
    await flush(el);
    expect(el.open).toBe(false);
    expect(reasons).toEqual(["swipe"]);
    // The exit runs from where the popup was: the swipe's offset stays on the ending frame.
    expect(p.style.getPropertyValue("--drawer-swipe-movement-y")).toBe("220px");
    await wait(520);
    await open(el);
    await entered();
    p = panel(el);
    Object.defineProperty(p, "offsetHeight", { value: 400 });
    // 60px in 50ms, the last sample 30ms before release: 2px per ms.
    swipe(p, [
      [100, 0],
      [130, 20],
      [190, 50],
    ]);
    p.dispatchEvent(pointer("pointerup", 190, 80));
    await flush(el);
    expect(el.open).toBe(false);
    expect(reasons).toEqual(["swipe", "swipe"]);
    await wait(520);
  });

  test("a press on a control, or inside scrolled content, starts no swipe", async () => {
    const el = await mount(`<acme-drawer><button id="b">Go</button><div id="s" style="overflow:auto;height:20px"><p>Long</p></div></acme-drawer>`);
    await open(el);
    await entered();
    const p = panel(el);
    const b = document.getElementById("b")!;
    b.dispatchEvent(pointer("pointerdown", 100, 0));
    b.dispatchEvent(pointer("pointermove", 200, 100));
    expect(p.hasAttribute("data-swiping")).toBe(false);
    const s = document.getElementById("s")!;
    Object.defineProperty(s, "scrollTop", { value: 12 });
    s.dispatchEvent(pointer("pointerdown", 100, 0));
    s.dispatchEvent(pointer("pointermove", 200, 100));
    expect(p.hasAttribute("data-swiping")).toBe(false);
    el.close();
    await wait(520);
  });

  test("acme-open, acme-scroll and acme-close bracket the visit; reset-scroll scrolls the popup to its top", async () => {
    const el = await mount(`<acme-drawer><p>Body</p></acme-drawer>`);
    const events: string[] = [];
    for (const t of ["acme-open", "acme-close", "acme-scroll"]) el.addEventListener(t, () => events.push(t));
    await open(el);
    const p = panel(el);
    p.dispatchEvent(new Event("scroll"));
    p.scrollTop = 40;
    el.resetScroll = "again";
    await flush(el);
    expect(p.scrollTop).toBe(0);
    await entered();
    el.close();
    await wait(520);
    expect(events).toEqual(["acme-open", "acme-scroll", "acme-close"]);
  });
});
