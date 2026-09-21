import { afterEach, expect, test } from "bun:test";
import "../../../all";
import type { AcmeGrid } from "../grid";
import type { AcmeSimpleGrid } from "../../simple-grid/simple-grid";
afterEach(() => document.body.replaceChildren());
test("Grid exposes tracks and preserves author nodes through semantic changes", async () => {
  document.body.innerHTML = '<acme-grid as="main"><article>One</article><article>Two</article></acme-grid>';
  const grid = document.querySelector("acme-grid") as AcmeGrid,
    child = grid.firstChild;
  await grid.updateComplete;
  grid.gridTemplateColumns = { compact: "1fr", expanded: "100px 1fr" };
  grid.as = "section";
  await grid.updateComplete;
  expect(grid.gridTemplateColumns).toEqual({ compact: "1fr", expanded: "100px 1fr" });
  expect(grid.firstChild).toBe(child);
  expect(grid.shadowRoot!.querySelector('[part="root"]')?.localName).toBe("section");
  expect("columns" in grid).toBe(false);
  expect("rows" in grid).toBe(false);
  expect("hideGuides" in grid).toBe(false);
});
test("Simple Grid counts and minima remain canonical authored values", async () => {
  document.body.innerHTML = '<acme-simple-grid columns="3"></acme-simple-grid>';
  const grid = document.querySelector("acme-simple-grid") as AcmeSimpleGrid;
  await grid.updateComplete;
  expect(grid.columns).toBe(3);
  expect(grid.minChildWidth).toBeUndefined();
  expect("gridTemplateColumns" in grid).toBe(false);
  grid.minChildWidth = [undefined, 0, "12rem"];
  expect(grid.minChildWidth).toEqual([undefined, 0, "12rem"]);
  expect(Object.isFrozen(grid.minChildWidth)).toBe(true);
  grid.removeAttribute("columns");
  expect(grid.columns).toBeUndefined();
  expect(grid.minChildWidth).toEqual([undefined, 0, "12rem"]);
  expect(() => {
    grid.columns = 0;
  }).toThrow();
  expect(() => {
    grid.columns = 1.5;
  }).toThrow();
  expect(() => {
    grid.minChildWidth = -1;
  }).toThrow();
});
