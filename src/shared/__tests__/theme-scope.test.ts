import { describe, expect, expectTypeOf, test } from "bun:test";
import { createAtom } from "@tanstack/lit-store";
import { runInNewContext } from "node:vm";
import { createThemeScope, type ResolvedAppearance } from "../theme-scope";

describe("theme scope", () => {
  test("uses house tokens, auto appearance and normal density without authoring those defaults", () => {
    const system = createAtom<ResolvedAppearance>("light");
    const scope = createThemeScope({ systemAppearance: system });
    expect(scope.authored.get()).toEqual({});
    expect(scope.effective.get()).toEqual({ theme: undefined, appearance: "auto", resolvedAppearance: "light", density: "normal", locale: undefined });
    system.set("dark");
    expect(scope.effective.get().resolvedAppearance).toBe("dark");
    expect(scope.authored.get()).toEqual({});
  });

  test("inherits the nearest parent's effective inputs and clears own overrides back to it", () => {
    const system = createAtom<ResolvedAppearance>("light");
    const parent = createThemeScope({ systemAppearance: system });
    parent.setAuthored({ theme: "brand", appearance: "dark", density: "compact", locale: "fr-CA" });
    const child = createThemeScope({ systemAppearance: system, parent: parent.effective });
    expect(child.authored.get()).toEqual({});
    expect(child.effective.get()).toEqual(parent.effective.get());
    child.setAuthored({ theme: "alternate", density: "normal", locale: "en-GB" });
    expect(child.effective.get()).toEqual({ theme: "alternate", appearance: "dark", resolvedAppearance: "dark", density: "normal", locale: "en-GB" });
    child.setAuthored({ theme: undefined, density: undefined, locale: undefined });
    expect(child.effective.get()).toEqual(parent.effective.get());
    expect(child.authored.get()).toEqual({});
  });

  test("explicit auto overrides inherited dark and follows the supplied system source", () => {
    const system = createAtom<ResolvedAppearance>("light");
    const parent = createThemeScope({ systemAppearance: system });
    parent.setAuthored({ appearance: "dark" });
    const child = createThemeScope({ systemAppearance: system, parent: parent.effective });
    child.setAuthored({ appearance: "auto" });
    expect(child.effective.get().appearance).toBe("auto");
    expect(child.effective.get().resolvedAppearance).toBe("light");
    system.set("dark");
    expect(child.effective.get().resolvedAppearance).toBe("dark");
    system.set("light");
    child.setAuthored({ appearance: undefined });
    expect(child.effective.get().appearance).toBe("dark");
    expect(child.effective.get().resolvedAppearance).toBe("dark");
  });

  test("omitted appearance inherits its parent's resolution while explicit auto uses its own source", () => {
    const parent = createThemeScope({ systemAppearance: createAtom<ResolvedAppearance>("light") });
    const child = createThemeScope({ systemAppearance: createAtom<ResolvedAppearance>("dark"), parent: parent.effective });
    expect(child.effective.get().resolvedAppearance).toBe("light");
    child.setAuthored({ appearance: "auto" });
    expect(child.effective.get().resolvedAppearance).toBe("dark");
    child.setAuthored({ appearance: undefined });
    expect(child.effective.get().resolvedAppearance).toBe("light");
  });

  test("follows parent updates and replacement without merging a removed provider", () => {
    const system = createAtom<ResolvedAppearance>("light");
    const first = createThemeScope({ systemAppearance: system });
    first.setAuthored({ theme: "first", density: "compact" });
    const second = createThemeScope({ systemAppearance: system });
    second.setAuthored({ locale: "de-DE" });
    const child = createThemeScope({ systemAppearance: system, parent: first.effective });
    first.setAuthored({ theme: "changed" });
    expect(child.effective.get().theme).toBe("changed");
    child.setParent(second.effective);
    expect(child.effective.get()).toEqual({ theme: undefined, appearance: "auto", resolvedAppearance: "light", density: "normal", locale: "de-DE" });
    first.setAuthored({ appearance: "dark" });
    expect(child.effective.get().resolvedAppearance).toBe("light");
    child.setParent(undefined);
    expect(child.effective.get().locale).toBeUndefined();
  });

  test("replaces the document system source and reads current state without a subscription", () => {
    const first = createAtom<ResolvedAppearance>("light");
    const second = createAtom<ResolvedAppearance>("dark");
    const scope = createThemeScope({ systemAppearance: first });
    scope.setSystemAppearance(second);
    expect(scope.effective.get().resolvedAppearance).toBe("dark");
    second.set("light");
    first.set("dark");
    expect(scope.effective.get().resolvedAppearance).toBe("light");
  });

  test("an explicit normal value remains authored when a parent later becomes compact", () => {
    const system = createAtom<ResolvedAppearance>("light");
    const parent = createThemeScope({ systemAppearance: system });
    const child = createThemeScope({ systemAppearance: system, parent: parent.effective });
    child.setAuthored({ density: "normal" });
    parent.setAuthored({ density: "compact" });
    expect(child.authored.get().density).toBe("normal");
    expect(child.effective.get().density).toBe("normal");
    child.setAuthored({ density: undefined });
    expect(child.effective.get().density).toBe("compact");
  });

  test("validates the complete authored transaction before notifying subscribers", () => {
    const scope = createThemeScope({ systemAppearance: createAtom<ResolvedAppearance>("light") });
    scope.setAuthored({ theme: "initial", locale: "fr" });
    const authored = scope.authored.get();
    const effective = scope.effective.get();
    const changes: unknown[] = [];
    const subscription = scope.effective.subscribe((value) => changes.push(value));
    try {
      const write = (patch: unknown) => Reflect.apply(scope.setAuthored, undefined, [patch]);
      for (const patch of [
        { theme: "partial", appearance: "invalid" },
        { theme: "partial", density: "dense" },
        { theme: "partial", locale: 3 },
        { theme: null },
        { appearance: false },
        { extra: true },
        { [Symbol("unknown")]: true },
        [],
        null,
      ])
        expect(() => write(patch)).toThrow(TypeError);
      expect(scope.authored.get()).toBe(authored);
      expect(scope.effective.get()).toBe(effective);
      expect(changes).toEqual([]);
      scope.setAuthored({ theme: "next", appearance: "dark", density: "compact" });
      expect(changes).toEqual([{ theme: "next", appearance: "dark", resolvedAppearance: "dark", density: "compact", locale: "fr" }]);
    } finally {
      subscription.unsubscribe();
    }
  });

  test("copies authored records, freezes snapshots and accepts data from another realm", () => {
    const scope = createThemeScope({ systemAppearance: createAtom<ResolvedAppearance>("light") });
    const values = runInNewContext('({theme:"brand",locale:"en-GB"})');
    scope.setAuthored(values);
    values.theme = "outside";
    expect(scope.authored.get().theme).toBe("brand");
    expect(Reflect.set(scope.authored.get(), "theme", "mutated")).toBe(false);
    expect(Reflect.set(scope.effective.get(), "theme", "mutated")).toBe(false);
    expect("set" in scope.authored).toBe(false);
    expect("set" in scope.effective).toBe(false);
  });

  for (const key of ["appearance", "unknown"]) {
    test(`rejects the ${key} accessor without invoking it or committing an earlier field`, () => {
      const scope = createThemeScope({ systemAppearance: createAtom<ResolvedAppearance>("light") });
      scope.setAuthored({ theme: "initial" });
      const before = scope.authored.get();
      let reads = 0;
      const patch = { theme: "partial" };
      Object.defineProperty(patch, key, {
        enumerable: true,
        get: () => {
          reads++;
          return "dark";
        },
      });
      expect(() => scope.setAuthored(patch)).toThrow(TypeError);
      expect(reads).toBe(0);
      expect(scope.authored.get()).toBe(before);
      expect(scope.effective.get().theme).toBe("initial");
    });
  }

  test("rejects non-enumerable fields without committing an earlier field", () => {
    const scope = createThemeScope({ systemAppearance: createAtom<ResolvedAppearance>("light") });
    const patch = { theme: "partial" };
    Object.defineProperty(patch, "appearance", { value: "dark", enumerable: false });
    expect(() => scope.setAuthored(patch)).toThrow(TypeError);
    expect(scope.authored.get()).toEqual({});
  });

  test("consumer disposal stops notifications without disabling later reads or subscriptions", () => {
    const system = createAtom<ResolvedAppearance>("light");
    const scope = createThemeScope({ systemAppearance: system });
    const changes: unknown[] = [];
    const subscription = scope.effective.subscribe((value) => changes.push(value));
    system.set("dark");
    expect(changes).toHaveLength(1);
    subscription.unsubscribe();
    system.set("light");
    expect(changes).toHaveLength(1);
    expect(scope.effective.get().resolvedAppearance).toBe("light");
    const reconnected = scope.effective.subscribe((value) => changes.push(value));
    system.set("dark");
    expect(changes).toHaveLength(2);
    reconnected.unsubscribe();
  });

  test("keeps authored and effective contracts distinct without requiring a named house theme", () => {
    const scope = createThemeScope({ systemAppearance: createAtom<ResolvedAppearance>("light") });
    expectTypeOf(scope.authored.get().appearance).toEqualTypeOf<"auto" | "light" | "dark" | undefined>();
    expectTypeOf(scope.effective.get().appearance).toEqualTypeOf<"auto" | "light" | "dark">();
    expectTypeOf(scope.effective.get().theme).toEqualTypeOf<string | undefined>();
    expectTypeOf(scope.effective.get().locale).toEqualTypeOf<string | undefined>();
    scope.setAuthored({ theme: "unregistered", locale: "" });
    expect(scope.effective.get().theme).toBe("unregistered");
    expect(scope.effective.get().locale).toBe("");
  });
});
