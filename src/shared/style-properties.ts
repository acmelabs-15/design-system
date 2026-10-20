import type { CSSResult, CSSResultGroup } from "lit";

type StyleProperty = { name: string; syntax: string; inherits: boolean; initialValue?: string };
type PropertyRegistry = { registerProperty(property: StyleProperty): void };
const definitions = new WeakMap<CSSResult, readonly StyleProperty[]>();
const registered = new WeakMap<PropertyRegistry, Map<string, string>>();
const signature = (property: StyleProperty) => JSON.stringify([property.syntax, property.inherits, property.initialValue]);

/** Associates generated defaults with a stylesheet without changing a document. */
export function withStyleProperties(style: CSSResult, properties: readonly StyleProperty[]): CSSResult {
  definitions.set(
    style,
    properties.map((property) => ({ ...property })),
  );
  return style;
}

/** Installs the defaults used by these styles in the component's document registry. */
export function registerStyleProperties(styles: CSSResultGroup | undefined, registry: PropertyRegistry | undefined): void {
  if (!registry || typeof registry.registerProperty !== "function") {
    return;
  }
  const known = registered.get(registry) ?? new Map<string, string>();
  const pending = new Map<string, StyleProperty>();
  const collect = (group: CSSResultGroup | undefined): void => {
    if (!group) {
      return;
    }
    if (Array.isArray(group)) {
      for (const style of group) {
        collect(style);
      }
      return;
    }
    for (const property of definitions.get(group as CSSResult) ?? []) {
      const previous = pending.get(property.name);
      const expected = previous ? signature(previous) : known.get(property.name);
      if (expected !== undefined && expected !== signature(property)) {
        throw new Error("Conflicting CSS registration: " + property.name);
      }
      if (!known.has(property.name)) {
        pending.set(property.name, property);
      }
    }
  };
  collect(styles);
  for (const property of pending.values()) {
    try {
      registry.registerProperty(property);
    } catch (error) {
      if (!error || typeof error !== "object" || !("name" in error) || error.name !== "InvalidModificationError") {
        throw error;
      }
    }
    known.set(property.name, signature(property));
    registered.set(registry, known);
  }
}
