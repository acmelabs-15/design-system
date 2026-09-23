import { expect, test } from "bun:test";
import { toolbarKeyboardOwner } from "../keyboard-delegation";
test("a popup inside a Toolbar keeps its own keyboard collection boundary", () => {
  const toolbar = document.createElement("div");
  toolbar.setAttribute("role", "toolbar");
  const popup = document.createElement("div");
  popup.setAttribute("popover", "manual");
  const collection = document.createElement("div");
  popup.append(collection);
  toolbar.append(popup);
  document.body.append(toolbar);
  expect(toolbarKeyboardOwner(collection)).toBeUndefined();
  popup.removeAttribute("popover");
  expect(toolbarKeyboardOwner(collection)).toBe(toolbar);
  toolbar.remove();
});
