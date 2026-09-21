import { isPlainRecord } from "./plain-record";
import { type ThemeDefinition, themeTokenDefinitions } from "./theme-tokens";

export type RegisteredTheme = Readonly<{
  name: string;
  definition: ThemeDefinition;
  properties: Readonly<Record<string, string>>;
}>;
type Supports = (property: string, value: string) => boolean;

function dataEntries(value: unknown): readonly (readonly [string, unknown])[] {
  if (!isPlainRecord(value)) throw new TypeError("Theme definitions require plain records");
  return Reflect.ownKeys(value).map((key) => {
    const descriptor = Object.getOwnPropertyDescriptor(value, key)!;
    if (typeof key !== "string" || !descriptor.enumerable || !Object.hasOwn(descriptor, "value")) throw new TypeError("Theme definitions require enumerable data properties");
    return [key, descriptor.value] as const;
  });
}

/** Owns immutable definitions independently of DOM scope selection. */
export function createThemeRegistry(supports: Supports) {
  const themes = new Map<string, RegisteredTheme>();
  const categories = new Set(["colors", "fonts", "fontSizes", "fontWeights", "lineHeights", "spacing", "sizes", "radii", "shadows", "motion"]);
  const tokens = new Map(themeTokenDefinitions.map((token) => [token.category + ":" + token.key, token]));
  return Object.freeze({
    register(name: string, input: ThemeDefinition): RegisteredTheme {
      if (typeof name !== "string" || !name.trim() || name.trim() !== name) throw new TypeError("Theme names must be nonempty strings without surrounding whitespace");
      const definition: Record<string, Readonly<Record<string, string>>> = {};
      const properties: Record<string, string> = {};
      for (const [category, values] of [...dataEntries(input)].sort(([a], [b]) => a.localeCompare(b))) {
        if (!categories.has(category)) throw new TypeError("Unknown theme category: " + category);
        if (values === undefined) continue;
        const entries: [string, string][] = [];
        for (const [key, raw] of [...dataEntries(values)].sort(([a], [b]) => a.localeCompare(b))) {
          const token = tokens.get(category + ":" + key);
          if (!token) throw new TypeError("Unknown theme token: " + category + "." + key);
          if (raw === undefined) continue;
          if (typeof raw !== "string" || !raw.trim()) throw new TypeError("Theme token values must be nonempty CSS strings");
          const value = raw.trim();
          const valid = token.syntax === "scale-factor" ? supports("transform", `scale(${value})`) : supports(token.syntax, value);
          if (!valid) throw new TypeError("Invalid CSS for theme token: " + category + "." + key);
          entries.push([key, value]);
          properties[token.cssProperty] = value;
        }
        if (entries.length) definition[category] = Object.freeze(Object.fromEntries(entries));
      }
      const previous = themes.get(name);
      if (previous) {
        if (JSON.stringify(previous.definition) !== JSON.stringify(definition)) throw new Error("Conflicting theme registration: " + name);
        return previous;
      }
      const theme = Object.freeze({ name, definition: Object.freeze(definition) as ThemeDefinition, properties: Object.freeze(properties) });
      themes.set(name, theme);
      return theme;
    },
    get(name: string | undefined): RegisteredTheme | undefined {
      if (name === undefined) return undefined;
      const theme = themes.get(name);
      if (!theme) throw new Error("Theme must be registered before use: " + name);
      return theme;
    },
  });
}

const registry = createThemeRegistry((property, value) => {
  if (!globalThis.CSS?.supports) throw new Error("Theme registration requires native CSS grammar support");
  return CSS.supports(property, value);
});

/** Register a complete or partial named theme before a scope uses it. */
export const registerTheme = registry.register;
/** Resolve an immutable definition; an omitted name selects the house theme. */
export const getTheme = registry.get;
export type { ThemeDefinition } from "./theme-tokens";
