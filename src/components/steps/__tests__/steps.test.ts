import { expect, test } from "bun:test";
import "../../../define/steps";
import "../../../define/step";
import "../../../define/step-trigger";
import "../../../define/step-content";
import "../../../define/steps-next";
import "../../../define/steps-previous";

async function fixture(linear = false) {
  document.body.innerHTML = `<acme-steps aria-label="Setup" ${linear ? "linear" : ""}><acme-step value="account"><acme-step-trigger>Account</acme-step-trigger></acme-step><acme-step value="confirm"><acme-step-trigger>Confirm</acme-step-trigger></acme-step><acme-step-content slot="panels" value="account"><input value="Retained"></acme-step-content><acme-step-content slot="panels" value="confirm">Confirmation</acme-step-content><span slot="completed">Done</span><acme-steps-previous slot="actions"></acme-steps-previous><acme-steps-next slot="actions"></acme-steps-next></acme-steps>`;
  const root = document.querySelector("acme-steps")!;
  for (let i = 0; i < 3; i++) {
    await Promise.all([root, ...root.querySelectorAll("*")].map((el) => (el as any).updateComplete));
  }
  return root;
}
test("Steps validates a user transition before changing the canonical value", async () => {
  const root = await fixture();
  const changes: unknown[] = [];
  const cancel = (e: Event) => e.preventDefault();
  root.addEventListener("acme-change", (e) => changes.push((e as CustomEvent).detail));
  root.addEventListener("acme-request", cancel);
  root.querySelector("acme-steps-next")!.click();
  expect(root.value).toBe(0);
  expect(changes).toEqual([]);
  root.removeEventListener("acme-request", cancel);
  root.querySelector("acme-steps-next")!.click();
  expect(root.value).toBe(1);
  expect(changes).toEqual([{ value: 1 }]);
  root.value = 0;
  expect(changes).toHaveLength(1);
});
test("Steps exposes completion explicitly at the count and supports returning", async () => {
  const root = await fixture();
  const input = root.querySelector("input");
  root.querySelector("acme-steps-next")!.click();
  root.querySelector("acme-steps-next")!.click();
  expect(root.value).toBe(2);
  expect(root.completed).toBe(true);
  root.querySelector("acme-steps-previous")!.click();
  expect(root.value).toBe(1);
  expect(root.completed).toBe(false);
  expect(root.querySelector("input")).toBe(input);
});
test("linear Steps blocks direct trigger jumps while previous and next remain available", async () => {
  const root = await fixture(true);
  root.querySelectorAll("acme-step-trigger")[1].click();
  expect(root.value).toBe(0);
  root.querySelector("acme-steps-next")!.click();
  expect(root.value).toBe(1);
});
