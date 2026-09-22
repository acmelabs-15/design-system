import { expect, test } from "bun:test";
import "../../../all";
const mount = async () => {
  const c = document.createElement("acme-pin-input");
  c.count = 4;
  document.body.append(c);
  await c.updateComplete;
  for (const f of c.shadowRoot!.querySelectorAll("acme-pin-input-field")) await f.updateComplete;
  return c;
};
test("Pin Input owns one immutable string array and separates reset defaults", async () => {
  const c = await mount();
  const value = ["1", "2"];
  c.value = value;
  value[0] = "9";
  expect(c.value).toEqual(["1", "2", "", ""]);
  expect(Object.isFrozen(c.value)).toBe(true);
  c.defaultValue = ["3", "4"];
  c.value = ["9"];
  c.formResetCallback();
  expect(c.value).toEqual(["3", "4", "", ""]);
  c.count = 2;
  expect(c.value).toEqual(["3", "4"]);
  c.remove();
});
test("restoration and programmatic writes remain silent", async () => {
  const c = await mount();
  const events: Event[] = [];
  for (const event of ["acme-input", "acme-change", "acme-complete"]) c.addEventListener(event, (e) => events.push(e));
  c.value = ["1", "2", "3", "4"];
  c.formStateRestoreCallback("5678", "autocomplete");
  expect(c.valueAsString).toBe("5678");
  c.formStateRestoreCallback("not json", "restore");
  expect(c.valueAsString).toBe("");
  expect(events).toHaveLength(0);
  c.remove();
});
test("configuration validates counts, policies and individual character assignments", async () => {
  const c = await mount();
  expect(() => {
    c.count = 0;
  }).toThrow();
  expect(() => {
    c.type = "other" as never;
  }).toThrow();
  expect(() => {
    c.setValueAt(4, "1");
  }).toThrow();
  expect(() => {
    c.value = ["12"];
  }).toThrow();
  c.setValueAt(1, "2");
  expect(c.value).toEqual(["", "2", "", ""]);
  c.remove();
});
