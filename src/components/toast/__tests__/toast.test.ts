import { afterEach, beforeEach, describe, expect, jest, test } from "bun:test";
import { createToastQueue, type ToastQueue, toasts } from "../../../index";
import type { AcmeToaster } from "../../toaster/toaster";
import type { AcmeToast } from "../toast";

/** Waits for the viewport and every toast in it to settle (the measure, the entry, the heights). */
const settle = async (el: AcmeToaster) => {
  for (let i = 0; i < 3; i++) {
    await el.updateComplete;
    for (const t of el.shadowRoot!.querySelectorAll<AcmeToast>("acme-toast")) await t.updateComplete;
  }
};
const mount = async (queue: ToastQueue = createToastQueue(), attrs = "") => {
  const el = document.createElement("acme-toaster") as AcmeToaster;
  if (attrs) el.setAttribute(attrs, "");
  el.queue = queue;
  document.body.append(el);
  await settle(el);
  return el;
};
const items = (el: AcmeToaster) => [...el.shadowRoot!.querySelectorAll<AcmeToast>("acme-toast")];
const roots = (el: AcmeToaster) => items(el).map((t) => t.shadowRoot!.querySelector(".toast") as HTMLElement);
const area = (el: AcmeToaster) => el.shadowRoot!.querySelector(".area") as HTMLElement | null;

