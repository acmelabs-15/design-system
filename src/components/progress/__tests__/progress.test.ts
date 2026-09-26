import { expect, test } from "bun:test";
import "../../../define/progress";

test("Progress preserves absent values and restores default maximum on attribute removal", () => {
  const progress = document.createElement("acme-progress");
  expect(progress.value).toBeUndefined();
  expect(progress.max).toBe(100);
  expect(progress.variant).toBe("default");
  progress.setAttribute("value", "0");
  expect(progress.value).toBe(0);
  progress.removeAttribute("value");
  expect(progress.value).toBeUndefined();
  progress.setAttribute("max", "50");
  progress.removeAttribute("max");
  expect(progress.max).toBe(100);
  expect(() => {
    progress.shape = "circle" as never;
  }).toThrow();
});
