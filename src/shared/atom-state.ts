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
// Each instance creates its field atoms before the first update. The shared connection hook
// schedules TanStack's subscription update when the host connects.
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

import { type Atom, createAtom, TanStackStoreAtom } from "@tanstack/lit-store";
import type { ReactiveElement } from "lit";
import { connectStore } from "./store-connection";

type Host = ReactiveElement;
/** The atoms of one host, keyed by field name, so several fields on one element stay independent. */
const atoms = new WeakMap<Host, Map<PropertyKey, NamedAtom<unknown>>>();

/** Records public property changes even when an application writes the atom directly. */
class NamedAtom<T> extends TanStackStoreAtom<T> {
  private previous: T;

  constructor(
    private host: Host,
    private name: PropertyKey,
    private store: Atom<T>,
  ) {
    super(host, () => store);
    this.previous = store.get();
    const sync = (value: T) => {
      const old = this.previous;
      this.previous = value;
      if (!Object.is(old, value)) this.notify(old);
    };
    let subscription: { unsubscribe(): void } | undefined;
    host.addController({
      hostConnected: () => {
        sync(store.get());
        subscription = store.subscribe(sync);
      },
      hostDisconnected: () => {
        subscription?.unsubscribe();
        subscription = undefined;
      },
    });
    connectStore(host);
  }

  override set(value: T | ((previous: T) => T)): void {
    // An external write inside a batch may not have notified Lit yet.
    const old = this.previous;
    if (typeof value === "function") super.set(value as (previous: T) => T);
    else super.set(value);
    this.previous = this.store.get();
    this.notify(old);
  }

  private notify(old: T): void {
    this.host.requestUpdate(this.name, old);
  }
}

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
 *
 * A public property keeps Lit's metadata: put `@property({noAccessor:true, ...})` below
 * `@atomState()` so Lit registers its metadata before this decorator installs the accessor.
 */
export function atomState<T>(shared?: Atom<T>, options?: { compare?: (a: T, b: T) => boolean }) {
  return (proto: object, name: PropertyKey) => {
    // Create the atom while the element is being constructed, before Lit's first update. An atom
    // created later — on a read from render(), for a field with no initializer — registers its
    // controller after `hostUpdate` has already run for that cycle, so the controller never
    // subscribes and the element stops re-rendering for that field.
    (proto.constructor as typeof ReactiveElement).addInitializer((host) => {
      atomFor<T>(host, name, undefined as T, shared, options);
      if (shared) host.requestUpdate(name, undefined);
    });
    Object.defineProperty(proto, name, {
      configurable: true,
      enumerable: true,
      get(this: Host) {
        return atomFor<T>(this, name, undefined as T, shared, options).value;
      },
      set(this: Host, value: T) {
        const atom = atomFor<T>(this, name, value as T, shared, options);
        atom.set(() => value as T);
      },
    });
  };
}

/**
 * The atom for one field of one host, created on first touch.
 *
 * The Lit initializer creates the binding before field initialization. Constructor assignments then
 * write through that binding. A shared atom retains its current value until an explicit assignment.
 */
function atomFor<T>(host: Host, name: PropertyKey, seed: T, shared?: Atom<T>, options?: { compare?: (a: T, b: T) => boolean }): NamedAtom<T> {
  let byName = atoms.get(host);
  if (!byName) {
    byName = new Map();
    atoms.set(host, byName);
  }
  let bound = byName.get(name) as NamedAtom<T> | undefined;
  if (!bound) {
    // A shared atom is bound as it is; otherwise this instance gets one of its own.
    const store = shared ?? createAtom<T>(seed, options);
    bound = new NamedAtom(host, name, store);
    byName.set(name, bound as NamedAtom<unknown>);
  }
  return bound;
}
