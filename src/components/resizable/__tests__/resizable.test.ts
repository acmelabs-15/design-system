import { expect, test } from "bun:test";
import "../../../define/resizable";
import "../../../define/resizable-panel";
import "../../../define/resize-handle";

const markup =
  '<acme-resizable sizes="[30,70]"><acme-resizable-panel value="navigation" min-size="10" collapsible><input value="Retained"></acme-resizable-panel><acme-resize-handle aria-label="Navigation"></acme-resize-handle><acme-resizable-panel value="content" min-size="10">Content</acme-resizable-panel></acme-resizable>';
async function mount() {
  document.body.innerHTML = markup;
  const root = document.querySelector("acme-resizable")!;
  await root.updateComplete;
  await Promise.all([...root.children].map((el) => (el as any).updateComplete));
  await root.updateComplete;
  return root;
}
test("Resizable owns frozen keyed shares while preserving author content", async () => {
  const root = await mount(),
    input = root.querySelector("input");
  expect(root.sizes).toEqual([30, 70]);
  expect(root.getLayout().sizes).toEqual({ navigation: 30, content: 70 });
  expect(Object.isFrozen(root.getLayout().sizes)).toBe(true);
  root.sizes = [40, 60];
  expect(root.sizes).toEqual([40, 60]);
  await root.updateComplete;
  expect(root.querySelector("input")).toBe(input);
});
test("programmatic collapse and restore stay silent and retain content", async () => {
  const root = await mount();
  let changes = 0;
  root.addEventListener("acme-change", () => changes++);
  root.collapse("navigation");
  await root.updateComplete;
  const panel = root.querySelector("acme-resizable-panel")!;
  await panel.updateComplete;
  expect(panel.collapsed).toBe(true);
  expect(panel.shadowRoot!.querySelector("[part~=panel]")!.hasAttribute("inert")).toBe(true);
  expect(root.getLayout().previousSizes.navigation).toBe(30);
  root.expand("navigation");
  await root.updateComplete;
  expect(root.sizes).toEqual([30, 70]);
  expect(changes).toBe(0);
  expect(root.querySelector("input")!.value).toBe("Retained");
});
test("restoration copies complete preferences instead of retaining caller records", async () => {
  const root = await mount();
  const layout = { sizes: { navigation: 20, content: 80 }, collapsed: [] as string[], previousSizes: { navigation: 25 } };
  root.setLayout(layout);
  layout.sizes.navigation = 80;
  layout.previousSizes.navigation = 90;
  expect(root.sizes).toEqual([20, 80]);
  expect(root.getLayout().previousSizes.navigation).toBe(25);
});
test("sizes can be supplied before composition connects", async () => {
  const root = document.createElement("acme-resizable");
  root.sizes = [35, 65];
  root.innerHTML = '<acme-resizable-panel value="a">A</acme-resizable-panel><acme-resize-handle></acme-resize-handle><acme-resizable-panel value="b">B</acme-resizable-panel>';
  document.body.append(root);
  await root.updateComplete;
  expect(root.sizes).toEqual([35, 65]);
});
