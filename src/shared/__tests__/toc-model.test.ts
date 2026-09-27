import { expect, test } from "bun:test";
import { copyTocItems, selectTocCurrent } from "../toc-model";

test("TOC owns immutable explicit entries and rejects ambiguous identities", () => {
  const items = [{ id: "intro", href: "#intro", label: "Introduction", level: 2 }];
  const copy = copyTocItems(items)!;
  items[0].label = "Changed";
  expect(copy[0].label).toBe("Introduction");
  expect(Object.isFrozen(copy[0])).toBe(true);
  expect(() => copyTocItems([copy[0], copy[0]])).toThrow();
  expect(copyTocItems(undefined)).toBeUndefined();
  expect(copyTocItems([])).toEqual([]);
});
test("TOC current section follows the last crossed heading and the final visible section", () => {
  const entries = [
    { id: "a", top: -50 },
    { id: "b", top: 40 },
    { id: "c", top: 150 },
  ];
  expect(selectTocCurrent(entries, 60, false)).toBe("b");
  expect(selectTocCurrent(entries, 0, false)).toBe("a");
  expect(selectTocCurrent(entries, 0, true)).toBe("c");
  expect(selectTocCurrent([], 0, false)).toBeUndefined();
});
