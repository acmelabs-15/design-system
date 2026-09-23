import { expect, test } from "bun:test";
import { rankCommands } from "../command-ranking";
const item = (value: string, label: string, group?: object) => ({ value, label, keywords: [] as readonly string[], disabled: false, group });
test("command ranking preserves group boundaries and scores visible labels with keywords", () => {
  const group = {};
  const items = [item("id-1", "Create project", group), { ...item("id-2", "Open project", group), keywords: ["workspace"] }, item("id-3", "Open settings")];
  const ranked = rankCommands(items, "workspace");
  expect(ranked).toEqual([items[1]]);
  expect(rankCommands(items, "")).toEqual(items);
});
test("custom scores determine order within groups and group order without mutating input", () => {
  const first = {},
    second = {};
  const items = [item("a", "Alpha", first), item("b", "Beta", first), item("c", "Gamma", second)];
  const scores = { a: 1, b: 3, c: 2 };
  const ranked = rankCommands(items, "x", (value) => scores[value as keyof typeof scores]);
  expect(ranked.map((item) => item.value)).toEqual(["b", "a", "c"]);
  expect(items.map((item) => item.value)).toEqual(["a", "b", "c"]);
  expect(() => rankCommands(items, "x", () => NaN)).toThrow();
});
