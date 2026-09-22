import { test, expect } from "bun:test";
import { pinValue, pinPaste, pinDelete, pinCharacter, pinFocus, pinCharacters } from "../pin-value";
test("normalization fills, truncates and owns values", () => {
  const source = ["1", "2"];
  const value = pinValue(source, 4);
  source[0] = "9";
  expect(value).toEqual(["1", "2", "", ""]);
  expect(Object.isFrozen(value)).toBe(true);
  expect(pinValue(["1", "2", "3"], 2)).toEqual(["1", "2"]);
  expect(() => pinValue(["12"], 3)).toThrow();
});
test("full codes replace all fields while partial paste preserves only the left prefix", () => {
  expect(pinPaste(["1", "2", "3", "4"], 2, "9876")).toEqual(["9", "8", "7", "6"]);
  expect(pinPaste(["1", "2", "3", "4"], 1, "98")).toEqual(["1", "9", "8", ""]);
  expect(pinPaste(["", "", "", ""], 3, "12")).toEqual(["1", "2", "", ""]);
});
test("deletion leaves no holes and focus stops at the insertion point", () => {
  expect(pinDelete(["1", "2", "3", ""], 1)).toEqual(["1", "3", "", ""]);
  expect(pinDelete(["1", "", "", ""], 1)).toEqual(["1", "", "", ""]);
  expect(pinFocus(["1", "", "", ""], 3)).toBe(1);
});
test("a new character replaces either side of the old character", () => {
  expect(pinCharacter("1", "12")).toBe("2");
  expect(pinCharacter("1", "21")).toBe("2");
  expect(pinCharacter("", "12")).toBe("2");
});
test("character policies match the selected ASCII alphabets", () => {
  expect(pinCharacters("123", "numeric")).toBe(true);
  expect(pinCharacters("١", "numeric")).toBe(false);
  expect(pinCharacters("Aa", "alphabetic")).toBe(true);
  expect(pinCharacters("A1", "alphabetic")).toBe(false);
  expect(pinCharacters("A1", "alphanumeric")).toBe(true);
});
