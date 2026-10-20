import { expect, test } from "bun:test";
import "../../../define/dialog";
import "../../../define/dialog-trigger";
import "../../../define/dialog-close";
import "../../../define/alert-dialog";
import "../../../define/alert-dialog-trigger";
import "../../../define/alert-dialog-action";
import "../../../define/alert-dialog-cancel";

async function settle(root: Element) {
  for (let i = 0; i < 3; i++) {
    await Promise.all([root, ...root.querySelectorAll("*")].map((el) => (el as any).updateComplete));
  }
}
test("Dialog has one user-state event and cancelable close requests", async () => {
  document.body.innerHTML =
    '<acme-dialog><acme-dialog-trigger slot="trigger">Edit</acme-dialog-trigger><h2 slot="heading">Edit profile</h2><input value="Retained"><acme-dialog-close slot="footer">Close</acme-dialog-close></acme-dialog>';
  const dialog = document.querySelector("acme-dialog")!;
  await settle(dialog);
  const changes: unknown[] = [];
  dialog.addEventListener("acme-open-change", (event) => changes.push((event as CustomEvent).detail));
  dialog.querySelector("acme-dialog-trigger")!.click();
  expect(dialog.open).toBe(true);
  await settle(dialog);
  dialog.addEventListener("acme-request", (event) => event.preventDefault(), { once: true });
  dialog.querySelector("acme-dialog-close")!.click();
  expect(dialog.open).toBe(true);
  dialog.querySelector("acme-dialog-close")!.click();
  expect(dialog.open).toBe(false);
  expect(changes).toEqual([
    { open: true, reason: "trigger" },
    { open: false, reason: "close-control" },
  ]);
  dialog.open = true;
  expect(changes).toHaveLength(2);
  dialog.remove();
});
test("Alert Dialog action is application-owned and cancel closes through the shared path", async () => {
  document.body.innerHTML =
    '<acme-alert-dialog><acme-alert-dialog-trigger slot="trigger">Delete</acme-alert-dialog-trigger><h2 slot="heading">Delete project?</h2><p slot="description">This removes the project.</p><acme-alert-dialog-action slot="footer">Delete project</acme-alert-dialog-action><acme-alert-dialog-cancel slot="footer">Cancel</acme-alert-dialog-cancel></acme-alert-dialog>';
  const dialog = document.querySelector("acme-alert-dialog")!;
  await settle(dialog);
  expect(dialog.modal).toBe(true);
  expect(dialog.closeOnOutside).toBe(false);
  dialog.querySelector("acme-alert-dialog-trigger")!.click();
  await settle(dialog);
  dialog.querySelector("acme-alert-dialog-action")!.click();
  expect(dialog.open).toBe(true);
  dialog.querySelector("acme-alert-dialog-cancel")!.click();
  expect(dialog.open).toBe(false);
  dialog.remove();
});
