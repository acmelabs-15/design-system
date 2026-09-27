import { describe, expect, test } from "bun:test";
import { runInNewContext } from "node:vm";
import { copyResponsiveInput, parseResponsiveAttribute } from "../responsive-input";

const scalar = (value: unknown): value is string | number =>
  (typeof value === "number" && [0, 0.5, 2, 4].includes(value)) || (typeof value === "string" && ["4px", "var(--gap)", "[main] 1fr [end]", "none"].includes(value));

describe("responsive attribute conversion", () => {
  test("absence and empty attributes clear while numeric tokens retain their type", () => {
    for (const value of [null, "", "  "]) {
      expect(parseResponsiveAttribute(value, scalar)).toEqual({ value: undefined });
    }
    expect(parseResponsiveAttribute("0", scalar, { numbers: true })).toEqual({ value: 0 });
    expect(parseResponsiveAttribute(" .5 ", scalar, { numbers: true })).toEqual({ value: 0.5 });
    expect(parseResponsiveAttribute("2e0", scalar, { numbers: true })).toEqual({ value: 2 });
  });

  test("a numeric attribute cannot bypass its numeric bounds as a CSS string", () => {
    const opacity = (value: unknown): value is number | string => (typeof value === "number" ? value >= 0 && value <= 1 : value === "2");
    expect(parseResponsiveAttribute("2", opacity, { numbers: true }).diagnostic?.reason).toBe("value");
    expect(parseResponsiveAttribute('{"compact":"2"}', opacity).value).toEqual({ compact: "2" });
    const cssOnly = (value: unknown): value is string => value === "2";
    expect(parseResponsiveAttribute("2", cssOnly)).toEqual({ value: "2" });
  });

  test("recognizes scalar CSS before attempting structured JSON", () => {
    for (const value of ["4px", "var(--gap)", "[main] 1fr [end]"]) {
      expect(parseResponsiveAttribute(value, scalar)).toEqual({ value });
    }
  });

  test("preserves authored responsive objects and skipped array positions", () => {
    expect(parseResponsiveAttribute('{"expanded":4,"compact":0}', scalar)).toEqual({ value: { expanded: 4, compact: 0 } });
    expect(parseResponsiveAttribute("[0,null,4]", scalar)).toEqual({ value: [0, null, 4] });
    expect(parseResponsiveAttribute('{"mediumOnly":2,"mediumToExpanded":2}', scalar)).toEqual({ value: { mediumOnly: 2, mediumToExpanded: 2 } });
  });

  test("preserves false only when the property's scalar contract permits it", () => {
    const flag = (value: unknown): value is boolean => typeof value === "boolean";
    expect(parseResponsiveAttribute("false", flag)).toEqual({ value: false });
    expect(parseResponsiveAttribute("[false,null,true]", flag)).toEqual({ value: [false, null, true] });
    expect(parseResponsiveAttribute("false", scalar).value).toBeUndefined();
    expect(parseResponsiveAttribute("false", scalar).diagnostic).toBeDefined();
  });

  test("malformed JSON produces an absent current value with a bounded diagnostic", () => {
    expect(parseResponsiveAttribute('{"compact":', scalar)).toEqual({ value: undefined, diagnostic: { code: "invalid-responsive-attribute", reason: "syntax" } });
    expect(parseResponsiveAttribute("not-a-css-value", scalar)).toEqual({ value: undefined, diagnostic: { code: "invalid-responsive-attribute", reason: "value" } });
  });

  test.each(['{"compact":-2}', '{"other":2}', '{"compactOnly":2,"mediumDown":4}', "[2,2,2,2,2,2]", "null", '"4px"', '{"medium":null}'])(
    "invalid structure or leaf clears this attribute: %s",
    (input) => {
      const result = parseResponsiveAttribute(input, scalar);
      expect(result.value).toBeUndefined();
      expect(result.diagnostic).toEqual({ code: "invalid-responsive-attribute", reason: "value" });
    },
  );
});

describe("responsive authored snapshots", () => {
  test("validates before returning an immutable copy without normalizing away author syntax", () => {
    const authored = { mediumOnly: 2, compact: 0 };
    const result = copyResponsiveInput(authored, scalar);
    authored.mediumOnly = 4;
    expect(result).toEqual({ mediumOnly: 2, compact: 0 });
    expect(Object.keys(result as object)).toEqual(["mediumOnly", "compact"]);
    expect(Object.isFrozen(result)).toBe(true);
    expect(Reflect.set(result as object, "compact", 4)).toBe(false);
    expect(() => copyResponsiveInput({ compact: -2 }, scalar)).toThrow();
  });

  test("copies foreign records and sparse arrays without invoking inherited positions", () => {
    expect(copyResponsiveInput(runInNewContext("({ compact: 2 })"), scalar)).toEqual({ compact: 2 });
    const array = [0, , 4];
    const result = copyResponsiveInput(array, scalar) as readonly unknown[];
    array[0] = 2;
    expect(result).toEqual([0, , 4]);
    expect(Object.hasOwn(result, 1)).toBe(false);
    expect(Object.isFrozen(result)).toBe(true);
  });

  test("returns frozen successful and invalid converter results", () => {
    const success = parseResponsiveAttribute("[0,null,4]", scalar);
    const failed = parseResponsiveAttribute("{broken", scalar);
    expect(Object.isFrozen(success)).toBe(true);
    expect(Object.isFrozen(success.value)).toBe(true);
    expect(Object.isFrozen(failed)).toBe(true);
    expect(Object.isFrozen(failed.diagnostic)).toBe(true);
  });
});
