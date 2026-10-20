import { expect, test } from "bun:test";
import { flowArrow, roundedFlowPath, fitFlowViewport, zoomFlowViewport } from "../flow-geometry";

test("rounded paths preserve endpoints and keep tight obstacle corners sharp", () => {
  const points = [
    { x: 0, y: 0 },
    { x: 40, y: 0 },
    { x: 40, y: 40 },
  ];
  const smooth = roundedFlowPath(points, 8, []);
  expect(smooth).toContain("Q 40 0 40 8");
  expect(smooth.startsWith("M 0 0")).toBe(true);
  expect(smooth.endsWith("L 40 40")).toBe(true);
  const safe = roundedFlowPath(points, 8, [{ x: 33, y: 1, width: 6, height: 6 }]);
  expect(safe).not.toContain("Q");
  expect(safe).toContain("L 40 0");
});
test("fit respects bounds and point-anchored zoom keeps the same world coordinate", () => {
  expect(fitFlowViewport({ width: 400, height: 200 }, { width: 800, height: 400 }, 0.25, 2, 20).zoom).toBe(0.4);
  const next = zoomFlowViewport({ x: 20, y: 30, zoom: 1 }, 2, { x: 100, y: 100 });
  expect((100 - next.x) / next.zoom).toBe(80);
  expect((100 - next.y) / next.zoom).toBe(70);
});

test("fit rejects unusable limits and arrows stay within their terminal segment", () => {
  expect(() => fitFlowViewport({ width: 400, height: 200 }, { width: 800, height: 400 }, 2, 1, 20)).toThrow();
  expect(() => fitFlowViewport({ width: NaN, height: 200 }, { width: 800, height: 400 }, 0.25, 2, 20)).toThrow();
  expect(
    flowArrow(
      [
        { x: 0, y: 0 },
        { x: 2, y: 0 },
        { x: 2, y: 0 },
      ],
      6,
    ),
  ).toBe("M 2 0 L 1 0.5 L 1 -0.5 Z");
});
