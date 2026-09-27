import { expect, test } from "bun:test";
import "../../../define/meter";

test("Meter keeps missing data distinct from zero and retains explicit native bounds", () => {
  const meter = document.createElement("acme-meter");
  expect(meter.value).toBeUndefined();
  expect(meter.min).toBe(0);
  expect(meter.max).toBe(100);
  expect(meter.size).toBe("small");
  meter.value = 0;
  expect(meter.value).toBe(0);
  meter.low = 20;
  meter.high = 80;
  meter.optimum = 50;
  expect(meter.low).toBe(20);
  meter.setAttribute("value", "1");
  meter.removeAttribute("value");
  expect(meter.value).toBeUndefined();
});
