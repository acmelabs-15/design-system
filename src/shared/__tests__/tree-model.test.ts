import { expect, test } from "bun:test";
import { copyTreeNodes, treeEntries, visibleTreeEntries, treeKeys } from "../tree-model";

test("Tree owns immutable data with unique IDs and detects cycles", () => {
  const nodes = [{ id: "a", label: "Alpha", children: [{ id: "b", label: "Beta" }] }];
  const copy = copyTreeNodes(nodes);
  nodes[0].children[0].label = "Changed";
  expect(copy[0].children?.[0].label).toBe("Beta");
  expect(Object.isFrozen(copy[0].children)).toBe(true);
  expect(() =>
    copyTreeNodes([
      { id: "a", label: "A" },
      { id: "a", label: "Again" },
    ]),
  ).toThrow();
  const cyclic: any = { id: "a", label: "A" };
  cyclic.children = [cyclic];
  expect(() => copyTreeNodes([cyclic])).toThrow();
});
test("visible traversal requires every ancestor expanded and retains disabled discovery metadata", () => {
  const entries = treeEntries([
    { id: "a", label: "A", children: [{ id: "b", label: "B", disabled: true, children: [{ id: "c", label: "C" }] }] },
    { id: "d", label: "D" },
  ]);
  expect(visibleTreeEntries(entries, []).map((e) => e.node.id)).toEqual(["a", "d"]);
  expect(visibleTreeEntries(entries, ["a"]).map((e) => e.node.id)).toEqual(["a", "b", "d"]);
  expect(visibleTreeEntries(entries, ["a", "b"]).map((e) => e.node.id)).toEqual(["a", "b", "c", "d"]);
  expect(entries[2]).toMatchObject({ parent: "b", level: 3, position: 1, size: 1 });
  expect(treeKeys(["a", "a"])).toEqual(["a"]);
});
