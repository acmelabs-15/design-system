import { expect, test } from "bun:test";
import { stackSeparatorRectangles, type StackMemberRectangle } from "../stack-geometry";

const base = { vertical: false, reverse: false, rtl: false, wrap: true, thickness: 1, crossStart: 0, crossSize: 100 };
const member = (index: number, x: number, y: number, width = 100, height = 30, order = 0): StackMemberRectangle => ({ index, x, y, width, height, order });
test("wrapped lines have no orphan or cross-line dividers", () => {
  expect(stackSeparatorRectangles([member(0, 0, 0), member(1, 117, 0), member(2, 0, 40)], base)).toEqual([{ x: 108, y: 0, width: 1, height: 30 }]);
});
test("unequal cross-axis alignment remains on the same flex line", () => {
  expect(stackSeparatorRectangles([member(0, 0, 10, 100, 10), member(1, 117, 0, 100, 30)], base)).toEqual([{ x: 108, y: 0, width: 1, height: 30 }]);
});
test("reverse RTL and CSS order use native visual adjacency", () => {
  const ordered = [member(0, 0, 40, 100, 30, 2), member(1, 117, 0, 100, 30, 0), member(2, 0, 0, 100, 30, 1)];
  expect(stackSeparatorRectangles(ordered, { ...base, rtl: true })).toEqual([{ x: 108, y: 0, width: 1, height: 30 }]);
  expect(stackSeparatorRectangles(ordered, { ...base, reverse: true })).toEqual([{ x: 108, y: 0, width: 1, height: 30 }]);
});
test("zero-size rendered elements remain members and no-wrap lines stretch across their container", () => {
  expect(stackSeparatorRectangles([member(0, 0, 0, 0, 0), member(1, 17, 0)], { ...base, wrap: false })).toEqual([{ x: 8, y: 0, width: 1, height: 100 }]);
});
test("vertical wrapped columns use the same geometry", () => {
  expect(stackSeparatorRectangles([member(0, 0, 0, 30, 100), member(1, 0, 117, 30, 100), member(2, 40, 0, 30, 100)], { ...base, vertical: true })).toEqual([{ x: 0, y: 108, width: 30, height: 1 }]);
});
