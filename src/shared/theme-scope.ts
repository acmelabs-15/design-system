import { createAtom, type ReadonlyAtom } from "@tanstack/lit-store";
import { isPlainRecord } from "./plain-record";

export type ThemeAppearance = "auto" | "light" | "dark";
export type ResolvedAppearance = "light" | "dark";
export type ThemeDensity = "normal" | "compact";
export type AuthoredThemeScope = Readonly<{ theme?: string; appearance?: ThemeAppearance; density?: ThemeDensity; locale?: string }>;
export type EffectiveThemeScope = Readonly<{
  theme: string | undefined;
  appearance: ThemeAppearance;
  resolvedAppearance: ResolvedAppearance;
  density: ThemeDensity;
  locale: string | undefined;
}>;
export type ThemeScope = Readonly<{
  authored: ReadonlyAtom<AuthoredThemeScope>;
  effective: ReadonlyAtom<EffectiveThemeScope>;
  setAuthored(inputs: AuthoredThemeScope): void;
  setParent(parent: ReadonlyAtom<EffectiveThemeScope> | undefined): void;
  setSystemAppearance(systemAppearance: ReadonlyAtom<ResolvedAppearance>): void;
}>;
export type ThemeScopeSources = Readonly<{ systemAppearance: ReadonlyAtom<ResolvedAppearance>; parent?: ReadonlyAtom<EffectiveThemeScope> }>;

const sameAuthored = (previous: AuthoredThemeScope, next: AuthoredThemeScope): boolean =>
  previous.theme === next.theme && previous.appearance === next.appearance && previous.density === next.density && previous.locale === next.locale;

/** Resolves explicit scope inputs against its current parent and document system source. */
export function createThemeScope(initialSources: ThemeScopeSources): ThemeScope {
  const authoredState = createAtom<AuthoredThemeScope>(Object.freeze({}), { compare: sameAuthored });
  const sources = createAtom<ThemeScopeSources>(Object.freeze({ systemAppearance: initialSources.systemAppearance, parent: initialSources.parent }));
  const authored = createAtom(() => authoredState.get());
  const effective = createAtom<EffectiveThemeScope>(
    () => {
      const inputs = authored.get();
      const currentSources = sources.get();
      const parent = currentSources.parent?.get();
      const appearance = inputs.appearance ?? parent?.appearance ?? "auto";
      const resolvedAppearance = inputs.appearance === undefined && parent ? parent.resolvedAppearance : appearance === "auto" ? currentSources.systemAppearance.get() : appearance;
      return Object.freeze({
        theme: inputs.theme ?? parent?.theme,
        appearance,
        resolvedAppearance,
        density: inputs.density ?? parent?.density ?? "normal",
        locale: inputs.locale ?? parent?.locale,
      });
    },
    { compare: (previous, next) => sameAuthored(previous, next) && previous.resolvedAppearance === next.resolvedAppearance },
  );

  return Object.freeze({
    authored,
    effective,
    setAuthored(inputs: AuthoredThemeScope): void {
      const record: unknown = inputs;
      if (!isPlainRecord(record)) {
        throw new TypeError("Theme scope inputs must be a plain record");
      }
      const properties: { key: keyof AuthoredThemeScope; descriptor: PropertyDescriptor }[] = [];
      for (const key of Reflect.ownKeys(record)) {
        if (key !== "theme" && key !== "appearance" && key !== "density" && key !== "locale") {
          throw new TypeError("Unknown theme scope input");
        }
        const descriptor = Object.getOwnPropertyDescriptor(record, key);
        if (!descriptor?.enumerable || !Object.hasOwn(descriptor, "value")) {
          throw new TypeError("Theme scope inputs require enumerable data properties");
        }
        properties.push({ key, descriptor });
      }
      const next = { ...authoredState.get() };
      for (const { key, descriptor } of properties) {
        const value: unknown = descriptor.value;
        if (value === undefined) {
          delete next[key];
          continue;
        }
        switch (key) {
          case "theme":
          case "locale":
            if (typeof value !== "string") {
              throw new TypeError("Theme scope " + key + " must be a string");
            }
            next[key] = value;
            break;
          case "appearance":
            if (value !== "auto" && value !== "light" && value !== "dark") {
              throw new TypeError("Invalid theme appearance");
            }
            next.appearance = value;
            break;
          case "density":
            if (value !== "normal" && value !== "compact") {
              throw new TypeError("Invalid theme density");
            }
            next.density = value;
            break;
        }
      }
      authoredState.set(Object.freeze(next));
    },
    setParent(parent: ReadonlyAtom<EffectiveThemeScope> | undefined): void {
      sources.set((current) => Object.freeze({ ...current, parent }));
    },
    setSystemAppearance(systemAppearance: ReadonlyAtom<ResolvedAppearance>): void {
      sources.set((current) => Object.freeze({ ...current, systemAppearance }));
    },
  });
}
