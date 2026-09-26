import { expect, test } from "bun:test";
import { createThemeRegistry, type ThemeDefinition } from "../theme-registry";

const supports = (_property: string, value: string) => value !== "invalid";
test("registers immutable independent spacing and size overrides and inherits omitted categories", () => {
  const registry = createThemeRegistry(supports);
  const input = { spacing: { 2: "0.75rem" }, sizes: { 2: "2rem" } };
  const registered = registry.register("brand", input);
  input.spacing[2] = "8rem";
  expect(registered.properties["--acme-spacing-2"]).toBe("0.75rem");
  expect(registered.properties["--acme-size-2"]).toBe("2rem");
  expect(Object.keys(registered.definition)).toEqual(["sizes", "spacing"]);
  for (const object of [registered, registered.definition, registered.definition.spacing, registered.properties]) {
    expect(Object.isFrozen(object)).toBe(true);
  }
  expect(registry.get("brand")).toBe(registered);
  expect(registry.get(undefined)).toBeUndefined();
});

test("equivalent repeated definitions are harmless and conflicting replacements fail", () => {
  const registry = createThemeRegistry(supports);
  const first = registry.register("brand", { spacing: { 2: "8px", 4: "16px" }, colors: { "ds-blue-700": "blue" } });
  expect(registry.register("brand", { colors: { "ds-blue-700": "blue" }, spacing: { 4: "16px", 2: "8px" } })).toBe(first);
  expect(() => registry.register("brand", { colors: { "ds-blue-700": "red" } })).toThrow("Conflicting");
  expect(registry.get("brand")).toBe(first);
});

test("validates a complete definition before registration without invoking input accessors", () => {
  const registry = createThemeRegistry(supports);
  let invoked = false;
  const malformed: unknown[] = [
    { colors: { "ds-blue-700": "invalid" } },
    { spacing: { 13: "1rem" } },
    { unknown: {} },
    { colors: { unknown: "red" } },
    { colors: { "ds-blue-700": 2 } },
    { colors: null },
    {
      get colors() {
        invoked = true;
        return {};
      },
    },
    {
      colors: {
        get "ds-blue-700"() {
          invoked = true;
          return "red";
        },
      },
    },
  ];
  for (const value of malformed) {
    expect(() => registry.register("bad", value as ThemeDefinition)).toThrow();
    expect(() => registry.get("bad")).toThrow("before use");
  }
  expect(invoked).toBe(false);
});

test("uses token-specific native grammars including scale expressions", () => {
  const calls: string[][] = [];
  const registry = createThemeRegistry((property, value) => {
    calls.push([property, value]);
    return true;
  });
  registry.register("roles", { motion: { "ds-motion-overlay-scale": ".96", "ds-motion-popover-duration": "100ms" }, fonts: { "acme-font-sans": "serif" } });
  expect(calls).toContainEqual(["transform", "scale(.96)"]);
  expect(calls).toContainEqual(["transition-duration", "100ms"]);
  expect(calls).toContainEqual(["font-family", "serif"]);
});

test("names are exact Map keys and unknown names cannot silently select the house theme", () => {
  const registry = createThemeRegistry(supports);
  const prototypeName = registry.register("__proto__", {});
  expect(registry.get("__proto__")).toBe(prototypeName);
  expect(() => registry.get("missing")).toThrow("before use");
  for (const name of ["", " ", " brand", "brand "]) {
    expect(() => registry.register(name, {})).toThrow();
  }
});

test("motion spring tokens accept positive numeric CSS and reject nonpositive literals", () => {
  const calls: string[][] = [];
  const registry = createThemeRegistry((property, value) => {
    calls.push([property, value]);
    return true;
  });
  registry.register("spring", { motion: { "acme-motion-standard-spatial-default-stiffness": "calc(350 * 2)" } });
  expect(calls).toContainEqual(["animation-iteration-count", "calc(350 * 2)"]);
  for (const value of ["0", "-1", "infinite"]) {
    expect(() => registry.register("bad-spring", { motion: { "acme-motion-standard-spatial-default-stiffness": value } })).toThrow();
  }
});
