import { expect, test } from "bun:test";
import { paginationRange, paginationState } from "../pagination-model";

test("unknown totals require explicit next availability and never invent a last page", () => {
  expect(paginationState(3, 10, undefined, undefined)).toMatchObject({ totalPages: undefined, previous: 2, next: undefined });
  expect(paginationState(3, 10, undefined, true).next).toBe(4);
});
test("zero totals and out-of-range supplied pages have bounded actions without rewriting page", () => {
  expect(paginationState(1, 10, 0)).toMatchObject({ totalPages: 0, previous: undefined, next: undefined });
  expect(paginationState(9, 10, 25)).toMatchObject({ page: 9, totalPages: 3, previous: 3, next: undefined });
  expect(() => paginationState(0, 10, 20)).toThrow();
  expect(() => paginationState(1, 0, 20)).toThrow();
  expect(() => paginationState(1, 10, -1)).toThrow();
});
test("numbered ranges remain bounded and replace single hidden pages with their number", () => {
  expect(paginationRange(1, 10)).toEqual([1, 2, 3, 4, 5, "ellipsis", 10]);
  expect(paginationRange(5, 10)).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 10]);
  expect(paginationRange(10, 10)).toEqual([1, "ellipsis", 6, 7, 8, 9, 10]);
  expect(paginationRange(1, 0)).toEqual([]);
  expect(paginationRange(4, undefined)).toEqual([4]);
  expect(paginationRange(500000, Number.MAX_SAFE_INTEGER).length).toBeLessThanOrEqual(7);
});
