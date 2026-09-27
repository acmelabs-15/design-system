// Reactive store controllers.
//
// An element's OWN state is also a TanStack Store, created per instance, the way TanStack Form
// creates one per form and per field. It lives in the element rather than here, because it is not
// shared. See notes/decisions/state-on-tanstack-store.md for the pattern and its traps.
import type { ReactiveController, ReactiveControllerHost } from "lit";

export { batch, createStore } from "@tanstack/lit-store";
export { StoreSelector } from "./store-connection";

/** What a store gives a subscriber: a current value and a subscription. */
type Subscribable<T> = { get: () => T; subscribe: (fn: (value: T) => void) => { unsubscribe: () => void } };

/**
 * Runs a side effect when a store changes, for a consequence that is NOT a render: cancelling an
 * animation in flight, painting an attribute, writing to storage.
 *
 * `StoreSelector` is the one to reach for when a change should re-render. This is its counterpart:
 * the host stays out of the update cycle and the effect runs on the store's own notification, which
 * lands inside `setState` and so before Lit's update.
 *
 *   private settle = new StoreEffect(this, () => this.gesture, () => this.motion.cancel());
 *
 * The subscription follows the host's life, so no element keeps a `Subscription` field and a
 * `disconnectedCallback` of its own to tear one down.
 */
export class StoreEffect<T> implements ReactiveController {
  private sub?: { unsubscribe: () => void };
  constructor(
    host: ReactiveControllerHost,
    private getStore: () => Subscribable<T> | undefined,
    private run: (value: T) => void,
  ) {
    host.addController(this);
  }
  hostConnected() {
    this.sub = this.getStore()?.subscribe((v) => this.run(v));
  }
  hostDisconnected() {
    this.sub?.unsubscribe();
    this.sub = undefined;
  }
}
