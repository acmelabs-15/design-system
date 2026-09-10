import { describe, expect, test } from "bun:test";
import "../../../index";
import { type AcmeModal, deepActive } from "../modal";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.querySelector("acme-modal") as AcmeModal;
  await el.updateComplete;
  return el;
};
const settle = () => new Promise((r) => setTimeout(r, 0));
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const shadow = (el: AcmeModal) => el.shadowRoot!;
const dialog = (el: AcmeModal) => shadow(el).querySelector("dialog") as HTMLDialogElement;
const panel = (el: AcmeModal) => shadow(el).querySelector(".modal") as HTMLElement;
// The focused element's host when focus sits inside a shadow root (an acme-button's inner button), else the element itself.
const focused = () => {
  const a = deepActive();
  if (!a) return null;
  const root = a.getRootNode();
  return root instanceof ShadowRoot ? root.host : a;
};
/** Every pending update, the ones an update requests included. */
const flush = async (el: AcmeModal) => {
  do await el.updateComplete;
  while (el.isUpdatePending);
};
const open = async (el: AcmeModal) => {
  el.show();
  await flush(el);
};

describe("acme-modal", () => {
  test("renders an empty closed dialog, then the panel in the top layer when open", async () => {
    const el = await mount(`<acme-modal heading="Create Token"><p slot="subtitle">Sub</p><p>Body</p><acme-button slot="actions">Cancel</acme-button></acme-modal>`);
    expect(dialog(el).open).toBe(false);
    expect(panel(el)).toBeNull();
    await open(el);
    expect(dialog(el).open).toBe(true);
    expect(dialog(el).hasAttribute("data-open")).toBe(true);
    const p = panel(el);
    expect(p.getAttribute("role")).toBe("dialog");
    expect(p.getAttribute("aria-modal")).toBe("true");
    expect(p.getAttribute("aria-labelledby")).toBe("title");
    expect(p.getAttribute("aria-describedby")).toBe("subtitle");
    expect(p.style.width).toBe("540px");
    expect(p.style.opacity).toBe("1");
    expect(shadow(el).querySelector(".trap")?.getAttribute("tabindex")).toBe("-1");
    expect(shadow(el).querySelector(".header .title")?.textContent).toContain("Create Token");
    expect(shadow(el).querySelector(".header .subtitle slot[name=subtitle]")).not.toBeNull();
    expect(shadow(el).querySelector(".body .content > slot:not([name])")).not.toBeNull();
    expect(shadow(el).querySelector(".body > .probe-top + .probe-bottom")).not.toBeNull();
    expect(shadow(el).querySelector(".actions slot[name=actions]")).not.toBeNull();
    expect(document.body.hasAttribute("data-scroll-lock")).toBe(true);
  });

  test("sticky, allow-overflow, center, body-padding and width map to the panel", async () => {
    const el = await mount(`<acme-modal open sticky allow-overflow center body-padding="0" width="480" heading="X"></acme-modal>`);
    await el.updateComplete;
    const p = panel(el);
    expect(p.className.trim()).toBe("modal sticky overflow unpadded center");
    expect(p.style.width).toBe("480px");
    expect((shadow(el).querySelector(".body") as HTMLElement).style.getPropertyValue("--modal-padding")).toBe("0px");
  });

  test("a header with nothing slotted after it is marked last; no heading and no subtitle means no header", async () => {
    const el = await mount(`<acme-modal open heading="Initial Focus"></acme-modal>`);
    await el.updateComplete;
    expect(shadow(el).querySelector(".header")?.hasAttribute("data-last")).toBe(true);
    const bare = await mount(`<acme-modal open><p>Body only</p></acme-modal>`);
    await bare.updateComplete;
    expect(shadow(bare).querySelector(".header")).toBeNull();
    expect(panel(bare).hasAttribute("aria-labelledby")).toBe(false);
  });

  test("actions become small buttons; a block action defaults to secondary", async () => {
    const el = await mount(`<acme-modal open heading="X"><acme-button slot="actions" block>Cancel</acme-button><acme-button slot="actions" variant="primary">Go</acme-button></acme-modal>`);
    await settle();
    await el.updateComplete;
    const [cancel, go] = Array.from(document.querySelectorAll("acme-button")) as (HTMLElement & { size: string; variant: string })[];
    expect(cancel.size).toBe("small");
    expect(cancel.variant).toBe("secondary");
    expect(go.size).toBe("small");
    expect(go.variant).toBe("primary");
  });

  test("focus lands on the initial-focus target, else on the first tabbable that is not an action, else on the wrapper; and returns to the opener after the exit", async () => {
    const el = await mount(
      `<button id="opener">Open</button><acme-modal heading="Focus"><input id="name"><acme-button slot="actions" id="cancel">Cancel</acme-button><acme-button slot="actions" id="submit">Submit</acme-button></acme-modal>`,
    );
    for (const b of document.querySelectorAll("acme-button")) await (b as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete;
    const opener = document.getElementById("opener")!;
    opener.focus();
    await open(el);
    expect(focused()).toBe(document.getElementById("name"));
    el.close();
    await flush(el);
    expect(dialog(el).open).toBe(true); // the exit is still on screen
    expect(panel(el).style.opacity).toBe("0");
    await wait(400);
    expect(dialog(el).open).toBe(false);
    expect(document.activeElement).toBe(opener);
    expect(document.body.hasAttribute("data-scroll-lock")).toBe(false);
    el.initialFocus = "#submit";
    await open(el);
    await settle();
    expect(focused()).toBe(document.getElementById("submit"));
    el.close();
    await wait(400);
    const actionsOnly = await mount(`<acme-modal heading="Focus"><acme-button slot="actions" id="cancel">Cancel</acme-button></acme-modal>`);
    await open(actionsOnly);
    await settle();
    expect(deepActive()?.classList.contains("trap")).toBe(true);
  });

  test("Escape asks to close through a cancelable acme-dismiss, unless no-dismiss", async () => {
    const el = await mount(`<acme-modal open heading="X"></acme-modal>`);
    await el.updateComplete;
    const reasons: string[] = [];
    el.addEventListener("acme-dismiss", (e) => reasons.push((e as CustomEvent).detail.reason));
    dialog(el).dispatchEvent(new Event("cancel", { cancelable: true }));
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(reasons).toEqual(["escape"]);
    await wait(400);
    el.noDismiss = true;
    await open(el);
    dialog(el).dispatchEvent(new Event("cancel", { cancelable: true }));
    await el.updateComplete;
    expect(el.open).toBe(true);
    el.noDismiss = false;
    el.addEventListener("acme-dismiss", (e) => e.preventDefault(), { once: true });
    dialog(el).dispatchEvent(new Event("cancel", { cancelable: true }));
    await el.updateComplete;
    expect(el.open).toBe(true);
    el.close();
    await wait(400);
  });

  test("a press on the backdrop closes it; Enter fires acme-enter; acme-open and acme-close bracket the visit", async () => {
    const el = await mount(`<acme-modal heading="X"><p>Body</p></acme-modal>`);
    const events: string[] = [];
    for (const t of ["acme-open", "acme-close", "acme-enter"]) el.addEventListener(t, () => events.push(t));
    await open(el);
    dialog(el).dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    dialog(el).dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    await el.updateComplete;
    expect(el.open).toBe(false);
    await wait(400);
    expect(events).toEqual(["acme-open", "acme-enter", "acme-close"]);
  });

  test("the sheet form: under 600px the panel is the sheet with its fade, no trap, and the drawer height", async () => {
    const el = await mount(`<acme-modal heading="X" drawer-height="320"><p>Body</p></acme-modal>`);
    (el as unknown as { sheet: boolean }).sheet = true;
    await open(el);
    expect(dialog(el).className).toContain("sheet");
    // The desktop backdrop's fade-in attribute stays off the sheet: its backdrop fades through the frame attributes alone.
    expect(dialog(el).hasAttribute("data-open")).toBe(false);
    const p = panel(el);
    expect(p.className).toContain("sheet");
    expect(p.getAttribute("tabindex")).toBe("-1");
    expect(p.style.height).toBe("320px");
    expect(shadow(el).querySelector(".trap")).toBeNull();
    expect(shadow(el).querySelector(".modal > .fade-wrap > .fade")).not.toBeNull();
    el.drawer = false;
    await flush(el);
    expect(panel(el).className).not.toContain("sheet");
    expect(shadow(el).querySelector(".trap")).not.toBeNull();
  });
});
