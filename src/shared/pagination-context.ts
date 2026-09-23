import { ContextConsumer, createContext } from "@lit/context";
import { createAtom, type ReadonlyAtom } from "@tanstack/lit-store";
import type { ReactiveElement } from "lit";
import type { PaginationState } from "./pagination-model";
import { StoreSelector } from "./store-connection";
export type PaginationView = PaginationState & Readonly<{ disabled: boolean; loading: boolean; getPageUrl?: (page: number) => string }>;
export type PaginationPart = { host: ReactiveElement; target(): HTMLElement | undefined; page(): number | undefined; currentOwner(): PaginationOwner | undefined; reconnect(): void };
export interface PaginationOwner {
  view: ReadonlyAtom<PaginationView>;
  register(part: PaginationPart): () => void;
  page(page: number): boolean;
  pageSize(size: number): boolean;
  recover(): void;
}
export const paginationContext = createContext<PaginationOwner>(Symbol("acme-pagination"));
const parts = new WeakMap<Element, PaginationPart>();
export const paginationPartFor = (element: Element) => parts.get(element);
export class PaginationBinding {
  private readonly owner = createAtom<{ value?: PaginationOwner }>({});
  private readonly consumer: ContextConsumer<typeof paginationContext, ReactiveElement>;
  private release?: () => void;
  readonly record: PaginationPart;
  constructor(
    private host: ReactiveElement,
    options: { target(): HTMLElement | undefined; page?(): number | undefined },
  ) {
    this.record = { host, target: options.target, page: options.page ?? (() => undefined), currentOwner: () => this.current, reconnect: () => this.reconnect() };
    parts.set(host, this.record);
    this.consumer = new ContextConsumer(host, {
      context: paginationContext,
      subscribe: true,
      callback: (owner) => {
        if (this.current === owner) return;
        this.release?.();
        this.owner.set({ value: owner });
        this.release = owner.register(this.record);
        host.requestUpdate();
      },
    });
    const view = createAtom(() => this.current?.view.get());
    new StoreSelector(host, () => view);
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
