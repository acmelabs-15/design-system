import { expect, test } from "bun:test";
import { addDecimal } from "../decimal-step";
test("decimal steps do not accumulate binary addition drift", () => {
  let value = 0;
  for (let n = 0; n < 10; n++) value = addDecimal(value, 0.1);
  expect(value).toBe(1);
  expect(addDecimal(0.1, 0.2)).toBe(0.3);
  expect(addDecimal(0.3, -0.1)).toBe(0.2);
  expect(addDecimal(-0.2, -0.1)).toBe(-0.3);
});
test("exponent-form steps terminate across finite numeric magnitudes", () => {
  expect(addDecimal(0, Number.MIN_VALUE)).toBe(Number.MIN_VALUE);
  expect(addDecimal(Number.MIN_VALUE, Number.MIN_VALUE)).toBe(1e-323);
  expect(addDecimal(1e-7, 2e-7)).toBe(3e-7);
  expect(addDecimal(1e21, 1e21)).toBe(2e21);
  expect(addDecimal(1e308, -1e308)).toBe(0);
});
test("nonfinite inputs are rejected and overflow is explicit", () => {
  expect(() => addDecimal(Infinity, 1)).toThrow();
  expect(() => addDecimal(1, NaN)).toThrow();
  expect(addDecimal(Number.MAX_VALUE, Number.MAX_VALUE)).toBe(Infinity);
});

test("decimal grid snapping keeps fractional origins and negative rounding exact", async () => {
  const { snapDecimal, multiplyDecimal } = await import("../decimal-step");
  expect(multiplyDecimal(0.1, 3)).toBe(0.3);
  expect(snapDecimal(-0.26, 0.1, -0.05)).toBe(-0.25);
  expect(snapDecimal(-0.26, 0.1, -0.05, "floor")).toBe(-0.35);
  expect(snapDecimal(-0.26, 0.1, -0.05, "ceil")).toBe(-0.25);
  expect(snapDecimal(Number.MIN_VALUE, Number.MIN_VALUE)).toBe(Number.MIN_VALUE);
});
