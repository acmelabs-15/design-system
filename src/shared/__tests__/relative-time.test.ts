import { expect, test } from "bun:test";
import { relativeInstant, relativeState } from "../relative-time";
test("dates are explicit instants with UTC date-only parsing", () => {
  expect(relativeInstant(0)).toBe(0);
  expect(relativeInstant(new Date(0))).toBe(0);
  expect(relativeInstant("2026-09-21")).toBe(Date.UTC(2026, 8, 21));
  expect(relativeInstant("2026-09-21T12:00:00+02:00")).toBe(Date.UTC(2026, 8, 21, 10));
  expect(Number.isNaN(relativeInstant("2026-02-30"))).toBe(true);
  expect(Number.isNaN(relativeInstant("09/21/2026"))).toBe(true);
  expect(Number.isNaN(relativeInstant("2026-09-21T12:00:00"))).toBe(true);
  expect(relativeInstant(undefined)).toBeUndefined();
});
test("scheduled boundaries change the rounded value or selected unit", () => {
  for (const difference of [
    -40000000000, -3000000000, -604800000, -100000000, -3600000, -60000, -44999, -2500, -1000, 0, 1000, 2500, 44999, 45000, 60000, 3600000, 100000000, 604800000, 3000000000, 40000000000,
  ]) {
    const now = 100000000000,
      instant = now + difference,
      state = relativeState(instant, now, "always"),
      before = relativeState(instant, state.nextChange - 1, "always"),
      after = relativeState(instant, state.nextChange, "always");
    expect(state.nextChange).toBeGreaterThan(now);
    expect(before.unit).toBe(state.unit);
    expect(Object.is(before.value, state.value)).toBe(true);
    expect(after.unit !== state.unit || !Object.is(after.value, state.value)).toBe(true);
  }
});
test("numeric always handles signed zero while auto waits for a meaningful rounded change", () => {
  const always = relativeState(1000, 999, "always"),
    auto = relativeState(1000, 999, "auto");
  expect(always.nextChange).toBe(1001);
  expect(auto.nextChange).toBe(1501);
});
