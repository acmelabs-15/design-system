import { ContextConsumer, createContext } from "@lit/context";
import { createAtom, type ReadonlyAtom } from "@tanstack/lit-store";
import type { ReactiveElement } from "lit";
import { StoreSelector } from "./store-connection";

export interface TimelineMember {
  host: ReactiveElement;
  currentOwner(): TimelineOwner | undefined;
  reconnect(): void;
}
export interface TimelineOwner {
  view: ReadonlyAtom<{ orientation: "vertical" | "horizontal"; members: readonly TimelineMember[] }>;
  register(member: TimelineMember): () => void;
}
export const timelineContext = createContext<TimelineOwner>(Symbol("acme-timeline"));
const members = new WeakMap<Element, TimelineMember>();
const roots = new WeakSet<Element>();
export const timelineMemberFor = (element: Element) => members.get(element);
export const isTimelineBoundary = (element: Element) => roots.has(element);
export const registerTimelineBoundary = (element: Element) => roots.add(element);
export class TimelineBinding {
  private readonly owner = createAtom<{ value?: TimelineOwner }>({});
  readonly record: TimelineMember;
  private release?: () => void;
  private consumer: ContextConsumer<typeof timelineContext, ReactiveElement>;
  private updates: StoreSelector<unknown>;
  constructor(private host: ReactiveElement) {
    this.record = { host, currentOwner: () => this.current, reconnect: () => this.reconnect() };
    members.set(host, this.record);
    this.consumer = new ContextConsumer(host, {
      context: timelineContext,
      subscribe: true,
      callback: (owner) => {
        if (owner === this.current) {
          return;
        }
        this.release?.();
        this.owner.set({ value: owner });
        this.release = owner.register(this.record);
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
