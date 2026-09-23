import { ContextConsumer, createContext } from "@lit/context";
import { createAtom, type ReadonlyAtom } from "@tanstack/lit-store";
import type { ReactiveElement } from "lit";
import { StoreSelector } from "./store-connection";
import type { Pane, Layout } from "./resizable-layout";
export type ResizableState = Readonly<{ layout: Layout; orientation: "horizontal" | "vertical"; disabled: boolean; dragging: boolean; animate: boolean; error?: string }>;
export interface ResizablePart {
  host: ReactiveElement;
  kind: "panel" | "handle";
  element(): HTMLElement | undefined;
  definition?(): Pane;
  initialCollapsed?(): boolean;
  disabled?(): boolean;
  step?(large: boolean): number;
  currentOwner(): ResizableOwner | undefined;
  reconnect(): void;
}
export interface ResizeHandleInfo {
  before?: ResizablePart;
  after?: ResizablePart;
  pivot: number;
  min: number;
  max: number;
  now: number;
  disabled: boolean;
}
export interface ResizableOwner {
  readonly state: ReadonlyAtom<ResizableState>;
  register(part: ResizablePart): () => void;
  collapse(part: ResizablePart, value: boolean): void;
  handle(part: ResizablePart): ResizeHandleInfo;
  pointer(part: ResizablePart, event: PointerEvent): void;
  key(part: ResizablePart, event: KeyboardEvent): void;
  toggle(part: ResizablePart): void;
  blur(part: ResizablePart): void;
  recover(part: ResizablePart): void;
}
export const resizableContext = createContext<ResizableOwner>(Symbol("acme-resizable"));
const parts = new WeakMap<Element, ResizablePart>();
const boundaries = new WeakSet<Element>();
export const resizablePartFor = (element: Element) => parts.get(element);
export const resizableBoundary = (element: Element) => boundaries.has(element);
export const markResizableBoundary = (element: Element) => boundaries.add(element);
export class ResizablePartBinding {
  private readonly owner = createAtom<{ value?: ResizableOwner }>({});
  readonly record: ResizablePart;
  private release?: () => void;
  private readonly consumer: ContextConsumer<typeof resizableContext, ReactiveElement>;
  private readonly updates: StoreSelector<ResizableState | undefined>;
  constructor(
    private host: ReactiveElement,
    options: Omit<ResizablePart, "host" | "currentOwner" | "reconnect">,
  ) {
    this.record = { ...options, host, currentOwner: () => this.current, reconnect: () => this.reconnect() };
    parts.set(host, this.record);
    this.consumer = new ContextConsumer(host, {
      context: resizableContext,
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
