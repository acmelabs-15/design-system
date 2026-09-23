import { expect, test } from "bun:test";
import "../../../define/tree-view";
test("Tree View keeps expansion independent from its single selected value", () => {
  const tree = document.createElement("acme-tree-view");
  tree.items = [{ id: "a", label: "A", children: [{ id: "b", label: "B" }] }];
  expect(tree.selection).toBe("single");
  expect(tree.value).toBeUndefined();
  tree.expand("a");
  expect(tree.expanded).toEqual(["a"]);
  tree.value = "b";
  tree.collapse("a");
  expect(tree.value).toBe("b");
  expect(tree.expanded).toEqual([]);
  tree.value = undefined;
  expect(tree.value).toBeUndefined();
  expect(() => {
    tree.items = [
      { id: "a", label: "A" },
      { id: "a", label: "Again" },
    ];
  }).toThrow();
});
