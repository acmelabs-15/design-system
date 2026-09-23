import { expect, test } from "bun:test";
import "../../../all";
const mount = async () => {
  document.body.innerHTML = '<acme-multi-select><acme-option value="a">Alpha</acme-option><acme-option value="b">Beta</acme-option></acme-multi-select>';
  const root = document.querySelector("acme-multi-select")!;
  root.defaultValue = ["a"];
  for (let i = 0; i < 3; i++) {
    await root.updateComplete;
    for (const option of root.querySelectorAll("acme-option")) await option.updateComplete;
  }
  return root;
};
test("Multi Select owns an immutable array independent from caller mutation", async () => {
  const root = await mount();
  const values = ["a", "b"];
  root.value = values;
  values.pop();
  expect(root.value).toEqual(["a", "b"]);
  expect(Object.isFrozen(root.value)).toBe(true);
  expect(() => (root.value = ["a", "a"])).toThrow();
  expect(root.value).toEqual(["a", "b"]);
});
test("Multi Select preserves reset defaults and clears malformed restoration", async () => {
  const root = await mount();
  root.value = ["b"];
  expect(root.defaultValue).toEqual(["a"]);
  root.formResetCallback();
  expect(root.value).toEqual(["a"]);
  root.formStateRestoreCallback("invalid", "restore");
  expect(root.value).toEqual([]);
});
test("Multi Select has one logical owner and no independently named checkbox controls", async () => {
  const root = await mount();
  expect(root.shadowRoot!.querySelector("[role=listbox]")!.getAttribute("aria-multiselectable")).toBe("true");
  expect(root.querySelectorAll("acme-checkbox").length).toBe(0);
  expect("rows" in root).toBe(false);
  expect("hoverRow" in root).toBe(false);
});
