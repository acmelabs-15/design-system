import { TanStackStoreSelector } from "@tanstack/lit-store";
import type { ReactiveControllerHost } from "lit";

const hostsWithStoreConnection = new WeakSet<ReactiveControllerHost>();

/** Schedules the update in which TanStack restores a host's store subscriptions. */
export function connectStore(host: ReactiveControllerHost): void {
  if (hostsWithStoreConnection.has(host)) return;
  hostsWithStoreConnection.add(host);
  host.addController({ hostConnected: () => host.requestUpdate() });
}

/** TanStack's selector with the shared host connection lifecycle. */
export class StoreSelector<TSource, TSelected = NoInfer<TSource>> extends TanStackStoreSelector<TSource, TSelected> {
  constructor(...args: ConstructorParameters<typeof TanStackStoreSelector<TSource, TSelected>>) {
    super(...args);
    connectStore(args[0]);
  }
}
