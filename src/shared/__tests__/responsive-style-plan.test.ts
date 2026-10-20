import { expect, test } from "bun:test";
import { createResponsiveStylePlan } from "../responsive-style-plan";
import type { StyleSupports } from "../style-input-schema";

const supports: StyleSupports = (_property, value) => value !== "invalid";

test("merges equivalent conditions across properties before applying authored declaration order", () => {
  const plan = createResponsiveStylePlan(
    [
      ["paddingInline", { mediumDown: 2, medium: 4 }],
      ["padding", { compactOnly: 1, medium: 3 }],
      ["paddingInlineStart", { compactToMedium: 0 }],
    ],
    { supports },
  );
  expect(plan.map(({ range }) => range)).toEqual([{ min: 37.5 }, { min: 0, max: 37.5 }]);
  expect(plan[0].declarations.map(({ property, value }) => [property, value])).toEqual([
    ["padding-inline", "var(--acme-spacing-4)"],
    ["padding", "var(--acme-spacing-3)"],
  ]);
  expect(plan[1].declarations.map(({ property, value }) => [property, value])).toEqual([
    ["padding-inline", "var(--acme-spacing-2)"],
    ["padding", "var(--acme-spacing-1)"],
    ["padding-inline-start", "var(--acme-spacing-0)"],
  ]);
});

test("query order wins across conditions even when the broad shorthand is authored last", () => {
  const first = createResponsiveStylePlan(
    [
      ["paddingInline", { large: 4 }],
      ["padding", 2],
    ],
    { supports },
  );
  const second = createResponsiveStylePlan(
    [
      ["padding", 2],
      ["paddingInline", { large: 4 }],
    ],
    { supports },
  );
  expect(first).toEqual(second);
  expect(first.map(({ range }) => range)).toEqual([{ min: 0 }, { min: 75 }]);
  expect(first[1].declarations[0].property).toBe("padding-inline");
});

test("preserves raw CSS and uses independent numeric categories with signed spacing", () => {
  const plan = createResponsiveStylePlan(
    [
      ["marginInlineStart", -2],
      ["padding", 0],
      ["width", 2],
      ["flexBasis", 0.5],
      ["opacity", 0],
      ["zIndex", -1],
      ["aspectRatio", 1.5],
      ["borderWidth", 0],
      ["color", "var(--theme-color)"],
      ["height", "calc(100% - 2rem)"],
    ],
    { supports },
  );
  expect(plan[0].declarations.map(({ value }) => value)).toEqual([
    "calc(var(--acme-spacing-2) * -1)",
    "var(--acme-spacing-0)",
    "var(--acme-size-2)",
    "var(--acme-size-0-5)",
    "0",
    "-1",
    "1.5",
    "0",
    "var(--theme-color)",
    "calc(100% - 2rem)",
  ]);
});

test("display reaches both boxes while ordinary geometry reaches only the host", () => {
  const plan = createResponsiveStylePlan(
    [
      ["display", ["block", null, "none"]],
      ["width", 4],
    ],
    { supports, displayModes: ["block", "none"] },
  );
  expect(plan.map(({ declarations }) => declarations.map(({ property, target }) => [property, target]))).toEqual([
    [
      ["display", "host-and-root"],
      ["width", "host"],
    ],
    [["display", "host-and-root"]],
  ]);
  expect(() => createResponsiveStylePlan([["display", "contents"]], { supports, displayModes: ["block"] })).toThrow();
});

test("a fresh empty input plan removes all prior declarations, without a saved last-valid result", () => {
  const original = createResponsiveStylePlan([["width", 4]], { supports });
  expect(createResponsiveStylePlan([["width", undefined]], { supports })).toEqual([]);
  expect(createResponsiveStylePlan([], { supports })).toEqual([]);
  expect(createResponsiveStylePlan([["width", "invalid"]], { supports })).toEqual([]);
  expect(original[0].declarations[0].value).toBe("var(--acme-size-4)");
});

test("invalid CSS leaves do not retain previous values or discard valid sibling conditions", () => {
  const plan = createResponsiveStylePlan(
    [
      ["padding", { compact: 2, medium: "invalid", large: 4 }],
      ["color", "red"],
      ["width", ""],
    ],
    { supports: (property, value) => supports(property, value) && value !== "" },
  );
  expect(plan.map(({ range }) => range)).toEqual([{ min: 0 }, { min: 75 }]);
  expect(plan[0].declarations.map(({ property, value }) => [property, value])).toEqual([
    ["padding", "var(--acme-spacing-2)"],
    ["color", "red"],
  ]);
  expect(plan[1].declarations[0].value).toBe("var(--acme-spacing-4)");
});

test("validates whole inputs and duplicate fields before returning a plan", () => {
  expect(() => createResponsiveStylePlan([["padding", { compactOnly: 1, mediumDown: 2 }]], { supports })).toThrow(/Conflicting/);
  expect(() =>
    createResponsiveStylePlan(
      [
        ["padding", 1],
        ["padding", 2],
      ],
      { supports },
    ),
  ).toThrow(/Duplicate/);
  expect(() => createResponsiveStylePlan([["unknown" as "padding", 1]], { supports })).toThrow(/Unknown/);
  expect(() => createResponsiveStylePlan([["padding", -1]], { supports })).toThrow();
});

test("snapshots supplied transitions and authored values into deeply immutable plans", () => {
  const values = { medium: 2 };
  const widths = { medium: 40 };
  const plan = createResponsiveStylePlan([["width", values]], { supports, breakpoints: widths });
  values.medium = 4;
  widths.medium = 45;
  expect(plan[0].range).toEqual({ min: 40 });
  expect(plan[0].declarations[0].value).toBe("var(--acme-size-2)");
  for (const value of [plan, plan[0], plan[0].range, plan[0].declarations, plan[0].declarations[0]]) {
    expect(Object.isFrozen(value)).toBe(true);
  }
});
