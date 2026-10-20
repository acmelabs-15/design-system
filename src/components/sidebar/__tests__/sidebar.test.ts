import { expect, test } from "bun:test";
import "../../../define/sidebar";

test("Sidebar keeps independent desktop and mobile state with configured presentation defaults", () => {
  const sidebar = document.createElement("acme-sidebar");
  expect(sidebar.expanded).toBe(true);
  expect(sidebar.mobileOpen).toBe(false);
  expect(sidebar.collapsible).toBe(true);
  expect(sidebar.width).toBe("16rem");
  expect(sidebar.collapsedWidth).toBe("3rem");
  expect(sidebar.mobileBelow).toBe("medium");
  sidebar.expanded = false;
  sidebar.mobileOpen = true;
  expect(sidebar.expanded).toBe(false);
  expect(sidebar.mobileOpen).toBe(true);
  expect(() => {
    sidebar.mobileBelow = "unknown" as never;
  }).toThrow();
  expect(() => {
    sidebar.placement = "top" as never;
  }).toThrow();
});
