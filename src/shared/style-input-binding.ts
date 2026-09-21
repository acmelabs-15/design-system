import { isPlainRecord } from "./plain-record";
import type { ResponsiveInput, ResponsiveScalar } from "./responsive";
import { copyResponsiveInput } from "./responsive-input";
import { type StyleInputKey, type StyleScalar, styleInputSchema } from "./style-input-schema";

export type StyleInputs = Readonly<{ [Key in StyleInputKey]?: ResponsiveInput<StyleScalar<Key>> }>;
type Patch = Readonly<Partial<Record<StyleInputKey, ResponsiveInput<ResponsiveScalar>>>>;
type Apply = (inputs: Patch, previousKeys: readonly StyleInputKey[]) => void;
type Ownership = { owner?: object; revision: number };
type Binding = {
  apply?: Apply;
  owners: Map<StyleInputKey, Ownership>;
  pending: Map<StyleInputKey, ResponsiveInput<ResponsiveScalar>>;
  revision: number;
};
const targets = new WeakMap<Element, Binding>();

function targetBinding(target: Element): Binding {
  let binding = targets.get(target);
  if (!binding) {
    binding = { owners: new Map(), pending: new Map(), revision: 0 };
    targets.set(target, binding);
  }
  return binding;
}

function snapshot(inputs: StyleInputs): Patch {
  if (!isPlainRecord(inputs)) throw new TypeError("Style inputs must be a plain ordered object");
  const entries = Reflect.ownKeys(inputs).map((key) => {
    if (typeof key !== "string" || !Object.hasOwn(styleInputSchema, key)) throw new TypeError("Unknown style input");
    const descriptor = Object.getOwnPropertyDescriptor(inputs, key)!;
    if (!descriptor.enumerable || !Object.hasOwn(descriptor, "value")) throw new TypeError("Style inputs require enumerable data properties");
    const value = copyResponsiveInput(descriptor.value, (leaf): leaf is ResponsiveScalar => ["string", "number", "boolean"].includes(typeof leaf));
    return [key, value] as const;
  });
  return Object.freeze(Object.fromEntries(entries));
}

/** Connects the actual target instance, independent of its registry or current document. */
export function attachStyleInputTarget(target: Element, apply: Apply): void {
  const binding = targetBinding(target);
  if (binding.apply) throw new TypeError("A style input controller is already attached to this target");
  binding.apply = apply;
  try {
    if (binding.pending.size) apply(Object.fromEntries(binding.pending), []);
    binding.pending.clear();
  } catch (error) {
    binding.apply = undefined;
    throw error;
  }
}

/** Applies one helper owner's current inputs. An empty input clears only its still-owned keys. */
export function applyStyleInputBinding(target: Element, owner: object, inputs: StyleInputs): void {
  const patch = snapshot(inputs);
  const keys = Object.keys(patch) as StyleInputKey[];
  const binding = targetBinding(target);
  const previous = [...binding.owners].filter(([, value]) => value.owner === owner).map(([key]) => key);
  const revision = ++binding.revision;
  const touched = new Set([...previous, ...keys]);
  const before = new Map([...touched].map((key) => [key, binding.owners.get(key)]));
  // Ownership must be visible while canonical state synchronously notifies subscribers.
  for (const key of previous) binding.owners.set(key, { revision });
  for (const key of keys) binding.owners.set(key, { owner, revision });
  try {
    if (binding.apply) {
      binding.apply(patch, previous);
    } else {
      // One latest value or clear marker per schema key; no registry promises or callback queues.
      const pending = new Map(binding.pending);
      for (const key of previous) {
        pending.delete(key);
        pending.set(key, undefined);
      }
      for (const key of keys) {
        pending.delete(key);
        pending.set(key, patch[key]);
      }
      binding.pending = pending;
    }
  } catch (error) {
    for (const [key, ownership] of before) {
      if (binding.owners.get(key)?.revision !== revision) continue;
      if (ownership) binding.owners.set(key, ownership);
      else binding.owners.delete(key);
    }
    throw error;
  }
}
