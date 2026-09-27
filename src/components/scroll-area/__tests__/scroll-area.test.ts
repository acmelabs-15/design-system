import { expect, test } from "bun:test";
import "../../../define/scroll-area";
import "../../../define/scroll-viewport";
import "../../../define/scroll-button";

test("Scroll Area exposes its native viewport and preserves author content", async () => {
  document.body.innerHTML = "<acme-scroll-area><acme-scroll-viewport><button>Content</button></acme-scroll-viewport></acme-scroll-area>";
  const root = document.querySelector("acme-scroll-area")!,
    part = root.querySelector("acme-scroll-viewport")!,
    button = part.querySelector("button");
  await root.updateComplete;
  await part.updateComplete;
  expect(root.getViewport().localName).toBe("div");
  expect(root.getViewport()).not.toBe(part);
  root.orientation = "vertical";
  root.size = "large";
  await root.updateComplete;
  expect(part.querySelector("button")).toBe(button);
  expect(button!.parentElement).toBe(part);
});
test("Scroll Area reports a missing viewport instead of keeping an obsolete owner", async () => {
  document.body.innerHTML = "<acme-scroll-area><acme-scroll-viewport>Content</acme-scroll-viewport></acme-scroll-area>";
  const root = document.querySelector("acme-scroll-area")!;
  await root.updateComplete;
  root.querySelector("acme-scroll-viewport")!.remove();
  expect(() => root.getViewport()).toThrow("Scroll Viewport");
});
test("Scroll Button restores an omitted step and rejects unsupported CSS values", async () => {
  const button = document.createElement("acme-scroll-button");
  button.setAttribute("step", "40px");
  expect(button.step).toBe("40px");
  button.removeAttribute("step");
  expect(button.step).toBeUndefined();
  expect(() => {
    button.step = "auto";
  }).toThrow();
});
test("clearing named settings restores defaults and rejects unknown values", () => {
  const root = document.createElement("acme-scroll-area");
  root.orientation = "vertical";
  root.orientation = undefined;
  root.size = "large";
  root.size = undefined;
  root.scrollbarVisibility = "always";
  root.scrollbarVisibility = undefined;
  expect(root.orientation).toBe("both");
  expect(root.size).toBe("medium");
  expect(root.scrollbarVisibility).toBe("hover");
  expect(() => {
    root.orientation = "diagonal" as any;
  }).toThrow();
});
