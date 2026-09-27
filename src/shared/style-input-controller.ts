import type { ReadonlyAtom } from "@tanstack/lit-store";
import type { ReactiveElement } from "lit";
import { createOrderedStyleInputs } from "./ordered-style-inputs";
import type { ResponsiveInput } from "./responsive";
import { copyResponsiveInput, parseResponsiveAttribute, type ResponsiveAttributeDiagnostic } from "./responsive-input";
import { StoreSelector } from "./store-connection";
import { attachStyleInputTarget } from "./style-input-binding";
import { isAuthoredStyleScalar, isStyleScalar, type StyleDisplayMode, type StyleInputKey, type StyleScalar, type StyleSupports, styleInputSchema } from "./style-input-schema";

type Validators<Key extends StyleInputKey> = { [Property in Key]: (value: unknown) => ResponsiveInput<StyleScalar<Property>> };
type Entry<Key extends StyleInputKey> = { [Property in Key]: readonly [Property, Exclude<ResponsiveInput<StyleScalar<Property>>, undefined>] }[Key];
type Options<Key extends StyleInputKey> = Readonly<{
  supports: StyleSupports;
  displayModes?: readonly StyleDisplayMode[];
  diagnostic?: (diagnostic: ResponsiveAttributeDiagnostic & Readonly<{ property: Key; attribute: string }>) => void;
}>;

/**
 * Construct once during host construction. Host accessors delegate to get/set; its composed
 * observedAttributes and attributeChangedCallback forward the schema's attribute names here.
 * Keep these accessors out of Lit property metadata so own-property order survives upgrade.
 * Property/attribute annotations for generated documentation belong to the host's declarations.
 */
export class StyleInputController<Key extends StyleInputKey> {
  private readonly values: ReturnType<typeof createOrderedStyleInputs<Validators<Key>>>;
  private readonly attributes = new Map<string, Key>();
  private readonly initialAttributes = new Map<string, string>();
  private readonly scalar: (key: Key) => (value: unknown) => value is StyleScalar<Key>;
  private readonly diagnostic: Options<Key>["diagnostic"];

  constructor(host: ReactiveElement, properties: readonly Key[], options: Options<Key>) {
    const hostClass = host.constructor as typeof ReactiveElement;
    for (const property of properties) {
      if (!Object.hasOwn(styleInputSchema, property)) {
        throw new TypeError("Unknown style input: " + property);
      }
      if (hostClass.elementProperties.has(property)) {
        throw new TypeError("Style inputs must stay outside Lit property metadata: " + property);
      }
      this.attributes.set(styleInputSchema[property].attribute, property);
    }
    const selected = new Set(properties);
    const supports = options.supports;
    const displayModes = options.displayModes && Object.freeze([...options.displayModes]);
    this.scalar =
      (key) =>
      (value): value is StyleScalar<Key> =>
        isStyleScalar(key, value, supports, displayModes);
    this.diagnostic = options.diagnostic;
    const validators = Object.fromEntries(
      properties.map((key) => [key, (value: unknown) => copyResponsiveInput(value, (leaf): leaf is StyleScalar<Key> => isAuthoredStyleScalar(key, leaf, supports, displayModes))]),
    ) as Validators<Key>;
    this.values = createOrderedStyleInputs(validators);

    const own = Reflect.ownKeys(host)
      .filter((key): key is Key => typeof key === "string" && selected.has(key as Key))
      .map((key) => {
        const descriptor = Object.getOwnPropertyDescriptor(host, key)!;
        if (!descriptor.configurable || !Object.hasOwn(descriptor, "value")) {
          throw new TypeError("Pre-upgrade style inputs must be configurable data properties: " + key);
        }
        return [key, descriptor.value] as const;
      });
    for (const attribute of host.attributes) {
      if (!this.attributes.has(attribute.name)) {
        continue;
      }
      this.initialAttributes.set(attribute.name, attribute.value);
      this.readAttribute(attribute.name, attribute.value);
    }
    for (const [key, value] of own) {
      this.values.set(key, value);
    }
    for (const [key] of own) {
      Reflect.deleteProperty(host, key);
    }
    new StoreSelector(host, () => this.values.entries);
    attachStyleInputTarget(host, (inputs, previousKeys) => this.apply(inputs, previousKeys as readonly Key[]), properties);
  }

  get entries(): ReadonlyAtom<readonly Entry<Key>[]> {
    return this.values.entries as unknown as ReadonlyAtom<readonly Entry<Key>[]>;
  }

  get<Property extends Key>(property: Property): ResponsiveInput<StyleScalar<Property>> {
    return this.values.get(property) as ResponsiveInput<StyleScalar<Property>>;
  }

  set(property: Key, value: unknown): void {
    this.values.set(property, value);
  }

  apply(inputs: Readonly<{ [Property in Key]?: unknown }>, previousKeys: readonly Key[] = []): readonly Key[] {
    return this.values.apply(inputs, previousKeys);
  }

  /** Returns false for attributes that belong to another host behavior. */
  attributeChanged(name: string, oldValue: string | null, value: string | null): boolean {
    if (!this.attributes.has(name)) {
      return false;
    }
    // Each queued upgrade callback consumes only its own captured value. Reentrant changes can
    // arrive before other initial callbacks, or connect the host before an outer callback returns.
    if (oldValue === null && this.initialAttributes.get(name) === value) {
      this.initialAttributes.delete(name);
      return true;
    }
    this.readAttribute(name, value);
    return true;
  }

  private readAttribute(name: string, value: string | null): void {
    const property = this.attributes.get(name)!;
    const result = parseResponsiveAttribute(value, this.scalar(property), { numbers: styleInputSchema[property].numeric !== "none" });
    this.values.set(property, result.value);
    if (result.diagnostic) {
      this.diagnostic?.({ ...result.diagnostic, property, attribute: name });
    }
  }
}
