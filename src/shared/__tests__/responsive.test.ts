import { expect, test } from "bun:test";
import { runInNewContext } from "node:vm";
import { compareResponsiveRanges, normalizeResponsive } from "../responsive";

const number = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);
const boolean = (value: unknown): value is boolean => typeof value === "boolean";
const string = (value: unknown): value is string => typeof value === "string";

test("scalars preserve zero, false and bracketed CSS; absence removes the override", () => {
  expect(normalizeResponsive(0, number)).toEqual([{ min: 0, value: 0 }]);
  expect(normalizeResponsive(false, boolean)).toEqual([{ min: 0, value: false }]);
  expect(normalizeResponsive("[content-start] 1fr [content-end]", string)).toEqual([{ min: 0, value: "[content-start] 1fr [content-end]" }]);
  expect(normalizeResponsive(undefined, number)).toEqual([]);
});

test("five array positions map to the selected bands and skip only null or undefined", () => {
  expect(normalizeResponsive([0, null, 2, undefined, 4], number)).toEqual([
    { min: 0, value: 0 },
    { min: 52.5, value: 2 },
    { min: 100, value: 4 },
  ]);
  expect(normalizeResponsive([false, true, false], boolean)).toEqual([
    { min: 0, value: false },
    { min: 37.5, value: true },
    { min: 52.5, value: false },
  ]);
  expect(normalizeResponsive([, , 0], number)).toEqual([{ min: 52.5, value: 0 }]);
  expect(normalizeResponsive([], number)).toEqual([]);
});

test("equivalent intervals collapse when their values agree", () => {
  expect(normalizeResponsive({ compactOnly: 1, mediumDown: 1, compactToMedium: 1 }, number)).toEqual([{ min: 0, max: 37.5, value: 1 }]);
  expect(normalizeResponsive({ extraLarge: false, extraLargeOnly: false }, boolean)).toEqual([{ min: 100, value: false }]);
  expect(normalizeResponsive({ mediumOnly: 0, mediumToExpanded: 0 }, number)).toEqual([{ min: 37.5, max: 52.5, value: 0 }]);
});

test("conflicting equivalent intervals reject the whole input without mutation", () => {
  const input = Object.freeze({ compact: 3, compactOnly: 1, mediumDown: 2 });
  expect(() => normalizeResponsive(input, number)).toThrow(/Conflicting responsive values/);
  expect(input).toEqual({ compact: 3, compactOnly: 1, mediumDown: 2 });
});

test("Chakra categories order baseline, ascending minima and descending maximum-only queries", () => {
  expect(normalizeResponsive({ large: 3, mediumDown: 6, compact: 0, extraLargeDown: 4, expandedToExtraLarge: 2, medium: 1, largeDown: 5 }, number)).toEqual([
    { min: 0, value: 0 },
    { min: 37.5, value: 1 },
    { min: 52.5, max: 100, value: 2 },
    { min: 75, value: 3 },
    { min: 0, max: 100, value: 4 },
    { min: 0, max: 75, value: 5 },
    { min: 0, max: 37.5, value: 6 },
  ]);
});

test("equal minima use source query-text ties, not a numeric maximum or narrowest-first rule", () => {
  const entries = [
    ["mediumToLarge", "to75"],
    ["mediumOnly", "to52.5"],
    ["mediumToExtraLarge", "to100"],
    ["medium", "up"],
  ] as const;
  const expected = [
    { min: 37.5, value: "up" },
    { min: 37.5, max: 100, value: "to100" },
    { min: 37.5, max: 52.5, value: "to52.5" },
    { min: 37.5, max: 75, value: "to75" },
  ];
  expect(normalizeResponsive(Object.fromEntries(entries), string)).toEqual(expected);
  expect(normalizeResponsive(Object.fromEntries([...entries].reverse()), string)).toEqual(expected);
});

test("the shared comparator groups equal ranges without imposing a property declaration order", () => {
  expect(compareResponsiveRanges({ min: 37.5, max: 75 }, { min: 37.5, max: 75 })).toBe(0);
  expect(compareResponsiveRanges({ min: 0 }, { min: 37.5 })).toBeLessThan(0);
  expect(compareResponsiveRanges({ min: 75 }, { min: 0, max: 100 })).toBeLessThan(0);
  expect(compareResponsiveRanges({ min: 0, max: 100 }, { min: 0, max: 75 })).toBeLessThan(0);
});

