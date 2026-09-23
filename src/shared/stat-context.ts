import { ContextConsumer, createContext } from "@lit/context";
import { createAtom, type ReadonlyAtom } from "@tanstack/lit-store";
import type { ReactiveElement } from "lit";
import { StoreSelector } from "./store-connection";
export type StatState = Readonly<{ loading: boolean }>;
export type StatPart = { host: ReactiveElement; currentOwner(): StatOwner | undefined; reconnect(): void };
export interface StatOwner {
  state: ReadonlyAtom<StatState>;
  register(part: StatPart): () => void;
}
export const statContext = createContext<StatOwner>(Symbol("acme-stat"));
const parts = new WeakMap<Element, StatPart>(),
  roots = new WeakSet<Element>();
export const statPartFor = (element: Element) => parts.get(element);
export const isStatBoundary = (element: Element) => roots.has(element);
export const registerStatBoundary = (element: Element) => roots.add(element);
export class StatBinding {
  private readonly source = createAtom<{ value?: StatOwner }>({});
  private readonly consumer: ContextConsumer<typeof statContext, ReactiveElement>;
  private readonly updates: StoreSelector<unknown>;
  private release?: () => void;
  readonly record: StatPart;
  constructor(private host: ReactiveElement) {
    this.record = { host, currentOwner: () => this.current, reconnect: () => this.reconnect() };
    parts.set(host, this.record);
    this.consumer = new ContextConsumer(host, {
      context: statContext,
      subscribe: true,
      callback: (value) => {
        if (value === this.current) return;
        this.release?.();
        this.source.set({ value });
        this.release = value.register(this.record);
        host.requestUpdate();
      },
    });
    const state = createAtom(() => this.current?.state.get());
    this.updates = new StoreSelector(host, () => state);
    host.addController({
      hostDisconnected: () => {
        this.release?.();
        this.release = undefined;
        this.source.set({});
        this.consumer.value = undefined;
      },
    });
  }
  get current() {
    return this.source.get().value;
  }
  get loading() {
    return this.current?.state.get().loading ?? false;
  }
  reconnect() {
    this.release?.();
    this.release = undefined;
    this.source.set({});
    this.consumer.hostDisconnected();
    this.consumer.value = undefined;
    if (this.host.isConnected) this.consumer.hostConnected();
  }
}
