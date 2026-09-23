import { afterEach, expect, test } from "bun:test";
import { coordinateOverlay } from "../overlay-coordination";

const cleanup: (() => void)[] = [];
afterEach(() => {
  for (const release of cleanup.splice(0)) release();
  document.body.replaceChildren();
});
const pointer = (type: string, id = 1) => new PointerEvent(type, { pointerId: id, pointerType: "mouse", button: 0, isPrimary: true, bubbles: true, composed: true });
function fixture() {
  const outer = document.createElement("div"),
    inner = document.createElement("div"),
    anchor = document.createElement("button");
  outer.append(inner, anchor);
  document.body.append(outer);
  const closed: string[] = [];
  const outerRelease = coordinateOverlay({ surface: outer, closeOnEscape: () => true, closeOnOutside: () => true, dismiss: (reason) => closed.push(`outer-${reason}`) });
  const innerRelease = coordinateOverlay({ surface: inner, anchor, closeOnEscape: () => true, closeOnOutside: () => true, dismiss: (reason) => closed.push(`inner-${reason}`) });
  cleanup.push(innerRelease, outerRelease);
  return { outer, inner, anchor, closed, innerRelease };
}
test("Escape dismisses only the top surface and cancels native default dismissal", () => {
  const f = fixture();
  const escape = new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true });
  f.inner.dispatchEvent(escape);
  expect(f.closed).toEqual(["inner-escape"]);
  expect(escape.defaultPrevented).toBe(true);
  f.innerRelease();
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", cancelable: true }));
  expect(f.closed).toEqual(["inner-escape", "outer-escape"]);
});
test("outside dismissal requires the same pointer to start and end outside", () => {
  const f = fixture();
  f.inner.dispatchEvent(pointer("pointerdown"));
  document.body.dispatchEvent(pointer("pointerup"));
  expect(f.closed).toEqual([]);
  document.body.dispatchEvent(pointer("pointerdown"));
  f.inner.dispatchEvent(pointer("pointerup"));
  expect(f.closed).toEqual([]);
  document.body.dispatchEvent(pointer("pointerdown", 7));
  document.body.dispatchEvent(pointer("pointerup", 8));
  expect(f.closed).toEqual([]);
  document.body.dispatchEvent(pointer("pointerup", 7));
  expect(f.closed).toEqual(["inner-outside"]);
});
test("the anchor is inside and a cancelled pointer cannot dismiss", () => {
  const f = fixture();
  f.anchor.dispatchEvent(pointer("pointerdown"));
  f.anchor.dispatchEvent(pointer("pointerup"));
  expect(f.closed).toEqual([]);
  document.body.dispatchEvent(pointer("pointerdown"));
  document.body.dispatchEvent(pointer("pointercancel"));
  document.body.dispatchEvent(pointer("pointerup"));
  expect(f.closed).toEqual([]);
});
test("a gesture cannot fall through to the surface below a released session", () => {
  const f = fixture();
  document.body.dispatchEvent(pointer("pointerdown"));
  f.innerRelease();
  document.body.dispatchEvent(pointer("pointerup"));
  expect(f.closed).toEqual([]);
});

test("releasing a parent also releases a child anchored through its slot", () => {
  const host = document.createElement("div"),
    surface = document.createElement("div"),
    anchor = document.createElement("button"),
    child = document.createElement("div");
  host.attachShadow({ mode: "open" }).append(surface);
  const slot = document.createElement("slot");
  surface.append(slot);
  // The test DOM omits assignedSlot; real-engine checks cover native assignment.
  Object.defineProperty(anchor, "assignedSlot", { get: () => slot });
  host.append(anchor);
  document.body.append(host, child);
  let closed = 0;
  const parent = coordinateOverlay({ surface, closeOnEscape: () => true, closeOnOutside: () => true, dismiss: () => {} }),
    releaseChild = coordinateOverlay({ surface: child, anchor, closeOnEscape: () => true, closeOnOutside: () => true, dismiss: () => {}, ownerRemoved: () => closed++ });
  cleanup.push(parent, releaseChild);
  parent();
  expect(closed).toBe(1);
});

test("a separately mounted dialog can outlive the menu that opened it", () => {
  const menu = document.createElement("div"),
    opener = document.createElement("button"),
    dialog = document.createElement("dialog");
  menu.append(opener);
  document.body.append(menu, dialog);
  let removed = 0;
  const releaseMenu = coordinateOverlay({ surface: menu, closeOnEscape: () => true, closeOnOutside: () => true, dismiss: () => {} });
  const releaseDialog = coordinateOverlay({
    surface: dialog,
    anchor: opener,
    parentFrom: "surface",
    anchorMustRemainConnected: false,
    closeOnEscape: () => true,
    closeOnOutside: () => true,
    dismiss: () => {},
    ownerRemoved: () => removed++,
  });
  cleanup.push(releaseDialog, releaseMenu);
  releaseMenu();
  expect(removed).toBe(0);
});

test("an independent dialog does not close when its opener is removed", async () => {
  const opener = document.createElement("button"),
    dialog = document.createElement("dialog");
  document.body.append(opener, dialog);
  let removed = 0;
  cleanup.push(
    coordinateOverlay({
      surface: dialog,
      anchor: opener,
      parentFrom: "surface",
      anchorMustRemainConnected: false,
      closeOnEscape: () => true,
      closeOnOutside: () => true,
      dismiss: () => {},
      ownerRemoved: () => removed++,
    }),
  );
  opener.remove();
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(removed).toBe(0);
});
