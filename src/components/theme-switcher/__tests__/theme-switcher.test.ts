import { afterEach, expect, test } from "bun:test";
import "../../../all";
import type { AcmeThemeSwitcher } from "../theme-switcher";

afterEach(() => {
  document.body.replaceChildren();
});
const mount = async (attributes = "") => {
  document.body.innerHTML = `<acme-theme-switcher ${attributes}></acme-theme-switcher>`;
  const element = document.body.firstElementChild as AcmeThemeSwitcher;
  await element.updateComplete;
  return element;
};
const radios = (element: AcmeThemeSwitcher) => [...element.shadowRoot!.querySelectorAll<HTMLInputElement>("input")];

test("renders one named native radio group with auto selected and small default size", async () => {
  const element = await mount();
  const inputs = radios(element);
  expect(element.value).toBe("auto");
  expect(element.size).toBe("small");
  expect(inputs.map((input) => input.getAttribute("aria-label"))).toEqual(["system", "light", "dark"]);
  expect(new Set(inputs.map((input) => input.name)).size).toBe(1);
  expect(inputs.every((input) => input.name && input.type === "radio")).toBe(true);
  expect(inputs.map((input) => input.checked)).toEqual([true, false, false]);
  expect(element.shadowRoot!.querySelector('[part="root"]')).not.toBeNull();
});

test("requests a preference without owning it, writing root attributes or saving storage", async () => {
  const root = document.documentElement.outerHTML.split("<body")[0];
  const stored = window.localStorage.getItem("theme-pref");
  const element = await mount();
  let detail: unknown;
  element.addEventListener("acme-request", (event) => {
    detail = (event as CustomEvent).detail;
  });
  radios(element)[2].checked = true;
  radios(element)[2].dispatchEvent(new Event("change"));
  await element.updateComplete;
  expect(detail).toEqual({ action: "appearance", value: "dark" });
  expect(element.value).toBe("auto");
  expect(radios(element).map((input) => input.checked)).toEqual([true, false, false]);
  expect(document.documentElement.outerHTML.split("<body")[0]).toBe(root);
  expect(window.localStorage.getItem("theme-pref")).toBe(stored);
});

test("application updates drive the control and programmatic updates emit no request", async () => {
  const element = await mount();
  const requests: unknown[] = [];
  element.addEventListener("acme-request", (event) => {
    const detail = (event as CustomEvent).detail;
    requests.push(detail);
    element.value = detail.value;
  });
  radios(element)[2].checked = true;
  radios(element)[2].dispatchEvent(new Event("change"));
  await element.updateComplete;
  expect(element.value).toBe("dark");
  expect(radios(element)[2].checked).toBe(true);
  element.value = "light";
  await element.updateComplete;
  expect(radios(element)[1].checked).toBe(true);
  expect(requests).toEqual([{ action: "appearance", value: "dark" }]);
});

test("disabled blocks requests and named sizes reach the rendered root", async () => {
  const element = await mount('disabled size="large" value="dark"');
  let requests = 0;
  element.addEventListener("acme-request", () => requests++);
  expect(radios(element).every((input) => input.disabled)).toBe(true);
  radios(element)[0].dispatchEvent(new Event("change"));
  expect(requests).toBe(0);
  expect(element.shadowRoot!.querySelector("fieldset")!.getAttribute("data-size")).toBe("large");
  expect(element.shadowRoot!.querySelector("fieldset")!.hasAttribute("data-small")).toBe(false);
});

test("removing authored value and size attributes restores the declared defaults", async () => {
  const element = await mount('size="large" value="dark"');
  element.removeAttribute("value");
  element.removeAttribute("size");
  await element.updateComplete;
  expect(element.value).toBe("auto");
  expect(element.size).toBe("small");
  expect(radios(element).map((input) => input.checked)).toEqual([true, false, false]);
});
