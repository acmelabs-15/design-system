import { expect, test } from "bun:test";
import "../../../define/toc";
test("TOC defaults and explicit empty entries remain distinct from discovery", () => {
  const toc = document.createElement("acme-toc");
  expect(toc.levels).toEqual([2, 3]);
  expect(toc.variant).toBe("line");
  expect(toc.offset).toBe("0px");
  expect(toc.items).toBeUndefined();
  toc.items = [];
  expect(toc.items).toEqual([]);
  toc.items = undefined;
  expect(toc.items).toBeUndefined();
  expect(() => {
    toc.levels = [0];
  }).toThrow();
});
