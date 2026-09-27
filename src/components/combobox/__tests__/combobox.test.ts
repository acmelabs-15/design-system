import { expect, test } from "bun:test";
import "../../../all";

const create = () => document.createElement("acme-combobox");
test("ComboBox keeps committed value, query and reset value distinct", () => {
  const root = create();
  root.defaultValue = "initial";
  root.value = "saved";
  root.inputValue = "search";
  expect(root.value).toBe("saved");
  expect(root.defaultValue).toBe("initial");
  expect(root.inputValue).toBe("search");
  root.formResetCallback();
  expect(root.value).toBe("initial");
  expect(root.inputValue).toBe("initial");
  root.value = undefined;
  expect(root.value).toBeUndefined();
  expect(root.inputValue).toBe("");
});
test("ComboBox programmatic state writes remain silent", () => {
  const root = create();
  const events: string[] = [];
  root.addEventListener("acme-change", () => events.push("change"));
  root.addEventListener("acme-input", () => events.push("input"));
  root.value = "known";
  root.inputValue = "query";
  root.formResetCallback();
  expect(events).toEqual([]);
});
test("ComboBox restores scalar values and rejects malformed values", () => {
  const root = create();
  expect(() => {
    root.value = "";
  }).toThrow();
  expect(() => {
    root.inputValue = 12 as never;
  }).toThrow();
  root.formStateRestoreCallback('["restored"]', "restore");
  expect(root.value).toBe("restored");
  root.formStateRestoreCallback('["a","b"]', "restore");
  expect(root.value).toBeUndefined();
  expect(root.clearable).toBe(true);
  root.setAttribute("clearable", "false");
  expect(root.clearable).toBe(false);
});
