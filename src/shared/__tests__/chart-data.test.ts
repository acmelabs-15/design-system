import { expect, test } from "bun:test";
import { chartPoints, snapshotChartData, snapshotChartSeries } from "../chart-data";

test("chart records preserve zero and missing values without numeric coercion", () => {
  const rows = snapshotChartData([
      { x: "A", value: 0 },
      { x: "B", value: null },
      { x: "C", value: Number.NaN },
    ]),
    series = snapshotChartSeries([{ key: "value", label: "Value" }]);
  const points = chartPoints(rows, "x", series);
  expect(points.kind).toBe("category");
  expect(points.values.map((point) => point.y)).toEqual([0, undefined, undefined]);
  expect(() => chartPoints(snapshotChartData([{ x: "A", value: "12" }]), "x", series)).toThrow();
});
test("series records validate identity and retain formatter functions", () => {
  const formatter = (value: number) => "$" + value;
  const source = [{ key: "revenue", label: "Revenue", formatter }];
  const series = snapshotChartSeries(source);
  source[0].label = "Changed";
  expect(series[0].label).toBe("Revenue");
  expect(series[0].formatter?.(0)).toBe("$0");
  expect(() =>
    snapshotChartSeries([
      { key: "a", label: "One" },
      { key: "a", label: "Two" },
    ]),
  ).toThrow();
});
test("numeric and date x values retain their semantic kind and source indices", () => {
  const date = new Date("2026-01-01T00:00:00Z");
  const rows = snapshotChartData([{ id: "a", x: date, y: 3 }]);
  date.setUTCFullYear(2000);
  const series = snapshotChartSeries([{ key: "y", label: "Amount" }]);
  const points = chartPoints(rows, "x", series);
  expect(points.kind).toBe("date");
  expect((points.values[0].x as Date).getUTCFullYear()).toBe(2026);
  expect(points.values[0].index).toBe(0);
  expect(chartPoints(snapshotChartData([{ x: 2, y: 3 }]), "x", series).kind).toBe("number");
  expect(() =>
    chartPoints(
      snapshotChartData([
        { x: 2, y: 3 },
        { x: "Category", y: 4 },
      ]),
      "x",
      series,
    ),
  ).toThrow();
});

import { createChartScene, type SceneNode } from "@tanstack/charts";
import { chartDefinition, formatChartX, formatChartY } from "../chart-definition";

test("the selected engine preserves line gaps and groups bar series beside each other", () => {
  const series = snapshotChartSeries([
    { key: "a", label: "First" },
    { key: "b", label: "Second" },
  ]);
  const definition = chartDefinition({
    data: snapshotChartData([
      { x: "One", a: 1, b: 2 },
      { x: "Two", a: 3, b: 4 },
    ]),
    series,
    x: "x",
    type: "bar",
    points: false,
    grid: true,
    tooltip: false,
  }).definition;
  if (!("marks" in definition)) {
    throw new Error("The fixture requires a static chart definition");
  }
  const scene = createChartScene(definition, { width: 500, height: 180 });
  expect(scene.points).toHaveLength(4);
  const first = scene.points.filter((point) => point.datum.index === 0);
  expect(first[0].x).not.toBe(first[1].x);
  const gap = chartDefinition({
    data: snapshotChartData([
      { x: 0, a: 1 },
      { x: 1, a: 2 },
      { x: 2, a: null },
      { x: 3, a: 4 },
      { x: 4, a: 5 },
    ]),
    series: series.slice(0, 1),
    x: "x",
    type: "line",
    points: false,
    grid: true,
    tooltip: false,
  });
  if (!("marks" in gap.definition)) {
    throw new Error("The fixture requires a static chart definition");
  }
  const result = createChartScene(gap.definition, { width: 500, height: 180 });
  expect(result.points).toHaveLength(4);
  const paths: SceneNode[] = [];
  const walk = (nodes: readonly SceneNode[]) => {
    for (const node of nodes) {
      if (node.kind === "polyline") {
        paths.push(node);
      }
      if (node.kind === "group") {
        walk(node.children);
      }
    }
  };
  walk(result.nodes);
  expect(paths).toHaveLength(2);
});

test("exact date values remain distinct within the same UTC day", () => {
  expect(formatChartX(new Date("2026-01-01T12:00:00Z"))).not.toBe(formatChartX(new Date("2026-01-01T13:00:00Z")));
});

test("default exact-value formatting preserves small finite values", () => {
  expect(formatChartY(0.0001, undefined, "en-US")).toBe("0.0001");
  expect(formatChartX(0.0002, "en-US")).toBe("0.0002");
});
