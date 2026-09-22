import { afterEach, expect, test } from "bun:test";
import "../../../all";
afterEach(() => document.body.replaceChildren());
async function mount() {
  const form = document.createElement("form");
  const a = document.createElement("acme-radio"),
    b = document.createElement("acme-radio");
  a.name = b.name = "plan";
  a.value = "a";
  b.value = "b";
  a.textContent = "Alpha";
  b.textContent = "Beta";
  form.append(a, b);
  document.body.append(form);
  await a.updateComplete;
  await b.updateComplete;
  return { form, a, b };
}
test("standalone radios coordinate one checked value and one user event", async () => {
  const { a, b } = await mount();
  a.checked = true;
  const values: string[] = [];
  b.addEventListener("acme-change", (event) => values.push((event as CustomEvent).detail.value));
  b.click();
  expect(b.checked).toBe(true);
  expect(a.checked).toBe(false);
  expect(values).toEqual(["b"]);
  b.click();
  expect(values).toEqual(["b"]);
  expect("select" in b).toBe(false);
  expect("groupDisabled" in b).toBe(false);
  expect("skipTab" in b).toBe(false);
});
test("radio form scopes do not affect a separate form", async () => {
  const { a, b } = await mount();
  const other = document.createElement("form");
  document.body.append(other);
  other.append(b);
  await b.updateComplete;
  a.checked = true;
  b.checked = true;
  expect(a.checked && b.checked).toBe(true);
});
test("current and reset state remain separate and disabled native input rejects activation", async () => {
  const { a } = await mount();
  a.defaultChecked = true;
  a.checked = false;
  expect(a.defaultChecked).toBe(true);
  a.formResetCallback();
  expect(a.checked).toBe(true);
  a.checked = false;
  a.disabled = true;
  a.click();
  expect(a.checked).toBe(false);
  expect(a.shadowRoot!.querySelector("input")!.disabled).toBe(true);
});
