import { expect, test } from "bun:test";
import "../../../define/tooltip";

test("Tooltip defaults keep short noninteractive help and explicit delays", () => {
  const el = document.createElement("acme-tooltip");
  expect(el.content).toBe("");
  expect(el.open).toBe(false);
  expect(el.side).toBe("top");
  expect(el.align).toBe("center");
  expect(el.openDelay).toBe(0);
  expect(el.closeDelay).toBe(100);
  expect(el.sideOffset).toBe(4);
  el.open = true;
  el.disabled = true;
  expect(el.open).toBe(false);
  expect(() => {
    el.openDelay = -1;
  }).toThrow();
});
test("removing content restores the documented empty string", () => {
  const tooltip = document.createElement("acme-tooltip");
  tooltip.setAttribute("content", "Help");
  tooltip.removeAttribute("content");
  expect(tooltip.content).toBe("");
});
