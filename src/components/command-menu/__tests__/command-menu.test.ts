import { expect, test } from "bun:test";
import "../../../define/command-menu";
import "../../../define/command-item";
import "../../../define/command-group";
import "../../../define/command-separator";

async function fixture() {
  document.body.innerHTML =
    '<acme-command-menu heading="Commands"><acme-command-group heading="Projects"><acme-command-item value="create">Create project</acme-command-item><acme-command-item value="open">Open project</acme-command-item></acme-command-group><acme-command-separator></acme-command-separator><acme-command-item value="settings">Settings</acme-command-item></acme-command-menu>';
  const root = document.querySelector("acme-command-menu")!;
  for (let i = 0; i < 4; i++) {
    await Promise.all([root, ...root.querySelectorAll("*")].map((el) => (el as any).updateComplete));
  }
  return root;
}
test("query and keywords filter retained author nodes without reordering them", async () => {
  const root = await fixture(),
    group = root.querySelector("acme-command-group")!,
    items = [...group.children];
  const open = root.querySelectorAll("acme-command-item")[1];
  open.keywords = ["workspace"];
  root.query = "workspace";
  await root.updateComplete;
  await group.updateComplete;
  expect([...group.children]).toEqual(items);
  expect(group.shadowRoot!.querySelector<HTMLSlotElement>("slot[data-item]")!.assignedElements()).toEqual([open]);
  root.query = "";
  await root.updateComplete;
  await group.updateComplete;
  expect([...group.children]).toEqual(items);
  root.remove();
});
test("selection requests carry identifiers and can keep the menu open", async () => {
  const root = await fixture();
  root.show();
  await root.updateComplete;
  const item = root.querySelector("acme-command-item")!;
  let detail: unknown;
  const cancel = (event: Event) => {
    detail = (event as CustomEvent).detail;
    event.preventDefault();
  };
  root.addEventListener("acme-request", cancel);
  item.click();
  expect(detail).toEqual({ action: "select", value: "create" });
  expect(root.open).toBe(true);
  root.removeEventListener("acme-request", cancel);
  item.click();
  expect(root.open).toBe(false);
  root.remove();
});
test("disabled actions do not request selection and hotkeys are opt-in", async () => {
  const root = await fixture();
  expect(root.hotkey).toBeUndefined();
  root.show();
  await root.updateComplete;
  const item = root.querySelector("acme-command-item")!;
  item.disabled = true;
  let requests = 0;
  root.addEventListener("acme-request", () => requests++);
  item.click();
  expect(requests).toBe(0);
  expect(root.open).toBe(true);
  root.remove();
});
