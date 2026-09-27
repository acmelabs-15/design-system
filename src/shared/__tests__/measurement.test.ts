import { expect, test } from "bun:test";
import { resolveProgress, resolveMeter, meterArcs } from "../measurement";

test("progress distinguishes real zero, missing data and invalid limits", () => {
  expect(resolveProgress(undefined, 100).kind).toBe("indeterminate");
  expect(resolveProgress(0, 100)).toMatchObject({ kind: "determinate", value: 0, ratio: 0 });
  expect(resolveProgress(120, 100)).toMatchObject({ kind: "determinate", value: 100, clamped: true });
  expect(resolveProgress(10, 0).kind).toBe("invalid");
  expect(resolveProgress(NaN, 100).kind).toBe("invalid");
});
test("meter validates ordered bounds and separates loading from a known measurement", () => {
  expect(resolveMeter({ min: 0, max: 100 }).kind).toBe("empty");
  expect(resolveMeter({ min: 0, max: 100, value: 0 })).toMatchObject({ kind: "known", value: 0, ratio: 0, tone: "neutral" });
  expect(resolveMeter({ min: 0, max: 100, value: 25, loading: true }).kind).toBe("loading");
  expect(resolveMeter({ min: 1, max: 1, value: 1 }).kind).toBe("invalid");
  expect(resolveMeter({ min: 0, max: 100, value: 50, low: 80, high: 20 }).kind).toBe("invalid");
});
test("meter quality follows explicit low high and optimum regions rather than fixed percentages", () => {
  const range = { min: 0, max: 100, low: 30, high: 70 };
  expect(resolveMeter({ ...range, value: 10, optimum: 0 })).toMatchObject({ tone: "success" });
  expect(resolveMeter({ ...range, value: 50, optimum: 0 })).toMatchObject({ tone: "warning" });
  expect(resolveMeter({ ...range, value: 90, optimum: 0 })).toMatchObject({ tone: "error" });
  expect(resolveMeter({ ...range, value: 90, optimum: 100 })).toMatchObject({ tone: "success" });
  expect(resolveMeter({ ...range, value: 50 })).toMatchObject({ tone: "success" });
});
test("large finite ranges and small circular arcs never produce invalid geometry", () => {
  expect(resolveMeter({ min: -1e308, max: 1e308, value: 0 })).toMatchObject({ kind: "known", ratio: 0.5 });
  for (const value of [0, 0.01, 0.5, 50, 99.99, 100]) {
    for (const size of ["tiny", "small", "medium", "large"] as const) {
      const arcs = meterArcs(value, size);
      expect(arcs.primary).toBeGreaterThanOrEqual(0);
      expect(arcs.secondary).toBeGreaterThanOrEqual(0);
      expect(Number.isFinite(arcs.secondaryRotation)).toBe(true);
    }
  }
});
