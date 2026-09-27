import { expect, test } from "bun:test";
import "../../../define/skeleton";

test("Skeleton owns loading and shape while author content stays in place", () => {
  const skeleton = document.createElement("acme-skeleton");
  expect(skeleton.loading).toBe(true);
  expect(skeleton.shape).toBe("rectangle");
  expect(skeleton.width).toBeUndefined();
  skeleton.innerHTML = '<input value="Retained">';
  const input = skeleton.firstElementChild;
  skeleton.loading = false;
  skeleton.width = "64px";
  skeleton.height = "64px";
  skeleton.shape = "circle";
  expect(skeleton.firstElementChild).toBe(input);
  skeleton.setAttribute("loading", "false");
  expect(skeleton.loading).toBe(false);
  skeleton.removeAttribute("loading");
  expect(skeleton.loading).toBe(true);
});
