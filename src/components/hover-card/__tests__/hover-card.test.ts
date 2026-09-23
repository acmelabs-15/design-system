import { expect, test } from "bun:test";
import "../../../define/hover-card";
test("Hover Card uses the approved preview placement and delays", () => {
  const el = document.createElement("acme-hover-card");
  expect(el.side).toBe("bottom");
  expect(el.align).toBe("start");
  expect(el.openDelay).toBe(600);
  expect(el.closeDelay).toBe(300);
  expect(el.open).toBe(false);
});