test("all selected conditions normalize to fifteen unique intervals", () => {
  const bands = ["compact", "medium", "expanded", "large", "extraLarge"];
  const conditions: Record<string, number> = {};
  for (const [index, band] of bands.entries()) {
    conditions[band] = 1;
    conditions[`${band}Only`] = 1;
    if (index) {
      conditions[`${band}Down`] = 1;
    }
    for (const upper of bands.slice(index + 1)) {
      conditions[`${band}To${upper[0].toUpperCase()}${upper.slice(1)}`] = 1;
    }
  }
  expect(Object.keys(conditions)).toHaveLength(24);
  expect(normalizeResponsive(conditions, number)).toHaveLength(15);
});

test("normalization returns frozen records and does not retain mutable container state", () => {
  const input = { medium: 2 };
  const output = normalizeResponsive(input, number);
  input.medium = 9;
  expect(output).toEqual([{ min: 37.5, value: 2 }]);
  expect(Object.isFrozen(output)).toBe(true);
  expect(Object.isFrozen(output[0])).toBe(true);
  expect(normalizeResponsive(Object.assign(Object.create(null), { compact: 0 }), number)).toEqual([{ min: 0, value: 0 }]);
});

test("a pure transition table changes numeric rem bounds without mutating defaults", () => {
  const widths = { medium: 40, expanded: 60, large: 80, extraLarge: 120 };
  expect(normalizeResponsive({ mediumToLarge: 1, extraLarge: 2 }, number, widths)).toEqual([
    { min: 40, max: 80, value: 1 },
    { min: 120, value: 2 },
  ]);
  widths.medium = 45;
  expect(normalizeResponsive({ medium: 1 }, number)).toEqual([{ min: 37.5, value: 1 }]);
});

test("plain responsive records and breakpoint tables work across realms", () => {
  const input = runInNewContext("({ medium: 2 })");
  const widths = runInNewContext("({ medium: 40, expanded: 60, large: 80, extraLarge: 120 })");
  expect(Object.getPrototypeOf(input)).not.toBe(Object.prototype);
  expect(Object.getPrototypeOf(widths)).not.toBe(Object.prototype);
  expect(normalizeResponsive(input, number)).toEqual([{ min: 37.5, value: 2 }]);
  expect(normalizeResponsive(input, number, widths)).toEqual([{ min: 40, value: 2 }]);
  expect(normalizeResponsive({ mediumToLarge: 1 }, number, widths)).toEqual([{ min: 40, max: 80, value: 1 }]);
});

test("nonplain objects from another realm remain invalid", () => {
  for (const expression of ["new Date()", "new Map()", "new (class Values { medium = 2 })()", "Object.create({ medium: 2 })"]) {
    const input = runInNewContext(expression);
    expect(() => normalizeResponsive(input, number)).toThrow();
    expect(() => normalizeResponsive(1, number, input)).toThrow();
  }
});

test.each(
  [
    null,
    new Date(),
    new Map(),
    Object.create({ medium: 1 }),
    [1, 2, 3, 4, 5, 6],
    [[1]],
    { medium: [1] },
    { medium: null },
    { medium: undefined },
    { small: 1 },
    { extra: 1 },
    { compactDown: 1 },
    { largeToMedium: 1 },
    { mediumToMedium: 1 },
    { mediumToUnknown: 1 },
    { Medium: 1 },
    { medium: Infinity },
    { medium: false },
  ].map((input) => [input]),
)("rejects unsupported input shape or condition %#", (input) => {
  expect(() => normalizeResponsive(input, number)).toThrow();
});

test.each([{ medium: 0 }, { medium: -1 }, { medium: Infinity }, { medium: NaN }, { medium: 60 }, { large: 100 }, { extraLarge: 74 }, { small: 10 }])(
  "rejects invalid or unordered transition tables %#",
  (widths) => {
    expect(() => normalizeResponsive(1, number, widths)).toThrow();
  },
);
