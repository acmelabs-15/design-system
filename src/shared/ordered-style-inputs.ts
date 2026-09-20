import { createAtom, type ReadonlyAtom } from "@tanstack/lit-store";
import { isPlainRecord } from "./plain-record";

export type StyleInputValue = string | number | boolean | null | undefined | readonly StyleInputValue[] | { readonly [key: string]: StyleInputValue };
type StyleInputValidator = (value: unknown) => StyleInputValue;
type StyleInputValidators = Readonly<Record<string, StyleInputValidator>>;
type StyleInputKey<Validators extends StyleInputValidators> = keyof Validators & string;
type ReadonlyStyleInput<Value> = Value extends object ? { readonly [Key in keyof Value]: ReadonlyStyleInput<Value[Key]> } : Value;
type StyleInputEntry<Validators extends StyleInputValidators> = {
  [Key in StyleInputKey<Validators>]: readonly [Key, ReadonlyStyleInput<Exclude<ReturnType<Validators[Key]>, undefined>>];
}[StyleInputKey<Validators>];
type StyleInputPatch<Validators extends StyleInputValidators> = { readonly [Key in StyleInputKey<Validators>]?: unknown };

function freezeValue<Value extends StyleInputValue>(value: Value, visited = new WeakSet<object>()): Value {
  if (value !== null && typeof value === "object" && !visited.has(value)) {
    visited.add(value);
    for (const child of Object.values(value)) freezeValue(child, visited);
    Object.freeze(value);
  }
  return value;
}

/**
 * Owns canonical style values in declaration order. Validators normalize and copy their inputs.
 * Callers supply previous helper-owned keys; this layer does not own directives or DOM attributes.
 */
export function createOrderedStyleInputs<Validators extends StyleInputValidators>(definitions: Validators) {
  type Key = StyleInputKey<Validators>;
  type Entry = StyleInputEntry<Validators>;
  type StoredEntry = readonly [Key, Exclude<StyleInputValue, undefined>];
  const validators = Object.freeze({ ...definitions });
  const state = createAtom<readonly StoredEntry[]>(Object.freeze([]), {
    compare: (previous, next) => previous.length === next.length && previous.every((entry, index) => entry[0] === next[index][0] && Object.is(entry[1], next[index][1])),
  });
  // Validators establish each key's value type; freezing gives the public view its readonly shape.
  const entries = createAtom(() => state.get()) as unknown as ReadonlyAtom<readonly Entry[]>;
  function checkKey(key: string): asserts key is Key {
    if (!Object.hasOwn(validators, key)) throw new TypeError("Unknown style input: " + key);
  }
  const normalize = (key: Key, value: unknown): StoredEntry | undefined => {
    if (value === undefined) return undefined;
    const normalized = validators[key](value);
    return normalized === undefined ? undefined : Object.freeze([key, freezeValue(normalized)] as const);
  };

  return Object.freeze({
    entries,
    get<Key extends StyleInputKey<Validators>>(key: Key): ReadonlyStyleInput<ReturnType<Validators[Key]>> | undefined {
      checkKey(key);
      return state.get().find((entry) => entry[0] === key)?.[1] as ReadonlyStyleInput<ReturnType<Validators[Key]>> | undefined;
    },
    set(key: Key, value: unknown): void {
      checkKey(key);
      const entry = normalize(key, value);
      const current = state.get();
      const index = current.findIndex((item) => item[0] === key);
      if (entry === undefined) state.set(Object.freeze(current.filter((item) => item[0] !== key)));
      else if (index === -1) state.set(Object.freeze([...current, entry]));
      else state.set(Object.freeze(current.map((item, position) => (position === index ? entry : item))));
    },
    apply(inputs: StyleInputPatch<Validators>, previousKeys: readonly Key[] = []): readonly Key[] {
      if (!isPlainRecord(inputs)) {
        throw new TypeError("Style inputs must be a plain ordered object");
      }
      for (const key of previousKeys) checkKey(key);
      const keys: Key[] = [];
      for (const key of Reflect.ownKeys(inputs)) {
        if (typeof key !== "string" || !Object.prototype.propertyIsEnumerable.call(inputs, key)) throw new TypeError("Style inputs require enumerable string keys");
        checkKey(key);
        keys.push(key);
      }
      const supplied: StoredEntry[] = [];
      for (const key of keys) {
        const entry = normalize(key, inputs[key]);
        if (entry !== undefined) supplied.push(entry);
      }
      const touched = new Set([...previousKeys, ...keys]);
      const unmanaged = state.get().filter((entry) => !touched.has(entry[0]));
      state.set(Object.freeze([...unmanaged, ...supplied]));
      return Object.freeze(keys);
    },
  });
}
