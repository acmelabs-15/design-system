import { expect, test } from "bun:test";
import "../../../define/toggle-tip";
test("Toggle Tip keeps explicit visibility and independent dismissal flags", () => {
  const el = document.createElement("acme-toggle-tip");
  expect(el.open).toBe(false);
  expect(el.side).toBe("bottom");
  expect(el.align).toBe("start");
  expect(el.closeOnEscape).toBe(true);
  expect(el.closeOnOutside).toBe(true);
  el.open = true;
  el.closeOnEscape = false;
  expect(el.open).toBe(true);
  expect(el.closeOnOutside).toBe(true);
});
