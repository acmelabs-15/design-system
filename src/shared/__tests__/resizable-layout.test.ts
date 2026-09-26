import { expect, test } from "bun:test";
import { resolveLayout, resizePair, togglePane, handleRange, type Pane, type Layout } from "../resizable-layout";

const panels: Pane[] = [
  { value: "a", minSize: 10, maxSize: 90, collapsible: true, collapsedSize: 0 },
  { value: "b", minSize: 10, maxSize: 100 },
];
test("default shares and constrained normalization total exactly one hundred", () => {
  expect(resolveLayout(panels).sizes).toEqual({ a: 50, b: 50 });
  expect(resolveLayout([{ ...panels[0], minSize: 60 }, panels[1]], [20, 80]).sizes).toEqual({ a: 60, b: 40 });
});
test("duplicate identities and impossible bounds fail before allocation", () => {
  expect(() => resolveLayout([panels[0], panels[0]])).toThrow();
  expect(() => resolveLayout(panels.map((p) => ({ ...p, minSize: 60 })))).toThrow();
  expect(() => resolveLayout(panels, [0, 0])).toThrow();
});
test("collapse and reopen use the same saved size, clamped to changed bounds", () => {
  let layout = resolveLayout(panels, [30, 70]);
  layout = togglePane(panels, layout, "a", true);
  expect(layout.sizes).toEqual({ a: 0, b: 100 });
  expect(layout.previousSizes.a).toBe(30);
  expect(togglePane(panels, layout, "a", false).sizes).toEqual({ a: 30, b: 70 });
  expect(togglePane([{ ...panels[0], minSize: 40 }, panels[1]], layout, "a", false).sizes).toEqual({ a: 40, b: 60 });
});
test("each handle changes its adjacent pair and reports the matching range", () => {
  const three: Pane[] = [{ value: "a" }, { value: "b", minSize: 10, maxSize: 35 }, { value: "c", minSize: 20 }];
  const layout = resolveLayout(three, [30, 30, 40]);
  const next = resizePair(three, layout, 1, 20);
  expect(next.sizes).toEqual({ a: 30, b: 35, c: 35 });
  expect(handleRange(three, next, 1)).toEqual({ min: 10, max: 35, now: 35 });
});
test("a collapsed pane outside the pair keeps its state and allocation", () => {
  const three = [...panels, { value: "c", collapsible: true, collapsedSize: 0 }];
  const layout = resolveLayout(three, [40, 60, 0], { sizes: { a: 40, b: 60, c: 0 }, collapsed: ["c"], previousSizes: { c: 20 } });
  const next = resizePair(three, layout, 0, 10);
  expect(next.sizes).toEqual({ a: 50, b: 50, c: 0 });
  expect(next.collapsed).toEqual(["c"]);
  expect(next.previousSizes.c).toBe(20);
});
test("growing a collapsed adjacent pane restores its saved size", () => {
  const layout = togglePane(panels, resolveLayout(panels, [30, 70]), "a", true);
  expect(resizePair(panels, layout, 0, 1).sizes).toEqual({ a: 30, b: 70 });
});
test("collapse during a gesture remembers the last committed open size", () => {
  const p = [{ ...panels[0], minSize: 20 }, panels[1]];
  const initial = resolveLayout(p, [40, 60]);
  const smaller = resizePair(p, initial, 0, -20, initial);
  const closed = resizePair(p, smaller, 0, -15, initial);
  expect(closed.collapsed).toEqual(["a"]);
  expect(closed.previousSizes.a).toBe(40);
});
test("keyed snapshots survive reordering and cannot be changed by callers", () => {
  const layout = resolveLayout(panels, [30, 70]);
  const reordered = resolveLayout([...panels].reverse(), undefined, layout);
  expect(reordered.sizes).toEqual({ a: 30, b: 70 });
  expect(Object.isFrozen(reordered.sizes)).toBe(true);
  expect(Object.isFrozen(reordered.collapsed)).toBe(true);
});
test("bounded allocation and pair resizing remain finite across deterministic inputs", () => {
  let seed = 42;
  const random = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32;
  for (let sample = 0; sample < 200; sample++) {
    const panes: Pane[] = Array.from({ length: 4 }, (_, i) => ({ value: String(i), minSize: random() * 10, maxSize: 40 + random() * 50 }));
    let layout = resolveLayout(
      panes,
      panes.map(() => 1 + random() * 90),
    );
    for (let step = 0; step < 10; step++) {
      layout = resizePair(panes, layout, Math.floor(random() * 3), random() * 120 - 60);
      expect(Object.values(layout.sizes).reduce((a, b) => a + b, 0)).toBeCloseTo(100, 7);
      for (const p of panes) {
        expect(Number.isFinite(layout.sizes[p.value])).toBe(true);
        expect(layout.sizes[p.value]).toBeGreaterThanOrEqual(p.minSize! - 1e-8);
        expect(layout.sizes[p.value]).toBeLessThanOrEqual(p.maxSize! + 1e-8);
      }
    }
  }
});
test("an accessible handle range includes reopening a collapsed primary pane", () => {
  const layout = togglePane(panels, resolveLayout(panels, [30, 70]), "a", true);
  expect(handleRange(panels, layout, 0)).toEqual({ min: 0, max: 90, now: 0 });
});
test("an initially collapsed pane retains its configured open share for restoration", () => {
  const initial = resolveLayout(panels, [30, 70], { sizes: {}, collapsed: ["a"], previousSizes: {} });
  expect(initial.sizes.a).toBe(0);
  expect(initial.previousSizes.a).toBe(30);
  expect(togglePane(panels, initial, "a", false).sizes.a).toBe(30);
});
