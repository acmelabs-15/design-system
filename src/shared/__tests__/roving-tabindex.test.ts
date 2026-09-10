import { describe, expect, test } from "bun:test";
import { RovingTabindex } from "../roving-tabindex";

const host = () => ({ addController() {}, removeController() {}, requestUpdate() {}, updateComplete: Promise.resolve(true) });
const buttons = (n: number, off: number[] = []) => {
  document.body.innerHTML = "";
  return Array.from({ length: n }, (_, i) => {
    const b = document.createElement("button");
    b.textContent = String(i);
    b.disabled = off.includes(i);
    document.body.append(b);
    return b;
  });
};
const key = (k: string) => new KeyboardEvent("keydown", { key: k, cancelable: true });

describe("RovingTabindex", () => {
  test("moves to the neighbour, stops at a disabled one and at the ends by default", () => {
    const items = buttons(3, [2]);
    let current = 0;
    const moved: number[] = [];
    const r = new RovingTabindex(host(), {
      items: () => items,
      current: () => current,
      onMove: (_, i) => {
        current = i;
        moved.push(i);
      },
    });
    expect(r.tabindex(0)).toBe(0);
    expect(r.tabindex(1)).toBe(-1);
    expect(r.handleKey(key("ArrowRight"))).toBe(true);
    expect(r.handleKey(key("ArrowRight"))).toBe(false);
    expect(r.handleKey(key("ArrowLeft"))).toBe(true);
    expect(r.handleKey(key("ArrowLeft"))).toBe(false);
    expect(r.handleKey(key("ArrowDown"))).toBe(false);
    expect(moved).toEqual([1, 0]);
  });

  test("wrap, skipDisabled and homeEnd widen the moves", () => {
    const items = buttons(4, [1]);
    let current = 0;
    const r = new RovingTabindex(host(), { items: () => items, current: () => current, onMove: (_, i) => (current = i), wrap: true, skipDisabled: true, homeEnd: true });
    r.handleKey(key("ArrowRight"));
    expect(current).toBe(2);
    r.handleKey(key("ArrowRight"));
    r.handleKey(key("ArrowRight"));
    expect(current).toBe(0);
    r.handleKey(key("ArrowLeft"));
    expect(current).toBe(3);
    r.handleKey(key("Home"));
    expect(current).toBe(0);
    r.handleKey(key("End"));
    expect(current).toBe(3);
  });
});
