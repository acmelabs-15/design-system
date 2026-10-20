import { describe, expect, expectTypeOf, test } from "bun:test";
import { numericTokenDefinitions, numericTokenKeys, numericTokenProperty, numericTokenValue, type NumericTokenKey } from "../numeric-tokens";

describe("numeric tokens", () => {
  test("defines exactly the approved 35 immutable keys", () => {
    expect<readonly number[]>(numericTokenKeys).toEqual([0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96]);
    expect(Object.isFrozen(numericTokenKeys)).toBe(true);
    expect(Reflect.set(numericTokenKeys, "0", 99)).toBe(false);
  });

  test("keeps spacing and size names independent and encodes decimal keys", () => {
    expect(numericTokenProperty("spacing", 0.5)).toBe("--acme-spacing-0-5");
    expect(numericTokenProperty("spacing", 4.5)).toBe("--acme-spacing-4-5");
    expect(numericTokenProperty("sizes", 0.5)).toBe("--acme-size-0-5");
    expect(numericTokenProperty("sizes", 96)).toBe("--acme-size-96");
    expect(numericTokenValue("spacing", 2)).toBe("var(--acme-spacing-2)");
    expect(numericTokenValue("sizes", 2)).toBe("var(--acme-size-2)");
    expect(numericTokenValue("spacing", 0)).toBe("var(--acme-spacing-0)");
    expect(numericTokenValue("sizes", 0)).toBe("var(--acme-size-0)");
  });

  test("derives negative spacing from positive properties without declaring negative tokens", () => {
    expect(numericTokenValue("spacing", -0.5)).toBe("calc(var(--acme-spacing-0-5) * -1)");
    expect(numericTokenValue("spacing", -2)).toBe("calc(var(--acme-spacing-2) * -1)");
    expect(numericTokenValue("spacing", -96)).toBe("calc(var(--acme-spacing-96) * -1)");
    expect(numericTokenDefinitions.some((definition) => definition.key < 0)).toBe(false);
    expect(() => numericTokenValue("sizes", -2)).toThrow("negative");
  });

  test("rejects unknown numeric keys and categories instead of emitting fallback pixels", () => {
    for (const key of [0.25, 13, 97, NaN, Infinity, -Infinity]) {
      expect(() => numericTokenValue("spacing", key)).toThrow();
      expect(() => numericTokenValue("sizes", key)).toThrow();
    }
    expect(() => numericTokenValue("spacing", -13)).toThrow();
    expect(() => numericTokenProperty("spacing", -2 as NumericTokenKey)).toThrow();
    expect(() => Reflect.apply(numericTokenValue, undefined, ["spacing", "2"])).toThrow();
    expect(() => Reflect.apply(numericTokenProperty, undefined, ["colors", 2])).toThrow();
    expect(() => Reflect.apply(numericTokenValue, undefined, ["colors", 2])).toThrow();
  });

  test("provides 70 unique immutable definitions with rem defaults for both categories", () => {
    expect(numericTokenDefinitions).toHaveLength(70);
    expect(new Set(numericTokenDefinitions.map((definition) => definition.cssProperty)).size).toBe(70);
    expect(Object.isFrozen(numericTokenDefinitions)).toBe(true);
    for (const category of ["spacing", "sizes"] as const) {
      const definitions = numericTokenDefinitions.filter((definition) => definition.category === category);
      expect(definitions.map((definition) => definition.key)).toEqual([...numericTokenKeys]);
      for (const definition of definitions) {
        expect(Object.isFrozen(definition)).toBe(true);
        expect(definition.defaultValue).toBe(`${definition.key * 0.25}rem`);
        expect(definition.cssProperty).toBe(numericTokenProperty(category, definition.key));
        expect(Reflect.set(definition, "defaultValue", "999px")).toBe(false);
      }
    }
    expect(numericTokenDefinitions.find((definition) => definition.category === "spacing" && definition.key === 0.5)?.defaultValue).toBe("0.125rem");
    expect(numericTokenDefinitions.find((definition) => definition.category === "sizes" && definition.key === 96)?.defaultValue).toBe("24rem");
    expectTypeOf(numericTokenDefinitions[0].key).toEqualTypeOf<NumericTokenKey>();
  });
});
