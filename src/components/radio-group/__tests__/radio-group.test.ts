import { afterEach, expect, test } from "bun:test";
import "../../../all";

afterEach(() => document.body.replaceChildren());
async function mount() {
  const group = document.createElement("acme-radio-group"),
    a = document.createElement("acme-radio"),
    b = document.createElement("acme-radio");
  a.value = "a";
  b.value = "b";
  a.textContent = "Alpha";
  b.textContent = "Beta";
  group.ariaLabel = "Plan";
  group.append(a, b);
  document.body.append(group);
  await group.updateComplete;
  await a.updateComplete;
  await b.updateComplete;
  return { group, a, b };
}
test("an explicit radio owner begins empty and emits one scalar change", async () => {
  const { group, a, b } = await mount();
  expect(group.value).toBeUndefined();
  expect(!a.checked && !b.checked).toBe(true);
  const events: unknown[] = [];
  group.addEventListener("acme-change", (event) => events.push((event as CustomEvent).detail));
  b.click();
  expect(group.value).toBe("b");
  expect(events).toEqual([{ value: "b" }]);
  a.checked = true;
  expect(group.value).toBe("a");
  expect(events).toHaveLength(1);
  expect(group.shadowRoot!.querySelector("[part=root]")!.getAttribute("aria-label")).toBe("Plan");
});
test("default values, native reset and attribute removal follow the scalar contract", async () => {
  const { group, a, b } = await mount();
  group.defaultValue = "a";
  expect(a.checked).toBe(true);
  group.value = "b";
  group.formResetCallback();
  expect(a.checked && !b.checked).toBe(true);
  group.removeAttribute("value");
  expect(group.value).toBeUndefined();
  expect(() => {
    group.value = "";
  }).toThrow();
  expect("label" in group).toBe(false);
});
test("orientation and false-string loop options preserve their defaults", async () => {
  const { group } = await mount();
  expect(group.orientation).toBe("vertical");
  expect(group.loop).toBe(true);
  group.setAttribute("loop", "false");
  expect(group.loop).toBe(false);
  group.removeAttribute("loop");
  expect(group.loop).toBe(true);
  group.orientation = "horizontal";
  await group.updateComplete;
  expect(group.shadowRoot!.querySelector("[part=root]")!.getAttribute("aria-orientation")).toBe("horizontal");
});
