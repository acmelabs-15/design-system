import { ContextConsumer, createContext } from "@lit/context";
import { createAtom, type ReadonlyAtom } from "@tanstack/lit-store";
import type { ReactiveElement } from "lit";
import { StoreSelector } from "./store-connection";
export type DialogReason = "trigger" | "escape" | "outside" | "close-control" | "selection" | "programmatic";
export type DialogFocusTarget = Element | string | undefined;
export type DialogPart = { host: ReactiveElement; kind: "trigger" | "close" | "cancel"; target(): HTMLElement | undefined; currentOwner(): DialogOwner | undefined; reconnect(): void };
export interface DialogOwner {
  host: ReactiveElement;
  state: ReadonlyAtom<{ open: boolean; alert: boolean }>;
  register(part: DialogPart): () => void;
  request(open: boolean, reason: DialogReason, opener?: HTMLElement): void;
}
export const dialogContext = createContext<DialogOwner>(Symbol("acme-dialog"));
const parts = new WeakMap<Element, DialogPart>(),
  roots = new WeakSet<Element>();
export const dialogPartFor = (element: Element) => parts.get(element);
export const isDialogBoundary = (element: Element) => roots.has(element);
export const registerDialogBoundary = (element: Element) => roots.add(element);
export class DialogBinding {
  private readonly owner = createAtom<{ value?: DialogOwner }>({});
  readonly record: DialogPart;
  private release?: () => void;
  private readonly consumer: ContextConsumer<typeof dialogContext, ReactiveElement>;
  private readonly updates: StoreSelector<unknown>;
  constructor(
    private host: ReactiveElement,
    kind: DialogPart["kind"],
    target: () => HTMLElement | undefined,
  ) {
    this.record = { host, kind, target, currentOwner: () => this.current, reconnect: () => this.reconnect() };
    parts.set(host, this.record);
    this.consumer = new ContextConsumer(host, {
      context: dialogContext,
      subscribe: true,
      callback: (owner) => {
        if (this.current === owner) return;
        this.release?.();
        this.owner.set({ value: owner });
        this.release = owner.register(this.record);
        host.requestUpdate();
      },
    });
    const state = createAtom(() => this.current?.state.get());
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
    if (this.host.isConnected) this.consumer.hostConnected();
  }
}
