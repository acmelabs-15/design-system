import { ContextConsumer, createContext } from "@lit/context";
import { createAtom, type ReadonlyAtom } from "@tanstack/lit-store";
import type { ReactiveElement } from "lit";
import { StoreSelector } from "./store-connection";

export type SidebarView = Readonly<{ mobile: boolean; expanded: boolean; mobileOpen: boolean; collapsible: boolean }>;
export type SidebarPart = { host: ReactiveElement; kind: "trigger" | "content"; target(): HTMLElement | undefined; currentOwner(): SidebarOwner | undefined; reconnect(): void };
export interface SidebarOwner {
  host: ReactiveElement;
  view: ReadonlyAtom<SidebarView>;
  register(part: SidebarPart): () => void;
  toggle(opener?: HTMLElement): void;
}
export const sidebarContext = createContext<SidebarOwner>(Symbol("acme-sidebar"));
const parts = new WeakMap<Element, SidebarPart>(),
  roots = new WeakSet<Element>();
export const sidebarPartFor = (element: Element) => parts.get(element);
export const isSidebarBoundary = (element: Element) => roots.has(element);
export const registerSidebarBoundary = (element: Element) => roots.add(element);
export class SidebarBinding {
  private readonly owner = createAtom<{ value?: SidebarOwner }>({});
  private release?: () => void;
  readonly record: SidebarPart;
  private readonly consumer: ContextConsumer<typeof sidebarContext, ReactiveElement>;
  private readonly updates: StoreSelector<unknown>;
  constructor(
    private host: ReactiveElement,
    kind: SidebarPart["kind"],
    target: () => HTMLElement | undefined,
  ) {
    this.record = { host, kind, target, currentOwner: () => this.current, reconnect: () => this.reconnect() };
    parts.set(host, this.record);
    this.consumer = new ContextConsumer(host, {
      context: sidebarContext,
      subscribe: true,
      callback: (owner) => {
        if (this.current === owner) {
          return;
        }
        this.release?.();
        this.owner.set({ value: owner });
        this.release = owner.register(this.record);
        host.requestUpdate();
      },
    });
    const state = createAtom(() => this.current?.view.get());
    this.updates = new StoreSelector(host, () => state);
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
    if (this.host.isConnected) {
      this.consumer.hostConnected();
    }
  }
}
