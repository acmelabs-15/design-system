import { afterEach, expect, test } from "bun:test";
import "../../../all";
import type { AcmeThemeSwitcher } from "../theme-switcher";

afterEach(() => {
  document.body.replaceChildren();
});
const mount = async (attributes = "") => {
  document.body.innerHTML = `<acme-theme-switcher ${attributes}></acme-theme-switcher>`;
  const element = document.body.firstElementChild as AcmeThemeSwitcher;
  await settle(element);
  return element;
};
const selector = (element: AcmeThemeSwitcher) => element.shadowRoot!.querySelector("acme-segmented-control")!;
const items = (element: AcmeThemeSwitcher) => [...element.shadowRoot!.querySelectorAll("acme-segmented-control-item")];
const radios = (element: AcmeThemeSwitcher) => items(element).map((item) => item.shadowRoot!.querySelector("input")!);
const settle = async (element: AcmeThemeSwitcher) => {
  await element.updateComplete;
  await selector(element).updateComplete;
  await Promise.all(items(element).map((item) => item.updateComplete));
};

test("renders one named native radio group with auto selected and small default size", async () => {
  const element = await mount();
  const inputs = radios(element);
  expect(element.value).toBe("auto");
  expect(element.size).toBe("small");
  expect(inputs.map((input) => input.getAttribute("aria-label"))).toEqual(["System", "Light", "Dark"]);
  expect(inputs.every((input) => input.type === "radio")).toBe(true);
  expect(selector(element).value).toBe("auto");
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
  items(element)[2].click();
  await settle(element);
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
  items(element)[2].click();
  await settle(element);
  expect(element.value).toBe("dark");
  expect(radios(element)[2].checked).toBe(true);
  element.value = "light";
  await settle(element);
  expect(radios(element)[1].checked).toBe(true);
  expect(requests).toEqual([{ action: "appearance", value: "dark" }]);
});

test("disabled blocks requests and named sizes reach the rendered root", async () => {
  const element = await mount('disabled size="large" value="dark"');
  let requests = 0;
  element.addEventListener("acme-request", () => requests++);
  expect(radios(element).every((input) => input.disabled)).toBe(true);
  items(element)[0].click();
  expect(requests).toBe(0);
  expect(selector(element).size).toBe("large");
});

test("removing authored value and size attributes restores the declared defaults", async () => {
  const element = await mount('size="large" value="dark"');
  element.removeAttribute("value");
  element.removeAttribute("size");
  await settle(element);
  expect(element.value).toBe("auto");
  expect(element.size).toBe("small");
  expect(radios(element).map((input) => input.checked)).toEqual([true, false, false]);
});
