import { ContextConsumer, createContext } from "@lit/context";
import { createAtom, type ReadonlyAtom } from "@tanstack/lit-store";
import type { ReactiveElement } from "lit";
import { StoreSelector } from "./store-connection";
import type { ToastStore } from "./toast-store";

export type ToastPlacement = "top-start" | "top-end" | "bottom-start" | "bottom-end";
export type ToastGeometry = Readonly<{ index: number; y: number; height: number; scale: number; visible: boolean; behind: boolean }>;
export type ToastView = Readonly<{ store?: ToastStore; active: boolean; expanded: boolean; placement: ToastPlacement; geometry: ReadonlyMap<string, ToastGeometry> }>;
export type ToastPart = { host: ReactiveElement; id(): string; target(): HTMLElement | undefined; currentOwner(): ToastOwner | undefined; reconnect(): void };
export interface ToastOwner {
  view: ReadonlyAtom<ToastView>;
  register(part: ToastPart): () => void;
  measure(id: string, height: number): void;
}
export const toastContext = createContext<ToastOwner>(Symbol("acme-toast"));
const parts = new WeakMap<Element, ToastPart>();
export const toastPartFor = (element: Element) => parts.get(element);
export class ToastBinding {
  private readonly owner = createAtom<{ value?: ToastOwner }>({});
  private readonly consumer: ContextConsumer<typeof toastContext, ReactiveElement>;
  private readonly updates: StoreSelector<unknown>;
  private release?: () => void;
  readonly record: ToastPart;
  constructor(
    private host: ReactiveElement,
    id: () => string,
    target: () => HTMLElement | undefined,
  ) {
    this.record = { host, id, target, currentOwner: () => this.current, reconnect: () => this.reconnect() };
    parts.set(host, this.record);
    this.consumer = new ContextConsumer(host, {
      context: toastContext,
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
    const view = createAtom(() => this.current?.view.get());
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
    if (this.host.isConnected) {
      this.consumer.hostConnected();
    }
  }
}
