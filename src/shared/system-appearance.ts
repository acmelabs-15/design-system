import { createAtom, type ReadonlyAtom } from "@tanstack/lit-store";
import type { ResolvedAppearance } from "./theme-scope";

type Observation = { appearance: ReadonlyAtom<ResolvedAppearance>; users: number; stop(): void };
const documents = new WeakMap<Document, Observation>();

export type SystemAppearanceBinding = Readonly<{ appearance: ReadonlyAtom<ResolvedAppearance>; release(): void }>;

/** Observes the supplied document while at least one consumer holds a binding. */
export function acquireSystemAppearance(document: Document): SystemAppearanceBinding {
  let observation = documents.get(document);
  if (!observation) {
    const query = document.defaultView?.matchMedia?.("(prefers-color-scheme: dark)");
    const current = (): ResolvedAppearance => (query?.matches ? "dark" : "light");
    const state = createAtom<ResolvedAppearance>(current());
    const sync = () => state.set(current());
    query?.addEventListener("change", sync);
    observation = { appearance: createAtom(() => state.get()), users: 0, stop: () => query?.removeEventListener("change", sync) };
    documents.set(document, observation);
  }
  const current = observation;
  current.users++;
  let active = true;
  return Object.freeze({
    appearance: current.appearance,
    release(): void {
      if (!active) {
        return;
      }
      active = false;
      if (--current.users === 0) {
        current.stop();
        documents.delete(document);
      }
    },
  });
}
