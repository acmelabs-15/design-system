import { expect, test } from "bun:test";
import "../../../define/breadcrumbs";
import "../../../define/breadcrumb";

async function fixture() {
  document.body.innerHTML =
    '<acme-breadcrumbs><acme-breadcrumb href="/">Home</acme-breadcrumb><acme-breadcrumb href="/private" disabled>Private</acme-breadcrumb><acme-breadcrumb current>Page</acme-breadcrumb></acme-breadcrumbs>';
  const root = document.querySelector("acme-breadcrumbs")!;
  for (let i = 0; i < 3; i++) {
    await Promise.all([root, ...root.querySelectorAll("acme-breadcrumb")].map((el) => el.updateComplete));
  }
  return root;
}
test("Breadcrumbs supplies native ordered navigation and page meaning", async () => {
  const root = await fixture();
  expect(root.shadowRoot!.querySelector("nav")!.getAttribute("aria-label")).toBe("Breadcrumb");
  expect(root.shadowRoot!.querySelector("ol")).not.toBeNull();
  const current = root.querySelectorAll("acme-breadcrumb")[2];
  expect(current.shadowRoot!.querySelector("[aria-current=page]")).not.toBeNull();
  expect(current.shadowRoot!.querySelector("li")).not.toBeNull();
});
test("a disabled breadcrumb never retains a navigable href", async () => {
  const root = await fixture();
  const crumb = root.querySelectorAll("acme-breadcrumb")[1];
  expect(crumb.shadowRoot!.querySelector("a")!.hasAttribute("href")).toBe(false);
  expect(crumb.shadowRoot!.querySelector("a")!.getAttribute("aria-disabled")).toBe("true");
  crumb.disabled = false;
  await crumb.updateComplete;
  expect(crumb.shadowRoot!.querySelector("a")!.getAttribute("href")).toBe("/private");
});
test("the last separator follows dynamic membership", async () => {
  const root = await fixture();
  const crumbs = [...root.querySelectorAll("acme-breadcrumb")];
  expect(crumbs[2].shadowRoot!.querySelector<HTMLElement>("[part=separator]")!.hidden).toBe(true);
  crumbs[2].remove();
  await root.updateComplete;
  await crumbs[1].updateComplete;
  expect(crumbs[1].shadowRoot!.querySelector<HTMLElement>("[part=separator]")!.hidden).toBe(true);
});
