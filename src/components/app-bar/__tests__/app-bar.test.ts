import { expect, test } from "bun:test";
import "../../../define/app-bar";
import "../../../define/app-bar-start";
import "../../../define/app-bar-content";
import "../../../define/app-bar-end";
test("App Bar has explicit parts and no implicit application controls", async () => {
  document.body.innerHTML =
    "<acme-app-bar><acme-app-bar-start>Brand</acme-app-bar-start><acme-app-bar-content>Page</acme-app-bar-content><acme-app-bar-end><button>Save</button></acme-app-bar-end></acme-app-bar>";
  const root = document.querySelector("acme-app-bar")!;
  await root.updateComplete;
  expect(root.placement).toBe("static");
  expect(root.querySelector("acme-theme-switcher")).toBeNull();
  expect(root.querySelector("acme-app-bar-start")!.slot).toBe("start");
  expect(root.querySelector("acme-app-bar-end")!.slot).toBe("end");
  const button = root.querySelector("button");
  root.placement = "sticky";
  root.size = "small";
  await root.updateComplete;
  expect(root.querySelector("button")).toBe(button);
});
test("a dialog App Bar does not become a page banner", async () => {
  document.body.innerHTML = "<dialog open><acme-app-bar>Dialog heading</acme-app-bar></dialog>";
  const root = document.querySelector("acme-app-bar")!;
  await root.updateComplete;
  expect(root.shadowRoot!.querySelector("header")!.getAttribute("role")).toBe("generic");
});
