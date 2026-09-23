import { expect, test } from "bun:test";
import "../../../define/accordion";
import "../../../define/accordion-item";
import "../../../define/accordion-trigger";
import "../../../define/accordion-content";
import "../../../define/collapsible";
import "../../../define/collapsible-trigger";
import "../../../define/collapsible-content";
const item = (value: string) =>
  `<acme-accordion-item value="${value}"><h3><acme-accordion-trigger>${value}</acme-accordion-trigger></h3><acme-accordion-content><input value="${value}"></acme-accordion-content></acme-accordion-item>`;
async function settle(root: Element) {
  await Promise.all([root, ...root.querySelectorAll("*")].map((el) => (el as any).updateComplete));
  await Promise.resolve();
  await Promise.all([root, ...root.querySelectorAll("*")].map((el) => (el as any).updateComplete));
}
test("Accordion owns expansion and noncollapsible single-mode interaction", async () => {
  document.body.innerHTML = `<acme-accordion>${item("a")}${item("b")}</acme-accordion>`;
  const root = document.querySelector("acme-accordion")!;
  await settle(root);
  const triggers = [...root.querySelectorAll("acme-accordion-trigger")];
  const changes: unknown[] = [];
  root.addEventListener("acme-expanded-change", (e) => changes.push((e as CustomEvent).detail.expanded));
  triggers[0].shadowRoot!.querySelector("button")!.click();
  await settle(root);
  expect(root.expanded).toEqual(["a"]);
  triggers[0].shadowRoot!.querySelector("button")!.click();
  expect(changes).toEqual([["a"]]);
  triggers[1].shadowRoot!.querySelector("button")!.click();
  expect(root.expanded).toEqual(["b"]);
  root.expanded = [];
  expect(changes).toEqual([["a"], ["b"]]);
});
test("multiple permits independent closing and copies external arrays", async () => {
  document.body.innerHTML = `<acme-accordion multiple>${item("a")}${item("b")}</acme-accordion>`;
  const root = document.querySelector("acme-accordion")!;
  const values = ["a", "b"];
  root.expanded = values;
  values.pop();
  await settle(root);
  expect(root.expanded).toEqual(["a", "b"]);
  root.querySelector("acme-accordion-trigger")!.shadowRoot!.querySelector("button")!.click();
  expect(root.expanded).toEqual(["b"]);
});
test("Collapsible has one boolean owner and a silent programmatic path", async () => {
  document.body.innerHTML = "<acme-collapsible><acme-collapsible-trigger>More</acme-collapsible-trigger><acme-collapsible-content>Details</acme-collapsible-content></acme-collapsible>";
  const root = document.querySelector("acme-collapsible")!;
  await settle(root);
  let changes = 0;
  root.addEventListener("acme-expanded-change", () => changes++);
  root.expanded = true;
  await settle(root);
  expect(changes).toBe(0);
  root.querySelector("acme-collapsible-trigger")!.shadowRoot!.querySelector("button")!.click();
  expect(root.expanded).toBe(false);
  expect(changes).toBe(1);
});
