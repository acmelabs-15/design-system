import { expect, test } from "bun:test";
import "../../../define/drawer";
import "../../../define/drawer-trigger";
import "../../../define/drawer-close";
async function fixture() {
  document.body.innerHTML =
    '<acme-drawer><acme-drawer-trigger slot="trigger">Open details</acme-drawer-trigger><h2 slot="heading">Details</h2><input value="Retained"><acme-drawer-close slot="footer">Close details</acme-drawer-close></acme-drawer>';
  const root = document.querySelector("acme-drawer")!;
  for (let i = 0; i < 3; i++) await Promise.all([root, ...root.querySelectorAll("*")].map((el) => (el as any).updateComplete));
  return root;
}
test("Drawer uses logical placement and an optional authored CSS size", async () => {
  const root = await fixture();
  expect(root.placement).toBe("end");
  expect(root.modal).toBe(true);
  expect(root.size).toBeUndefined();
  root.size = "20rem";
  root.placement = "bottom";
  await root.updateComplete;
  expect(root.size).toBe("20rem");
  expect(root.placement).toBe("bottom");
  root.size = undefined;
  expect(root.size).toBeUndefined();
  expect(() => {
    root.placement = "left" as any;
  }).toThrow();
  root.remove();
});
test("Drawer preserves author content and uses one cancelable dismissal path", async () => {
  const root = await fixture(),
    input = root.querySelector("input");
  const changes: unknown[] = [];
  root.addEventListener("acme-open-change", (event) => changes.push((event as CustomEvent).detail));
  root.querySelector("acme-drawer-trigger")!.click();
  await root.updateComplete;
  expect(root.open).toBe(true);
  root.placement = "start";
  await root.updateComplete;
  expect(root.querySelector("input")).toBe(input);
  root.addEventListener("acme-request", (event) => event.preventDefault(), { once: true });
  root.querySelector("acme-drawer-close")!.click();
  expect(root.open).toBe(true);
  root.querySelector("acme-drawer-close")!.click();
  expect(root.open).toBe(false);
  expect(changes).toEqual([
    { open: true, reason: "trigger" },
    { open: false, reason: "close-control" },
  ]);
  root.remove();
});
