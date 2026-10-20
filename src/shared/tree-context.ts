import { ContextConsumer, createContext } from "@lit/context";
import { createAtom, type ReadonlyAtom } from "@tanstack/lit-store";
import type { ReactiveElement } from "lit";
import { StoreSelector } from "./store-connection";
import type { TreeEntry } from "./tree-model";

export type TreePart = { host: ReactiveElement; value(): string; disabled(): boolean; currentOwner(): TreeOwner | undefined; reconnect(): void };
export type TreeViewState = Readonly<{ entries: readonly TreeEntry[]; expanded: readonly string[]; value?: string; selection: "none" | "single"; disabled: boolean }>;
export interface TreeOwner {
  state: ReadonlyAtom<TreeViewState>;
  register(part: TreePart): () => void;
}
export const treeContext = createContext<TreeOwner>(Symbol("acme-tree-view"));
const parts = new WeakMap<Element, TreePart>();
export const treePartFor = (element: Element) => parts.get(element);
export class TreeBinding {
  private readonly owner = createAtom<{ value?: TreeOwner }>({});
  private release?: () => void;
  private readonly consumer: ContextConsumer<typeof treeContext, ReactiveElement>;
  private readonly updates: StoreSelector<unknown>;
  readonly record: TreePart;
  constructor(
    private host: ReactiveElement,
    read: Pick<TreePart, "value" | "disabled">,
  ) {
    this.record = { host, ...read, currentOwner: () => this.current, reconnect: () => this.reconnect() };
    parts.set(host, this.record);
    this.consumer = new ContextConsumer(host, {
      context: treeContext,
      subscribe: true,
      callback: (owner) => {
        if (owner === this.current) {
          return;
        }
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
    if (this.host.isConnected) {
      this.consumer.hostConnected();
    }
  }
}
