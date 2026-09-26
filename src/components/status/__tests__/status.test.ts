import { expect, test } from "bun:test";
import "../../../define/status";

test("Status preserves application values and does not infer a deployment treatment", () => {
  const status = document.createElement("acme-status");
  status.value = "READY";
  expect(status.value).toBe("READY");
  expect(status.variant).toBe("neutral");
  expect(status.pulse).toBe(false);
  status.label = "Ready to use";
  expect(status.label).toBe("Ready to use");
  expect(() => {
    status.variant = "ready" as never;
  }).toThrow();
});
test("removing a required status value attribute restores its empty string default", () => {
  const status = document.createElement("acme-status");
  status.setAttribute("value", "ready");
  status.removeAttribute("value");
  expect(status.value).toBe("");
});
