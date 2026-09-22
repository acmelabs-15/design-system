import { afterEach, expect, test } from "bun:test";
import "../../../all";
import type { AcmeButton } from "../button";
afterEach(() => document.body.replaceChildren());
const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const element = document.body.firstElementChild as AcmeButton;
  await element.updateComplete;
  return element;
};
const control = (element: AcmeButton) => element.shadowRoot!.querySelector("[part=root]") as HTMLButtonElement;
test("Button exposes the current action contract and native label", async () => {
  const button = await mount('<acme-button size="small" aria-label="Save project">Save</acme-button>');
  expect(control(button).localName).toBe("button");
  expect(control(button).type).toBe("button");
  expect(control(button).getAttribute("aria-label")).toBe("Save project");
  expect(button.size).toBe("small");
  expect(button.variant).toBe("default");
  expect("svgOnly" in button).toBe(false);
  expect("normal" in button).toBe(false);
  expect(control(button).querySelector(".label slot")).not.toBeNull();
});
test("loading suppresses activation while retaining a focusable native control", async () => {
  const button = await mount("<acme-button loading>Saving</acme-button>");
  let calls = 0;
  button.addEventListener("click", () => calls++);
  button.click();
  expect(calls).toBe(0);
  expect(control(button).disabled).toBe(false);
  expect(control(button).getAttribute("aria-busy")).toBe("true");
  expect(control(button).getAttribute("aria-disabled")).toBe("true");
  expect(control(button).querySelector("acme-spinner")).not.toBeNull();
  button.disabled = true;
  expect(control(button).disabled).toBe(true);
});
test("disabled links keep link semantics and suppress navigation", async () => {
  const button = await mount('<acme-button href="#target" disabled>Open</acme-button>');
  const link = control(button);
  expect(link.localName).toBe("a");
  expect(link.hasAttribute("href")).toBe(false);
  expect(link.getAttribute("role")).toBe("link");
  expect(link.getAttribute("tabindex")).toBe("-1");
  button.disabled = false;
  await button.updateComplete;
  expect(control(button).getAttribute("href")).toBe("#target");
});
test("author nodes stay owned by the author and affixes have explicit parts", async () => {
  const button = await mount('<acme-button><span slot="start">+</span>Save<span slot="end">→</span></acme-button>');
  const author = button.querySelector("[slot=start]");
  await button.updateComplete;
  expect(control(button).querySelector("[part=start] slot")?.getAttribute("name")).toBe("start");
  button.loading = true;
  await button.updateComplete;
  expect(button.querySelector("[slot=start]")).toBe(author);
  expect(control(button).querySelector("slot[name=start]")?.hasAttribute("hidden")).toBe(true);
});
