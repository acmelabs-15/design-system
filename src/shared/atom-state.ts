// `@atomState()` — an element's own reactive state, held in a TanStack Store atom.
//
// This is the shape Peter's rule asks for (any state management here uses TanStack Store) written so
// that using it costs no more than the `@state()` it replaces. Declare a field, read and write it as
// a field, and the atom, its subscription and its teardown are handled underneath:
//
//   class AcmeThing extends AcmeElement {
//     @atomState() private open = false;
//     toggle() { this.open = !this.open; }         // writes the atom, re-renders the element
//   }
//
// One atom per instance, created on first access, the way TanStack Form creates a store per form and
// per field. `TanStackStoreAtom` wraps `TanStackStoreSelector`, so this inherits the `hostConnected`
// patch in patches/ — without it an element moved in the DOM stops following its own state.
//
// Derived state stays explicit. A value computed from two fields is a derived store, because that is
// the thing a plain field cannot express and the reason the rule is worth following:
//
//   private shown = createStore(() => this.open && !this.disabled);
//
// Two compiler settings this depends on, both load-bearing rather than incidental:
//
//   `experimentalDecorators: true` — this is written for that flavour only, where a decorator sees
//   the prototype and the field name. Lit overloads its own decorators to accept both flavours; a
//   move to standard decorators needs the accessor-decorator signature ADDED beside this one, using
//   the `accessor` keyword, not this one rewritten.
//
//   `useDefineForClassFields: false` — under define semantics a class field installs an own data
//   property on the instance, which shadows the prototype accessor this decorator defines, and the
//   field silently stops being reactive. Verified, not assumed.
//
// Equality is the atom's own, which is identity: an object mutated in place does not re-render.
// Pass `shallow` from the store package for a field holding an object the element rebuilds.
import type { ReactiveControllerHost, ReactiveElement } from "lit";
import { type Atom, createAtom, TanStackStoreAtom } from "@tanstack/lit-store";

type Host = ReactiveControllerHost & object;
/** The atoms of one host, keyed by field name, so several fields on one element stay independent. */
const atoms = new WeakMap<Host, Map<PropertyKey, TanStackStoreAtom<unknown>>>();

/**
 * A reactive field backed by an atom. Reads and writes look like a plain field; the element
 * re-renders when the value changes.
 *
 * With no argument the atom is created per instance, so each element has its own. Passing an atom
 * binds the field to that one instead, which is how several elements follow one value:
 *
 *   const name = createAtom("Ada");
 *   class NameField extends AcmeElement {
 *     `@atomState`(name) private name!: string;   // every instance reads and writes the same atom
 *   }
 *
 * `compare` sets the equality the atom uses to decide whether anything changed. It defaults to
 * identity, so an object mutated in place does not re-render; pass `shallow` from the store package
 * for a field that holds an object it rebuilds.
 */
export function atomState<T>(shared?: Atom<T>, options?: { compare?: (a: T, b: T) => boolean }) {
  return (proto: object, name: PropertyKey) => {
    // Create the atom while the element is being constructed, before Lit's first update. An atom
    // created later — on a read from render(), for a field with no initializer — registers its
    // controller after `hostUpdate` has already run for that cycle, so the controller never
    // subscribes and the element stops re-rendering for that field.
    (proto.constructor as typeof ReactiveElement).addInitializer((host) => {
      atomFor<T>(host as Host, name, undefined as T, shared, options);
    });
    Object.defineProperty(proto, name, {
      configurable: true,
      enumerable: true,
      get(this: Host) {
        return atomFor<T>(this, name, undefined as T, shared, options).value;
      },
      set(this: Host, value: T) {
        atomFor<T>(this, name, value as T, shared, options).set(() => value as T);
      },
    });
  };
}

/**
 * The atom for one field of one host, created on first touch.
 *
 * A field's initial value is assigned in the constructor, which reaches the setter before any read,
 * so the first write seeds the atom rather than overwriting a default. That is why the setter passes
 * its value in: creating the atom empty and setting it immediately would notify a subscriber that
 * does not exist yet, and leave the atom's own equality check with nothing to compare against.
 */
function atomFor<T>(host: Host, name: PropertyKey, seed: T, shared?: Atom<T>, options?: { compare?: (a: T, b: T) => boolean }): TanStackStoreAtom<T> {
  let byName = atoms.get(host);
  if (!byName) atoms.set(host, (byName = new Map()));
  let bound = byName.get(name) as TanStackStoreAtom<T> | undefined;
  if (!bound) {
    // A shared atom is bound as it is; otherwise this instance gets one of its own.
    const store = shared ?? createAtom(seed, options as never);
    bound = new TanStackStoreAtom(host, () => store);
    byName.set(name, bound as TanStackStoreAtom<unknown>);
  }
  return bound;
}
