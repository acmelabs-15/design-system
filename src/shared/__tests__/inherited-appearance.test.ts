import { describe, expect, expectTypeOf, test } from "bun:test";
import { createAtom } from "@tanstack/lit-store";
import { createInheritedAppearance, type AppearanceDefaults } from "../inherited-appearance";

const createAppearance = () =>
  createInheritedAppearance({
    size: { supported: ["small", "medium", "large"] as const, defaultValue: "medium" },
    variant: { supported: ["solid", "outline"] as const, defaultValue: "solid" },
  });

describe("inherited appearance", () => {
  test("distinguishes component defaults from an authored value equal to the default", () => {
    const appearance = createAppearance();
    expect(appearance.authored.get()).toEqual({});
    expect(appearance.effective.get()).toEqual({ size: "medium", variant: "solid" });
    appearance.setAuthored({ size: "medium" });
    appearance.setProvider(createAtom<AppearanceDefaults>({ size: "large", variant: "outline" }));
    expect(appearance.authored.get()).toEqual({ size: "medium" });
    expect(appearance.effective.get()).toEqual({ size: "medium", variant: "outline" });
    appearance.setAuthored({ size: undefined });
    expect(appearance.authored.get()).toEqual({});
    expect(appearance.effective.get().size).toBe("large");
  });

  test("follows current provider changes, replacement and clearing", () => {
    const appearance = createAppearance();
    const first = createAtom<AppearanceDefaults>({ size: "small", variant: "outline" });
    const second = createAtom<AppearanceDefaults>({ size: "large" });
    const observed: string[] = [];
    const subscription = appearance.effective.subscribe((value) => observed.push(value.size!));
    try {
      appearance.setProvider(first);
      first.set({ size: "large", variant: "outline" });
      appearance.setProvider(second);
      expect(appearance.effective.get()).toEqual({ size: "large", variant: "solid" });
      first.set({ size: "medium" });
      expect(appearance.effective.get().size).toBe("large");
      second.set({ size: "small" });
      appearance.setProvider(undefined);
      expect(appearance.effective.get()).toEqual({ size: "medium", variant: "solid" });
      expect(observed).toEqual(["small", "large", "large", "small", "medium"]);
    } finally {
      subscription.unsubscribe();
    }
  });

  test("uses a fresh nested provider without merging outer defaults", () => {
    const appearance = createAppearance();
    appearance.setProvider(createAtom<AppearanceDefaults>({ size: "large", variant: "outline" }));
    appearance.setProvider(createAtom<AppearanceDefaults>({}));
    expect(appearance.effective.get()).toEqual({ size: "medium", variant: "solid" });
  });

  test("reports unsupported inherited values and uses the component default", () => {
    const appearance = createAppearance();
    const provider = createAtom<AppearanceDefaults>({ size: "tiny", variant: "outline" });
    appearance.setProvider(provider);
    expect(appearance.effective.get()).toEqual({ size: "medium", variant: "outline" });
    expect(appearance.diagnostics.get()).toEqual([{ code: "unsupported-inherited-value", property: "size", value: "tiny", supported: ["small", "medium", "large"] }]);
    appearance.setAuthored({ size: "large" });
    expect(appearance.effective.get().size).toBe("large");
    expect(appearance.diagnostics.get()).toEqual([]);
    appearance.setAuthored({ size: undefined });
    expect(appearance.diagnostics.get()).toHaveLength(1);
    provider.set({ variant: "outline" });
    expect(appearance.effective.get().size).toBe("medium");
    expect(appearance.diagnostics.get()).toEqual([]);
  });

  test("ignores provider values for a property the child does not support", () => {
    const appearance = createInheritedAppearance({ size: { supported: ["small", "medium"] as const, defaultValue: "medium" } });
    appearance.setProvider(createAtom<AppearanceDefaults>({ size: "small", variant: "unrelated" }));
    expect(appearance.effective.get()).toEqual({ size: "small", variant: undefined });
    expect(appearance.diagnostics.get()).toEqual([]);
  });

  test("does not publish effective changes when authored inputs mask provider changes", () => {
    const appearance = createAppearance();
    const provider = createAtom<AppearanceDefaults>({ size: "small", variant: "outline" });
    appearance.setProvider(provider);
    appearance.setAuthored({ size: "medium", variant: "solid" });
    const changes: unknown[] = [];
    const subscription = appearance.effective.subscribe((value) => changes.push(value));
    try {
      const snapshot = appearance.effective.get();
      provider.set({ size: "large", variant: "unsupported" });
      appearance.setProvider(createAtom<AppearanceDefaults>({ size: "tiny" }));
      appearance.setAuthored({ size: "medium" });
      expect(appearance.effective.get()).toBe(snapshot);
      expect(changes).toEqual([]);
    } finally {
      subscription.unsubscribe();
    }
  });

  test("freezes snapshots and owns copies of definitions and authored inputs", () => {
    const supported = ["small", "medium"];
    const definition = { supported, defaultValue: "medium" };
    const appearance = createInheritedAppearance({ size: definition });
    supported.push("tiny");
    definition.defaultValue = "small";
    const authored = { size: "medium" };
    appearance.setAuthored(authored);
    authored.size = "small";
    expect(appearance.authored.get().size).toBe("medium");
    expect(Reflect.set(appearance.authored.get(), "size", "small")).toBe(false);
    expect(Reflect.set(appearance.effective.get(), "size", "small")).toBe(false);
    appearance.setAuthored({ size: undefined });
    appearance.setProvider(createAtom<AppearanceDefaults>({ size: "tiny" }));
    expect(appearance.effective.get().size).toBe("medium");
    const diagnostics = appearance.diagnostics.get();
    expect(Object.isFrozen(diagnostics)).toBe(true);
    expect(Object.isFrozen(diagnostics[0])).toBe(true);
    expect(Object.isFrozen(diagnostics[0].supported)).toBe(true);
    expect(Reflect.set(diagnostics[0], "value", "small")).toBe(false);
    expect("set" in appearance.authored).toBe(false);
    expect("set" in appearance.effective).toBe(false);
  });

  test("keeps size and variant supported-value types separate", () => {
    const appearance = createAppearance();
    expectTypeOf(appearance.effective.get().size).toEqualTypeOf<"small" | "medium" | "large" | undefined>();
    expectTypeOf(appearance.effective.get().variant).toEqualTypeOf<"solid" | "outline" | undefined>();
    expectTypeOf<Parameters<typeof appearance.setAuthored>[0]>().toEqualTypeOf<Readonly<{ size?: "small" | "medium" | "large"; variant?: "solid" | "outline" }>>();
    const variantOnly = createInheritedAppearance({ variant: { supported: ["solid", "outline"] as const, defaultValue: "solid" } });
    expectTypeOf(variantOnly.effective.get().size).toEqualTypeOf<undefined>();
  });

  test("leaves subscription lifetime with the consumer and still reads current state after disposal", () => {
    const appearance = createAppearance();
    const provider = createAtom<AppearanceDefaults>({ size: "small" });
    appearance.setProvider(provider);
    const changes: unknown[] = [];
    const subscription = appearance.effective.subscribe((value) => changes.push(value));
    provider.set({ size: "large" });
    expect(changes).toHaveLength(1);
    subscription.unsubscribe();
    provider.set({ size: "medium" });
    expect(changes).toHaveLength(1);
    expect(appearance.effective.get().size).toBe("medium");
  });
});
