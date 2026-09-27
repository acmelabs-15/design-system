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

test("Hover Card restores its own defaults after authored attributes are removed", async () => {
  const el = document.createElement("acme-hover-card");
  document.body.append(el);
  await el.updateComplete;
  for (const [attribute, property, value, expected] of [
    ["side", "side", "left", "bottom"],
    ["align", "align", "end", "start"],
    ["open-delay", "openDelay", "900", 600],
    ["close-delay", "closeDelay", "800", 300],
  ] as const) {
    el.setAttribute(attribute, value);
    await el.updateComplete;
    el.removeAttribute(attribute);
    await el.updateComplete;
    expect(el[property]).toBe(expected);
  }
  el.remove();
});
