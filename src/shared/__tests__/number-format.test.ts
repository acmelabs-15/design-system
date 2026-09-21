import { expect, test } from "bun:test";
import { formatByte } from "../number-format";
const spaces = (value: string) => value.replace(/\s+/gu, " ");
test("zero respects the declared unit and locale", () => {
  expect(formatByte(0, "en-US", { unit: "bit" })).toBe(new Intl.NumberFormat("en-US", { style: "unit", unit: "bit", unitDisplay: "short", maximumSignificantDigits: 3 }).format(0));
  expect(formatByte(0, "ar-EG", { unit: "bit" })).toContain("٠");
  expect(formatByte(0, "ar-EG", { unit: "bit" })).toContain("بت");
});
test("binary symbols and localized long names use the selected scale", () => {
  expect(formatByte(1024, "en-US", { unitSystem: "binary" })).toBe("1 KiB");
  expect(formatByte(-2048, "en-US", { unitSystem: "binary", unit: "bit" })).toBe("-2 Kibit");
  expect(spaces(formatByte(2048, "fr-FR", { unitSystem: "binary", unitDisplay: "long" }))).toBe("2 kibioctets");
  expect(spaces(formatByte(2048, "de-DE", { unitSystem: "binary", unitDisplay: "long" }))).toBe("2 Kibibyte");
  expect(spaces(formatByte(2048, "ru-RU", { unitSystem: "binary", unitDisplay: "long" }))).toBe("2 кибибайта");
});
test("three significant digits do not discard small finite values", () => {
  expect(formatByte(0.0001, "en-US")).toBe("0.0001 byte");
  expect(formatByte(1234567, "en-US")).toBe("1.23 MB");
  expect(formatByte(-1024, "en-US", { unitSystem: "binary", unitDisplay: "narrow" })).toBe("-1KiB");
});
test("invalid values and combinations use an explicit error surface", () => {
  for (const value of [NaN, Infinity, -Infinity]) expect(() => formatByte(value, "en-US")).toThrow();
  expect(() => formatByte(1, "en-US", { unit: "pixel" as never })).toThrow();
  expect(() => formatByte(1, "en-US", { unitSystem: "unknown" as never })).toThrow();
});
