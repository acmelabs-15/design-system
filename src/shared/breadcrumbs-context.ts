import { ContextConsumer, createContext } from "@lit/context";
import { createAtom, type ReadonlyAtom } from "@tanstack/lit-store";
import type { ReactiveElement } from "lit";
import { StoreSelector } from "./store-connection";
export interface BreadcrumbMember {
  host: ReactiveElement;
  currentOwner(): BreadcrumbOwner | undefined;
  reconnect(): void;
}
export interface BreadcrumbOwner {
  members: ReadonlyAtom<readonly BreadcrumbMember[]>;
  register(member: BreadcrumbMember): () => void;
}
export const breadcrumbsContext = createContext<BreadcrumbOwner>(Symbol("acme-breadcrumbs"));
const members = new WeakMap<Element, BreadcrumbMember>();
const roots = new WeakSet<Element>();
export const breadcrumbFor = (element: Element) => members.get(element);
export const isBreadcrumbsBoundary = (element: Element) => roots.has(element);
export const registerBreadcrumbsBoundary = (element: Element) => roots.add(element);
export class BreadcrumbBinding {
  private readonly owner = createAtom<{ value?: BreadcrumbOwner }>({});
  readonly record: BreadcrumbMember;
  private release?: () => void;
  private readonly consumer: ContextConsumer<typeof breadcrumbsContext, ReactiveElement>;
  private readonly updates: StoreSelector<unknown>;
  constructor(private host: ReactiveElement) {
    this.record = { host, currentOwner: () => this.current, reconnect: () => this.reconnect() };
    members.set(host, this.record);
    this.consumer = new ContextConsumer(host, {
      context: breadcrumbsContext,
      subscribe: true,
      callback: (owner) => {
        if (owner === this.current) return;
        this.release?.();
        this.owner.set({ value: owner });
        this.release = owner.register(this.record);
      },
    });
    const view = createAtom(() => this.current?.members.get());
    this.updates = new StoreSelector(host, () => view);
    host.addController({
      hostDisconnected: () => {
        this.release?.();
        this.release = undefined;
        this.owner.set({});
        this.consumer.value = undefined;
      },
    });
  }
  get current() {
    return this.owner.get().value;
  }
  reconnect() {
    this.release?.();
    this.release = undefined;
    this.owner.set({});
    this.consumer.hostDisconnected();
    this.consumer.value = undefined;
    if (this.host.isConnected) this.consumer.hostConnected();
  }
}
