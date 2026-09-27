import { afterEach, expect, test } from "bun:test";
import "../../../all";
import { registerTheme } from "../../../shared/theme-registry";
import type { AcmeTheme } from "../theme";

afterEach(() => document.body.replaceChildren());
async function settled(...elements: AcmeTheme[]) {
  await Promise.resolve();
  await Promise.all(elements.map((element) => element.updateComplete));
  await Promise.resolve();
}

test("nested settings inherit, explicit defaults override, and removal resumes inheritance", async () => {
  document.body.innerHTML = '<acme-theme appearance="dark" density="compact" locale="fr-CA"><acme-theme></acme-theme></acme-theme>';
  const [parent, child] = [...document.querySelectorAll<AcmeTheme>("acme-theme")];
  await settled(parent, child);
  expect([child.appearance, child.density, child.locale]).toEqual(["dark", "compact", "fr-CA"]);
  child.setAttribute("appearance", "auto");
  child.setAttribute("density", "normal");
  await settled(child);
  expect([child.appearance, child.density]).toEqual(["auto", "normal"]);
  child.removeAttribute("appearance");
  child.removeAttribute("density");
  await settled(child);
  expect([child.appearance, child.density]).toEqual(["dark", "compact"]);
  expect(child.hasAttribute("data-acme-appearance-boundary")).toBe(false);
});

test("registered overrides use owned sheets without replacing author inline custom properties", async () => {
  registerTheme("theme-unit-brand", { colors: { "ds-blue-700": "red" }, fonts: { "acme-font-sans": "serif" } });
  const element = document.createElement("acme-theme");
  element.style.setProperty("--ds-blue-700", "blue");
  element.theme = "theme-unit-brand";
  document.body.append(element);
  await settled(element);
  expect(element.style.getPropertyValue("--ds-blue-700")).toBe("blue");
  expect(element.shadowRoot!.querySelector('[part="root"] slot')).not.toBeNull();
  expect(element.shadowRoot!.adoptedStyleSheets.some((sheet) => [...sheet.cssRules].some((rule) => rule.cssText.includes("--ds-blue-700: red")))).toBe(true);
  element.theme = undefined;
  await settled(element);
  expect(element.style.getPropertyValue("--ds-blue-700")).toBe("blue");
  expect(element.theme).toBeUndefined();
});

test("moving a scope changes its inherited source without preserving the former parent", async () => {
  const first = document.createElement("acme-theme"),
    second = document.createElement("acme-theme"),
    child = document.createElement("acme-theme");
  first.appearance = "dark";
  second.appearance = "light";
  document.body.append(first, second);
  first.append(child);
  await settled(first, second, child);
  expect(child.appearance).toBe("dark");
  second.append(child);
  await settled(child);
  expect(child.appearance).toBe("light");
  first.appearance = "auto";
  await settled(first, child);
  expect(child.appearance).toBe("light");
});

test("an unknown theme fails before changing the current selected name", () => {
  const element = document.createElement("acme-theme");
  expect(() => {
    element.theme = "unregistered-unit-theme";
  }).toThrow("before use");
  expect(element.theme).toBeUndefined();
});