describe("acme-toaster and acme-toast", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    document.body.innerHTML = "";
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  test("message() renders a status toast with the text and the dismiss control, shown once measured", async () => {
    const q = createToastQueue();
    const el = await mount(q);
    q.message("The Evil Rabbit jumped over the fence.");
    await settle(el);
    const a = area(el)!;
    expect(a.getAttribute("popover")).toBe("manual");
    expect(a.className).not.toContain("stacked");
    const [root] = roots(el);
    expect(root.getAttribute("role")).toBe("status");
    expect(root.getAttribute("aria-atomic")).toBe("true");
    expect(root.getAttribute("aria-labelledby")).toBe("");
    expect(root.className).toContain("shown");
    expect(root.querySelector(".message .text")?.textContent).toBe("The Evil Rabbit jumped over the fence.");
    expect(root.querySelector(".controls .close")?.getAttribute("aria-label")).toBe("Dismiss toast");
    expect(root.querySelector(".controls .undo")).toBeNull();
    expect(root.querySelector(".sr")).toBeNull();
    expect(root.getAttribute("style")).toContain("--max-height:0px");
  });

  test("success, error and warning set the type, read it before the message, and take a default text", async () => {
    const q = createToastQueue();
    const el = await mount(q);
    q.success("a");
    q.error();
    q.warning({ text: "c" });
    await settle(el);
    const [s, e, w] = roots(el);
    expect(s.className).toContain("success");
    expect(s.querySelector(".sr")?.textContent).toBe("success: ");
    expect(e.className).toContain("error");
    expect(e.querySelector(".text")?.textContent).toBe("An error occurred.");
    expect(e.getAttribute("role")).toBe("status");
    expect(w.className).toContain("warning");
    expect(w.querySelector(".sr")).toBeNull();
  });

  test("an action renders the cancel and action buttons, makes the toast an alert dialog, and runs the handlers before hiding", async () => {
    const q = createToastQueue();
    const el = await mount(q);
    const calls: string[] = [];
    q.message({ text: "x", action: "Undo", cancelAction: "Cancel", onAction: () => calls.push("action"), onCancelAction: () => calls.push("cancel"), onRemove: (d) => calls.push(`remove:${d}`) });
    await settle(el);
    const [root] = roots(el);
    expect(root.getAttribute("role")).toBe("alertdialog");
    expect(root.getAttribute("aria-labelledby")).toBe("toast-message");
    expect(root.querySelector(".controls")).toBeNull();
    const [cancel, action] = root.querySelectorAll<HTMLButtonElement>(".actions .btn");
    expect(cancel.textContent?.trim()).toBe("Cancel");
    expect(cancel.className).toContain("tertiary");
    expect(action.textContent?.trim()).toBe("Undo");
    expect(action.className).not.toContain("tertiary");
    action.click();
    await settle(el);
    expect(calls).toEqual(["action"]);
    expect(root.className).toContain("hiding");
    jest.advanceTimersByTime(160);
    await settle(el);
    expect(calls).toEqual(["action", "remove:false"]);
    expect(items(el)).toHaveLength(0);
    expect(area(el)).toBeNull();
    q.message({ text: "y", action: "Retry", onCancelAction: () => calls.push("cancel") });
    await settle(el);
    const [c2] = roots(el)[0].querySelectorAll<HTMLButtonElement>(".actions .btn");
    expect(c2.textContent?.trim()).toBe("Dismiss");
    c2.click();
    expect(calls.at(-1)).toBe("cancel");
  });

  test("an action as a link renders an anchor", async () => {
    const q = createToastQueue();
    const el = await mount(q);
    q.message({ text: "x", action: "Open", actionHref: "/deploy" });
    await settle(el);
    const a = roots(el)[0].querySelector(".actions a.btn") as HTMLAnchorElement;
    expect(a.getAttribute("href")).toBe("/deploy");
    expect(a.getAttribute("role")).toBe("link");
  });

  test("onUndoAction adds the undo control before the dismiss control; the dismiss control reports the removal as dismissed", async () => {
    const q = createToastQueue();
    const el = await mount(q);
    let undone = 0;
    const removed: boolean[] = [];
    q.message({ text: "x", onUndoAction: () => undone++, onRemove: (d) => removed.push(d) });
    q.message({ text: "y", onRemove: (d) => removed.push(d) });
    await settle(el);
    const [first, second] = roots(el);
    const controls = first.querySelectorAll(".controls .btn");
    expect(controls[0].className).toContain("undo");
    expect(controls[0].getAttribute("aria-label")).toBe("Undo");
    expect(controls[1].className).toContain("close");
    (controls[0] as HTMLButtonElement).click();
    (second.querySelector(".close") as HTMLButtonElement).click();
    jest.advanceTimersByTime(160);
    await settle(el);
    expect(undone).toBe(1);
    expect(removed).toEqual([false, true]);
    expect(items(el)).toHaveLength(0);
  });

  test("a toast hides itself after 3500ms and leaves 160ms later; preserve and an action keep it; preserve: false with an action restores the timer", async () => {
    const q = createToastQueue();
    const el = await mount(q);
    q.message({ text: "timed", key: "t" });
    q.message({ text: "kept", key: "p", preserve: true });
    q.message({ text: "action", key: "a", action: "Undo" });
    q.message({ text: "action timed", key: "at", action: "Undo", preserve: false });
    q.message({ text: "long", key: "l", timeout: 5000 });
    await settle(el);
    jest.advanceTimersByTime(3499);
    await settle(el);
    expect(roots(el).map((r) => r.className.includes("hiding"))).toEqual([false, false, false, false, false]);
    jest.advanceTimersByTime(1);
    await settle(el);
    expect(roots(el).map((r) => r.className.includes("hiding"))).toEqual([true, false, false, true, false]);
    jest.advanceTimersByTime(160);
    await settle(el);
    expect(q.store.state.map((t) => t.key)).toEqual(["p", "a", "l"]);
    jest.advanceTimersByTime(1500);
    await settle(el);
    expect(q.store.state.map((t) => t.key)).toEqual(["p", "a"]);
  });

  test("the pointer over the area pauses the timer and expands the stack; leaving restarts the full timer", async () => {
    const q = createToastQueue();
    const el = await mount(q);
    q.message("a");
    q.message("b");
    await settle(el);
    const a = area(el)!;
    expect(a.className).toContain("stacked");
    jest.advanceTimersByTime(2000);
    a.dispatchEvent(new Event("mouseenter"));
    await settle(el);
    expect(roots(el).every((r) => r.hasAttribute("data-expanded"))).toBe(true);
    jest.advanceTimersByTime(5000);
    await settle(el);
    expect(items(el)).toHaveLength(2);
    a.dispatchEvent(new Event("mouseleave"));
    await settle(el);
    expect(roots(el).some((r) => r.hasAttribute("data-expanded"))).toBe(false);
    jest.advanceTimersByTime(3499);
    await settle(el);
    expect(items(el)).toHaveLength(2);
    jest.advanceTimersByTime(1 + 160);
    await settle(el);
    expect(items(el)).toHaveLength(0);
  });

  test("the stack places the newest toast in front and writes each toast's geometry", async () => {
    const q = createToastQueue();
    const el = await mount(q);
    q.message({ text: "first", key: "1" });
    q.message({ text: "second", key: "2" });
    q.message({ text: "third", key: "3" });
    await settle(el);
    const list = items(el);
    expect(list.map((t) => t.position)).toEqual([2, 1, 0]);
    expect(list.map((t) => t.item.key)).toEqual(["1", "2", "3"]);
    const [back, middle, front] = roots(el);
    expect(front.getAttribute("style")).toBe("max-height:0px;--y:0px;--z:-0px;--max-height:0px");
    expect(middle.getAttribute("style")).toBe("max-height:0px;max-height:50px;transform:translate3d(0, calc(-0px + 100% + -20px), -1px) scale(0.95);--y:-20px;--z:-1px;--max-height:0px");
    expect(back.getAttribute("style")).toContain("scale(0.9)");
    expect(back.getAttribute("style")).toContain("--y:-40px");
    q.setHeight("3", 64);
    q.setHeight("2", 64);
    await settle(el);
    expect(roots(el)[1].getAttribute("style")).toBe("max-height:64px;max-height:50px;transform:translate3d(0, calc(-64px + 100% + -20px), -1px) scale(0.95);--y:-84px;--z:-1px;--max-height:64px");
    expect(roots(el)[0].getAttribute("style")).toContain("--y:-168px");
  });

  test("setHiding hides every toast 300ms later; setMessage, removeToast, removeToastByKey, a repeated key and clear shape the queue", async () => {
    const q = createToastQueue();
    const el = await mount(q);
    q.message({ text: "a", key: "a", preserve: true });
    q.message({ text: "b", key: "b", preserve: true });
    q.message({ text: "b again", key: "b", preserve: true });
    q.message({ text: "c", key: "c", preserve: true });
    q.message({ text: "d", key: "d", preserve: true });
    expect(q.store.state.map((t) => t.text)).toEqual(["a", "b", "c", "d"]);
    q.removeToast(0);
    q.removeToastByKey(["c", "zzz"]);
    expect(q.store.state.map((t) => t.key)).toEqual(["b", "d"]);
    await settle(el);
    q.setHiding();
    await settle(el);
    jest.advanceTimersByTime(299);
    await settle(el);
    expect(roots(el).some((r) => r.className.includes("hiding"))).toBe(false);
    jest.advanceTimersByTime(1);
    await settle(el);
    expect(roots(el).every((r) => r.className.includes("hiding"))).toBe(true);
    q.setMessage("only");
    await settle(el);
    expect(q.store.state.map((t) => t.text)).toEqual(["only"]);
    q.clear();
    await settle(el);
    expect(area(el)).toBeNull();
  });

  test("hideX, fullWidth, fullBleed, overflowHidden and a visual set the modifiers; a sized visual takes its height", async () => {
    const q = createToastQueue();
    const el = await mount(q);
    q.message({ text: "a", hideX: true, preserve: true });
    q.message({ text: "b", fullWidth: true, fullBleed: true, overflowHidden: true, preserve: true });
    q.message({ text: "c", visual: { height: 80, content: "cover" }, preserve: true });
    await settle(el);
    const [a, b, c] = roots(el);
    expect(a.className).toContain("wide");
    expect(a.querySelector(".controls")).toBeNull();
    expect(b.className).toContain("wide");
    expect(b.className).toContain("bleed");
    expect(b.className).toContain("clip");
    expect(c.className).toContain("clip");
    expect(c.querySelector(".visual")?.getAttribute("style")).toBe("height:80px");
    expect(c.querySelector(".visual")?.textContent).toBe("cover");
  });

  test("the text takes a node or a string; center moves the area", async () => {
    const q = createToastQueue();
    const el = await mount(q, "center");
    const node = document.createElement("span");
    node.innerHTML = "<b>Bold</b> text";
    q.message({ text: node, preserve: true });
    await settle(el);
    expect(area(el)?.className).toContain("center");
    expect(roots(el)[0].querySelector(".text b")?.textContent).toBe("Bold");
  });

  test("of two viewports on one queue the first renders; the second takes over when it leaves; loaded follows the viewports", async () => {
    const q = createToastQueue();
    expect(q.loaded).toBe(false);
    const first = await mount(q);
    const second = await mount(q);
    expect(q.loaded).toBe(true);
    expect(q.current).toBe(q);
    q.message({ text: "x", preserve: true });
    await settle(first);
    await settle(second);
    expect(items(first)).toHaveLength(1);
    expect(items(second)).toHaveLength(0);
    first.remove();
    await settle(second);
    expect(items(second)).toHaveLength(1);
    second.remove();
    expect(q.loaded).toBe(false);
  });

  test("a viewport without a queue of its own renders the shared toasts queue; show() is message with the text apart", async () => {
    const el = document.createElement("acme-toaster") as AcmeToaster;
    document.body.append(el);
    await settle(el);
    // Other test files leave toasts in the shared queue (a copy that failed): the shared queue starts empty here.
    toasts.clear();
    toasts.show("Copied", { type: "success", preserve: true });
    await settle(el);
    expect(roots(el)[0].className).toContain("success");
    toasts.clear();
    await settle(el);
    expect(area(el)).toBeNull();
    el.remove();
  });

  test("a queue set after the viewport is in the document is the one it renders", async () => {
    const shared = document.createElement("acme-toaster") as AcmeToaster;
    document.body.append(shared);
    const el = document.createElement("acme-toaster") as AcmeToaster;
    document.body.append(el);
    const q = createToastQueue();
    el.queue = q;
    await settle(el);
    q.message({ text: "own", preserve: true });
    await settle(el);
    expect(items(el)).toHaveLength(1);
    expect(toasts.loaded).toBe(true);
    el.remove();
    expect(q.loaded).toBe(false);
    shared.remove();
    expect(toasts.loaded).toBe(false);
  });

  test("the interaction states land on the buttons", async () => {
    const q = createToastQueue();
    const el = await mount(q);
    q.message({ text: "x", preserve: true });
    await settle(el);
    const close = roots(el)[0].querySelector(".close") as HTMLElement;
    close.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    expect(close.getAttribute("data-hover")).toBe("true");
    close.dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse" }));
    expect(close.hasAttribute("data-hover")).toBe(false);
  });
});
