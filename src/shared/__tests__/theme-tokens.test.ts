import { expect, test } from "bun:test";
import { densityTokenDefinitions, fontWeightTokenDefinitions, themeTokenCategories, themeTokenDefinitions, type ThemeDefinition } from "../theme-tokens";

test("all ten theme categories expose exact, unique keys and properties", () => {
  expect(themeTokenCategories).toEqual(["colors", "fonts", "fontSizes", "fontWeights", "lineHeights", "spacing", "sizes", "radii", "shadows", "motion"]);
  expect(new Set(themeTokenDefinitions.map((token) => token.cssProperty)).size).toBe(themeTokenDefinitions.length);
  expect(new Set(themeTokenDefinitions.map((token) => `${token.category}:${token.key}`)).size).toBe(themeTokenDefinitions.length);
  for (const category of themeTokenCategories) expect(themeTokenDefinitions.some((token) => token.category === category)).toBe(true);
  expect(Object.isFrozen(themeTokenDefinitions)).toBe(true);
  expect(themeTokenDefinitions.every(Object.isFrozen)).toBe(true);
});

test("existing names map directly while private channels and composition fields stay private", () => {
  expect(themeTokenDefinitions.find((token) => token.category === "colors" && token.key === "ds-blue-700")).toMatchObject({ cssProperty: "--ds-blue-700", syntax: "color" });
  expect(themeTokenDefinitions.find((token) => token.category === "fonts" && token.key === "acme-font-sans")).toMatchObject({ cssProperty: "--acme-font-sans", syntax: "font-family" });
  expect(themeTokenDefinitions.some((token) => /-value$|-rgb$|^--tw-/.test(token.cssProperty))).toBe(false);
  expect(themeTokenDefinitions.some((token) => String(token.key) === "blue700" || String(token.key) === "blue-700")).toBe(false);
  expect(themeTokenDefinitions.some((token) => token.cssProperty === "--ds-z-modal" || token.cssProperty === "--acme-text-gradient")).toBe(false);
});

test("numeric spacing and dimensions remain independent", () => {
  expect(themeTokenDefinitions.find((token) => token.category === "spacing" && token.key === "0.5")?.cssProperty).toBe("--acme-spacing-0-5");
  expect(themeTokenDefinitions.find((token) => token.category === "sizes" && token.key === "0.5")?.cssProperty).toBe("--acme-size-0-5");
  for (const category of ["spacing", "sizes"]) expect(themeTokenDefinitions.filter((token) => token.category === category && /^\d/.test(token.key))).toHaveLength(35);
});

test("weight defaults are the six numeric values present in authored and generated CSS", () => {
  expect(fontWeightTokenDefinitions.map((token) => token.defaultValue)).toEqual(["400", "450", "500", "550", "600", "700"]);
  for (const token of fontWeightTokenDefinitions) expect(String(token.cssProperty)).toBe(`--acme-font-weight-${token.defaultValue}`);
});

test("compact density changes only the approved role values", () => {
  expect(densityTokenDefinitions.map(({ defaultValue, compactValue }) => [defaultValue, compactValue])).toEqual([
    ["0.5rem", "0.375rem"],
    ["1rem", "0.75rem"],
    ["0.625rem", "0.3125rem"],
    ["0.5rem", "0.5rem"],
  ]);
  expect(densityTokenDefinitions.every((token) => token.category === "spacing")).toBe(true);
});

test("the public definition type accepts CSS strings under exact category keys", () => {
  const definition: ThemeDefinition = {
    colors: { "ds-blue-700": "oklch(60% .15 240)" },
    fonts: { "acme-font-sans": '"Example Sans", sans-serif' },
    fontWeights: { "acme-font-weight-550": "575" },
    spacing: { "0.5": "0.2rem" },
    sizes: { "8": "2.25rem" },
  };
  expect(definition.spacing?.["0.5"]).toBe("0.2rem");
});
