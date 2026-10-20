import { describe, expect, expectTypeOf, test } from "bun:test";
import { runInNewContext } from "node:vm";
import { createOrderedStyleInputs } from "../ordered-style-inputs";

const spacing = (value: unknown): string | number | readonly (number | null)[] => {
  if (typeof value === "string") {
    return value.trim();
  }
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return value;
  }
  if (Array.isArray(value) && value.every((item) => item === null || (typeof item === "number" && Number.isFinite(item) && item >= 0))) {
    return [...value];
  }
  throw new TypeError("Invalid test spacing");
};
const color = (value: unknown): string => {
  if (typeof value !== "string") {
    throw new TypeError("Invalid test color");
  }
  return value.trim();
};
const createInputs = () => createOrderedStyleInputs({ padding: spacing, paddingInline: spacing, backgroundColor: color });

describe("ordered style inputs", () => {
  test("direct updates retain position, clearing removes it, and re-adding appends", () => {
    const inputs = createInputs();
    expect(inputs.get("padding")).toBeUndefined();
    inputs.set("paddingInline", "8px");
    inputs.set("padding", "16px");
    inputs.set("paddingInline", "4px");
    expect(inputs.entries.get()).toEqual([
      ["paddingInline", "4px"],
      ["padding", "16px"],
    ]);
    inputs.set("paddingInline", undefined);
    expect(inputs.entries.get()).toEqual([["padding", "16px"]]);
    inputs.set("paddingInline", "2px");
    expect(inputs.entries.get()).toEqual([
      ["padding", "16px"],
      ["paddingInline", "2px"],
    ]);
  });

  test("a complete helper patch preserves unrelated inputs and supplied object order", () => {
    const inputs = createInputs();
    inputs.set("padding", "old");
    inputs.set("backgroundColor", "red");
    const keys = inputs.apply({ paddingInline: "8px", padding: "16px" });
    expect(inputs.entries.get()).toEqual([
      ["backgroundColor", "red"],
      ["paddingInline", "8px"],
      ["padding", "16px"],
    ]);
    const nextKeys = inputs.apply({ paddingInline: "6px" }, keys);
    expect(inputs.entries.get()).toEqual([
      ["backgroundColor", "red"],
      ["paddingInline", "6px"],
    ]);
    expect(inputs.get("padding")).toBeUndefined();
    inputs.apply({}, nextKeys);
    expect(inputs.entries.get()).toEqual([["backgroundColor", "red"]]);
  });

  test("same values can reorder and every helper invocation reasserts its values", () => {
    const inputs = createInputs();
    const authored = { padding: "16px", paddingInline: "8px" };
    const keys = inputs.apply(authored);
    inputs.set("padding", "32px");
    expect(inputs.get("padding")).toBe("32px");
    inputs.apply(authored, keys);
    expect(inputs.get("padding")).toBe("16px");
    inputs.apply({ paddingInline: "8px", padding: "16px" }, keys);
    expect(inputs.entries.get()).toEqual([
      ["paddingInline", "8px"],
      ["padding", "16px"],
    ]);
    authored.padding = "20px";
    inputs.apply(authored, keys);
    expect(inputs.get("padding")).toBe("20px");
  });

  test("publishes one complete canonical snapshot for multiple changes", () => {
    const inputs = createInputs();
    const keys = inputs.apply({ padding: "16px", paddingInline: "8px" });
    const snapshots: unknown[] = [];
    const subscription = inputs.entries.subscribe((value) => snapshots.push(value));
    try {
      inputs.apply({ backgroundColor: "blue", padding: "20px" }, keys);
      expect(snapshots).toEqual([
        [
          ["backgroundColor", "blue"],
          ["padding", "20px"],
        ],
      ]);
      expect(inputs.get("paddingInline")).toBeUndefined();
    } finally {
      subscription.unsubscribe();
    }
  });

  test("a late invalid value cannot commit earlier values or removals", () => {
    const inputs = createInputs();
    const keys = inputs.apply({ padding: "16px", paddingInline: "8px" });
    const before = inputs.entries.get();
    const changes: unknown[] = [];
    const subscription = inputs.entries.subscribe((value) => changes.push(value));
    try {
      expect(() => inputs.apply({ backgroundColor: "blue", padding: -1 }, keys)).toThrow("Invalid test spacing");
      expect(inputs.entries.get()).toBe(before);
      expect(inputs.get("paddingInline")).toBe("8px");
      expect(changes).toEqual([]);
      expect(() => inputs.set("padding", -1)).toThrow("Invalid test spacing");
      expect(inputs.entries.get()).toBe(before);
    } finally {
      subscription.unsubscribe();
    }
  });

  test("rejects unknown supplied, removed and direct keys before writing", () => {
    const inputs = createInputs();
    inputs.set("padding", "16px");
    const before = inputs.entries.get();
    const applyUnknown = inputs.apply as (patch: Record<string, unknown>, previous?: readonly string[]) => unknown;
    const setUnknown = inputs.set as (key: string, value: unknown) => void;
    expect(() => applyUnknown({ padding: "20px", mystery: 1 })).toThrow("Unknown style input");
    expect(() => applyUnknown({ padding: "20px" }, ["constructor"])).toThrow("Unknown style input");
    expect(() => setUnknown("__proto__", "bad")).toThrow("Unknown style input");
    expect(inputs.entries.get()).toBe(before);
  });

  test("undefined is a clear while zero and structured values remain authored inputs", () => {
    const inputs = createInputs();
    inputs.apply({ padding: 0, paddingInline: [0, null, 4] });
    expect(inputs.get("padding")).toBe(0);
    expect(inputs.get("paddingInline")).toEqual([0, null, 4]);
    const keys = inputs.apply({ padding: undefined });
    expect(inputs.get("padding")).toBeUndefined();
    expect(keys).toEqual(["padding"]);
    inputs.set("padding", 2);
    inputs.apply({}, keys);
    expect(inputs.get("padding")).toBeUndefined();
    expect(inputs.get("paddingInline")).toEqual([0, null, 4]);
  });

  test("owns normalized copies and freezes snapshot tuples, nested values and returned keys", () => {
    const inputs = createInputs();
    const value = [0, null, 4];
    const keys = inputs.apply({ padding: value, backgroundColor: " blue " });
    const snapshot = inputs.entries.get();
    value[0] = 9;
    expect(inputs.get("padding")).toEqual([0, null, 4]);
    expect(inputs.get("backgroundColor")).toBe("blue");
    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(Object.isFrozen(snapshot[0])).toBe(true);
    expect(Object.isFrozen(snapshot[0][1])).toBe(true);
    expect(Object.isFrozen(keys)).toBe(true);
    expect(Reflect.set(snapshot[0], "1", 12)).toBe(false);
    expect(Reflect.set(inputs.get("padding") as object, "0", 12)).toBe(false);
    expect("set" in inputs.entries).toBe(false);
    inputs.set("padding", 2);
    expect(snapshot).toEqual([
      ["padding", [0, null, 4]],
      ["backgroundColor", "blue"],
    ]);
  });

  test("preserves each property's validator output type", () => {
    const inputs = createInputs();
    expectTypeOf(inputs.get("backgroundColor")).toEqualTypeOf<string | undefined>();
    expectTypeOf(inputs.get("padding")).toEqualTypeOf<string | number | readonly (number | null)[] | undefined>();
    expectTypeOf<Parameters<typeof inputs.set>[0]>().toEqualTypeOf<"padding" | "paddingInline" | "backgroundColor">();
  });

  test("exposes inferred mutable validator results as deeply readonly values", () => {
    const inputs = createOrderedStyleInputs({
      array: (value: unknown) => [Number(value)],
      object: () => ({ compact: { steps: [1, 2], count: 2 } }),
    });
    type ReadonlyObject = { readonly compact: { readonly steps: readonly number[]; readonly count: number } };
    expectTypeOf(inputs.get("array")).toEqualTypeOf<readonly number[] | undefined>();
    expectTypeOf(inputs.get("object")).toEqualTypeOf<ReadonlyObject | undefined>();
    expectTypeOf(inputs.entries.get()).toEqualTypeOf<readonly (readonly ["array", readonly number[]] | readonly ["object", ReadonlyObject])[]>();
    inputs.apply({ array: 1, object: true });
    expect(Reflect.set(inputs.get("array")!, "0", 9)).toBe(false);
    expect(Reflect.set(inputs.get("object")!.compact, "count", 9)).toBe(false);
    expect(Reflect.set(inputs.get("object")!.compact.steps, "0", 9)).toBe(false);
  });

  test("accepts ordinary ordered input objects from another realm", () => {
    const inputs = createInputs();
    const foreign = runInNewContext('({ paddingInline: [0, null, 2], padding: "16px" })');
    inputs.apply(foreign);
    foreign.paddingInline[0] = 9;
    expect(inputs.entries.get()).toEqual([
      ["paddingInline", [0, null, 2]],
      ["padding", "16px"],
    ]);
  });
});
