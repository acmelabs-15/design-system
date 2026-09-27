import { afterEach, expect, test } from "bun:test";
import "../../../all";

afterEach(() => document.body.replaceChildren());
async function mount() {
  const group = document.createElement("acme-checkbox-group");
  const a = document.createElement("acme-checkbox"),
    b = document.createElement("acme-checkbox");
  a.value = "a";
  b.value = "b";
  group.append(a, b);
  document.body.append(group);
  await group.updateComplete;
  await a.updateComplete;
  await b.updateComplete;
  return { group, a, b };
}
test("the group owns immutable values and one user event", async () => {
  const { group, a, b } = await mount();
  const values = ["b"];
  group.value = values;
  values.push("a");
  expect(group.value).toEqual(["b"]);
  expect(Object.isFrozen(group.value)).toBe(true);
  expect(a.checked).toBe(false);
  expect(b.checked).toBe(true);
  const events: unknown[] = [];
  group.addEventListener("acme-change", (event) => events.push({ target: event.target, detail: (event as CustomEvent).detail }));
  a.click();
  expect(group.value).toEqual(["b", "a"]);
  expect(events).toEqual([{ target: group, detail: { value: ["b", "a"] } }]);
  a.checked = false;
  expect(group.value).toEqual(["b"]);
  expect(events).toHaveLength(1);
});
test("defaults reset the array while member state stays derived", async () => {
  const { group, a, b } = await mount();
  group.defaultValue = ["a"];
  expect(a.checked).toBe(true);
  group.value = ["b"];
  group.defaultValue = ["a", "b"];
  expect(group.value).toEqual(["b"]);
  group.formResetCallback();
  expect(group.value).toEqual(["a", "b"]);
  expect(a.checked && b.checked).toBe(true);
});
test("member and group appearance have separate authored ownership", async () => {
  const { group, a, b } = await mount();
  group.size = "large";
  expect(a.size).toBe("large");
  a.size = "small";
  group.size = "medium";
  expect(a.size).toBe("small");
  expect(b.size).toBe("medium");
  a.size = undefined;
  expect(a.size).toBe("medium");
});
test("membership removal transfers current state and clears ownership", async () => {
  const { group, a } = await mount();
  group.value = ["a"];
  a.remove();
  expect(a.checked).toBe(true);
  a.checked = false;
  expect(group.value).toEqual(["a"]);
  expect(a.checked).toBe(false);
});
test("invalid property arrays do not replace the previous value", async () => {
  const { group } = await mount();
  group.value = ["a"];
  expect(() => {
    group.value = [1] as unknown as string[];
  }).toThrow();
  expect(group.value).toEqual(["a"]);
});

test("a same-value member write marks the collection current value as authored", async () => {
  const { group, a } = await mount();
  group.defaultValue = ["a"];
  a.checked = true;
  group.defaultValue = ["b"];
  expect(group.value).toEqual(["a"]);
  group.formResetCallback();
  expect(group.value).toEqual(["b"]);
});
