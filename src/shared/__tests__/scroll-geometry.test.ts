import { expect, test } from "bun:test";
import { scrollGeometry, physicalScrollLeft, nativeScrollLeft, scrollFromPointer } from "../scroll-geometry";

test("thumb geometry is bounded by its track, including a track below the minimum", () => {
  expect(scrollGeometry(100, 1000, 200, 0)).toEqual({ maximum: 900, thumb: 24, travel: 176, offset: 0, position: 0, overflow: true });
  const tiny = scrollGeometry(100, 1000, 10, 400);
  expect(tiny.thumb).toBe(10);
  expect(tiny.travel).toBe(0);
  expect(scrollFromPointer(500, 0, 0, tiny)).toBe(400);
});
test("empty and nonoverflowing geometry never produces NaN", () => {
  const cases: Parameters<typeof scrollGeometry>[] = [
    [0, 0, 0, 0],
    [100, 20, 100, 20],
    [0, 200, 0, -20],
  ];
  for (const args of cases) {
    const state = scrollGeometry(...args);
    for (const n of Object.values(state)) {
      if (typeof n === "number") {
        expect(Number.isFinite(n)).toBe(true);
      }
    }
  }
});
test("elastic positions clamp and pointer travel maps to the actual scroll range", () => {
  const state = scrollGeometry(100, 500, 100, 600);
  expect(state.position).toBe(400);
  expect(state.offset).toBe(state.travel);
  expect(scrollFromPointer(1000, 0, 0, state)).toBe(400);
  expect(scrollFromPointer(-10, 0, 0, state)).toBe(0);
});
test("modern RTL native offsets round trip through physical track coordinates", () => {
  expect(physicalScrollLeft(0, 400, true)).toBe(400);
  expect(physicalScrollLeft(-400, 400, true)).toBe(0);
  for (const rtl of [true, false]) {
    for (const position of [0, 100, 400]) {
      expect(physicalScrollLeft(nativeScrollLeft(position, 400, rtl), 400, rtl)).toBe(position);
    }
  }
});
