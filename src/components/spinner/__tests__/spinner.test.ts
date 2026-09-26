import { afterEach, expect, test } from "bun:test";
import "../../../all";
import type { AcmeSpinner } from "../spinner";

afterEach(() => document.body.replaceChildren());
const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const element = document.body.firstElementChild as AcmeSpinner;
  await element.updateComplete;
  return element;
};
test("an unnamed Spinner is decorative and uses the medium role", async () => {
  const element = await mount("<acme-spinner></acme-spinner>");
  const root = element.shadowRoot!.querySelector("[part=root]")!;
  expect(element.size).toBe("medium");
  expect(root.getAttribute("aria-hidden")).toBe("true");
  expect(root.hasAttribute("role")).toBe(false);
  expect(root.querySelectorAll(".blade:not([hidden])")).toHaveLength(10);
});
test("one label supplies the status name and message", async () => {
  const element = await mount('<acme-spinner label="Loading projects"></acme-spinner>');
  const root = element.shadowRoot!.querySelector("[part=root]")!;
  expect(root.getAttribute("role")).toBe("status");
  expect(root.getAttribute("aria-labelledby")).toBe("status-label");
  expect(root.getAttribute("aria-atomic")).toBe("true");
  expect(root.hasAttribute("aria-hidden")).toBe(false);
  expect(root.textContent?.trim()).toBe("Loading projects");
});
test("full size names select the retained blade geometry", async () => {
  for (const [size, count] of [
    ["small", 8],
    ["medium", 10],
    ["large", 12],
    ["extraLarge", 12],
    ["extraExtraLarge", 15],
  ] as const) {
    const element = await mount(`<acme-spinner size="${size}"></acme-spinner>`);
    expect(element.shadowRoot!.querySelectorAll(".blade:not([hidden])")).toHaveLength(count);
    expect(element.shadowRoot!.querySelector(".blade")!.hasAttribute("style")).toBe(false);
  }
});
