import { ContextConsumer, createContext } from "@lit/context";
import { createAtom, type ReadonlyAtom } from "@tanstack/lit-store";
import type { ReactiveElement } from "lit";
import { StoreSelector } from "./store-connection";
import type { ScrollGeometry } from "./scroll-geometry";

export type ScrollAxis = "horizontal" | "vertical";
export type ScrollState = Readonly<{
  x: ScrollGeometry;
  y: ScrollGeometry;
  hover: boolean;
  scrolling: boolean;
  focus: boolean;
  dragging: boolean;
  rtl: boolean;
  visibility: "hover" | "always";
  orientation: ScrollAxis | "both";
}>;
export interface ScrollPart {
  host: ReactiveElement;
  kind: "viewport" | "bar" | "corner" | "button";
  element(): HTMLElement | undefined;
  content?(): HTMLElement | undefined;
  axis?(): ScrollAxis;
  currentOwner(): ScrollOwner | undefined;
  reconnect(): void;
}
export interface ScrollOwner {
  readonly state: ReadonlyAtom<ScrollState>;
  register(part: ScrollPart): () => void;
  refresh(): void;
  viewport(): HTMLElement | undefined;
  dragging(value: boolean): void;
}
export const scrollContext = createContext<ScrollOwner>(Symbol("acme-scroll-area"));
const parts = new WeakMap<Element, ScrollPart>();
const boundaries = new WeakSet<Element>();
export const scrollPartFor = (element: Element) => parts.get(element);
export const scrollBoundary = (element: Element) => boundaries.has(element);
export const markScrollBoundary = (element: Element) => boundaries.add(element);
/** Binds an explicit part to its nearest composed scroll owner. */
export class ScrollPartBinding {
  readonly owner = createAtom<{ value?: ScrollOwner }>({});
  readonly record: ScrollPart;
  private release?: () => void;
  private consumer: ContextConsumer<typeof scrollContext, ReactiveElement>;
  private updates: StoreSelector<ScrollState | undefined>;
  constructor(
    private host: ReactiveElement,
    options: Omit<ScrollPart, "host" | "currentOwner" | "reconnect">,
  ) {
    this.record = { ...options, host, currentOwner: () => this.owner.get().value, reconnect: () => this.reconnect() };
    parts.set(host, this.record);
    this.consumer = new ContextConsumer(host, {
      context: scrollContext,
      subscribe: true,
      callback: (owner) => {
        if (this.owner.get().value === owner) {
          return;
        }
        this.release?.();
        this.owner.set({ value: owner });
        this.release = owner.register(this.record);
        host.requestUpdate();
      },
    });
    const state = createAtom(() => this.owner.get().value?.state.get());
    this.updates = new StoreSelector(host, () => state);
    host.addController({
      hostDisconnected: () => {
        this.release?.();
        this.release = undefined;
        this.owner.set({});
        this.consumer.value = undefined;
      },
      hostUpdated: () => this.owner.get().value?.refresh(),
    });
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
  get current() {
    return this.owner.get().value;
  }
}
export type ScrollbarState = Readonly<{ axis: ScrollAxis; geometry: ScrollGeometry }>;
export const scrollbarContext = createContext<ReadonlyAtom<ScrollbarState>>(Symbol("acme-scrollbar"));
