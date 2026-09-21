export const numericTokenKeys = Object.freeze([0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96] as const);
export type NumericTokenKey = (typeof numericTokenKeys)[number];
export type NumericTokenCategory = "spacing" | "sizes";
export type NumericTokenDefinition = Readonly<{
  category: NumericTokenCategory;
  key: NumericTokenKey;
  cssProperty: string;
  defaultValue: `${number}rem`;
}>;

function checkCategory(category: NumericTokenCategory): void {
  if (category !== "spacing" && category !== "sizes") throw new TypeError("Unknown numeric token category: " + category);
}

function checkKey(key: number): asserts key is NumericTokenKey {
  if (typeof key !== "number" || !(numericTokenKeys as readonly number[]).includes(key)) throw new TypeError("Unknown numeric token key: " + key);
}

/** Positive token properties are independent for spacing and dimensions. */
export function numericTokenProperty(category: NumericTokenCategory, key: NumericTokenKey): string {
  checkCategory(category);
  checkKey(key);
  return `--acme-${category === "spacing" ? "spacing" : "size"}-${String(key).replace(".", "-")}`;
}

/** Signed spacing follows its positive theme token; size tokens remain nonnegative. */
export function numericTokenValue(category: NumericTokenCategory, key: number): string {
  checkCategory(category);
  if (typeof key !== "number") throw new TypeError("Numeric token keys must be numbers");
  if (category === "sizes" && key < 0) throw new TypeError("Size tokens cannot be negative");
  const positive = Math.abs(key);
  checkKey(positive);
  const value = `var(${numericTokenProperty(category, positive)})`;
  return key < 0 ? `calc(${value} * -1)` : value;
}

/** Shared generator and manifest input; negative spacing has no separate declaration. */
export const numericTokenDefinitions: readonly NumericTokenDefinition[] = Object.freeze(
  (["spacing", "sizes"] as const).flatMap((category) =>
    numericTokenKeys.map((key) => Object.freeze({ category, key, cssProperty: numericTokenProperty(category, key), defaultValue: `${key * 0.25}rem` as const })),
  ),
);
