import { createAtom, type ReadonlyAtom } from "@tanstack/lit-store";

export type AppearanceDefaults = Readonly<{ size?: string; variant?: string }>;
type AppearanceDefinition<Value extends string> = Readonly<{ supported: readonly Value[]; defaultValue: NoInfer<Value> }>;
type AuthoredAppearance<Size extends string, Variant extends string> = Readonly<{ size?: Size; variant?: Variant }>;
type EffectiveAppearance<Size extends string, Variant extends string> = Readonly<{ size: Size | undefined; variant: Variant | undefined }>;
export type AppearanceDiagnostic = Readonly<{
  code: "unsupported-inherited-value";
  property: "size" | "variant";
  value: string;
  supported: readonly string[];
}>;
export type InheritedAppearance<Size extends string, Variant extends string> = Readonly<{
  authored: ReadonlyAtom<AuthoredAppearance<Size, Variant>>;
  effective: ReadonlyAtom<EffectiveAppearance<Size, Variant>>;
  diagnostics: ReadonlyAtom<readonly AppearanceDiagnostic[]>;
  setAuthored(inputs: AuthoredAppearance<Size, Variant>): void;
  setProvider(source: ReadonlyAtom<AppearanceDefaults> | undefined): void;
}>;

function ownDefinition<Value extends string>(definition: AppearanceDefinition<Value> | undefined): AppearanceDefinition<Value> | undefined {
  if (!definition) return undefined;
  return Object.freeze({ supported: Object.freeze([...definition.supported]), defaultValue: definition.defaultValue });
}

/**
 * Resolves a child's named appearance from its authored inputs and current Group defaults.
 * The consumer validates child enum values and supplies the nearest participating provider.
 * Subscriptions belong to consumers; this module owns no DOM lookup or connection effects.
 */
export function createInheritedAppearance<Size extends string = never, Variant extends string = never>(
  definitions: {
    size?: AppearanceDefinition<Size>;
    variant?: AppearanceDefinition<Variant>;
  },
  fallback?: ReadonlyAtom<AppearanceDefaults>,
): InheritedAppearance<Size, Variant> {
  const size = ownDefinition(definitions.size);
  const variant = ownDefinition(definitions.variant);
  const authoredState = createAtom<AuthoredAppearance<Size, Variant>>(Object.freeze({}));
  const provider = createAtom<{ source?: ReadonlyAtom<AppearanceDefaults> }>({});
  const authored = createAtom(() => authoredState.get());
  const resolution = createAtom(() => {
    const inputs = authored.get();
    const needsProvider = (size !== undefined && inputs.size === undefined) || (variant !== undefined && inputs.variant === undefined);
    const inherited = needsProvider ? provider.get().source?.get() : undefined;
    const diagnostics: AppearanceDiagnostic[] = [];
    const resolve = <Value extends string>(property: "size" | "variant", definition: AppearanceDefinition<Value> | undefined, input: Value | undefined): Value | undefined => {
      if (!definition) return undefined;
      if (input !== undefined) return input;
      const value = inherited?.[property] ?? fallback?.get()[property];
      if (value === undefined) return definition.defaultValue;
      const supported = definition.supported.find((candidate) => candidate === value);
      if (supported !== undefined) return supported;
      diagnostics.push(Object.freeze({ code: "unsupported-inherited-value", property, value, supported: definition.supported }));
      return definition.defaultValue;
    };
    const effective: EffectiveAppearance<Size, Variant> = Object.freeze({ size: resolve("size", size, inputs.size), variant: resolve("variant", variant, inputs.variant) });
    return Object.freeze({ effective, diagnostics: Object.freeze(diagnostics) });
  });
  const effective = createAtom(() => resolution.get().effective, { compare: (previous, next) => previous.size === next.size && previous.variant === next.variant });
  const diagnostics = createAtom(() => resolution.get().diagnostics, {
    compare: (previous, next) => previous.length === next.length && previous.every((item, index) => item.property === next[index].property && item.value === next[index].value),
  });

  return Object.freeze({
    authored,
    effective,
    diagnostics,
    setAuthored(inputs: AuthoredAppearance<Size, Variant>): void {
      const next = { ...authoredState.get() };
      if (Object.hasOwn(inputs, "size")) {
        if (inputs.size === undefined) delete next.size;
        else next.size = inputs.size;
      }
      if (Object.hasOwn(inputs, "variant")) {
        if (inputs.variant === undefined) delete next.variant;
        else next.variant = inputs.variant;
      }
      authoredState.set(Object.freeze(next));
    },
    setProvider(source: ReadonlyAtom<AppearanceDefaults> | undefined): void {
      provider.set({ source });
    },
  });
}
