import { afterEach, expect, test } from "bun:test";
import "../../../all";
import type { AcmeIconButton } from "../icon-button";
afterEach(() => document.body.replaceChildren());
test("Icon Button uses one named native control and its icon part", async () => {
  document.body.innerHTML = '<acme-icon-button aria-label="Close"><acme-close-icon></acme-close-icon></acme-icon-button>';
  const button = document.body.firstElementChild as AcmeIconButton;
  await button.updateComplete;
  expect(button.shape).toBe("square");
  expect(button.shadowRoot!.querySelector("button")?.getAttribute("aria-label")).toBe("Close");
  expect(button.shadowRoot!.querySelector("[part=icon] slot")).not.toBeNull();
  expect(button.shadowRoot!.querySelector("slot[name=start]")).toBeNull();
});
