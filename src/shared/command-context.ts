import { ContextConsumer, createContext } from "@lit/context";
import { createAtom, type ReadonlyAtom } from "@tanstack/lit-store";
import type { ReactiveElement } from "lit";
import { StoreSelector } from "./store-connection";

export type CommandPart = {
  host: ReactiveElement;
  kind: "item" | "group" | "separator";
  value(): string;
  label(): string;
  keywords(): readonly string[];
  disabled(): boolean;
  currentOwner(): CommandOwner | undefined;
  reconnect(): void;
  project?(parts: readonly CommandPart[]): void;
};
export interface CommandOwner {
  state: ReadonlyAtom<{ open: boolean; active?: CommandPart; visible: readonly CommandPart[] }>;
  register(part: CommandPart): () => void;
  highlight(part: CommandPart): void;
  canSelect(part: CommandPart): boolean;
  select(part: CommandPart): void;
}
export const commandContext = createContext<CommandOwner>(Symbol("acme-command-menu"));
const parts = new WeakMap<Element, CommandPart>(),
  roots = new WeakSet<Element>();
export const commandPartFor = (element: Element) => parts.get(element);
export const isCommandBoundary = (element: Element) => roots.has(element);
export const registerCommandBoundary = (element: Element) => roots.add(element);
export class CommandBinding {
  private readonly owner = createAtom<{ value?: CommandOwner }>({});
  readonly record: CommandPart;
  private release?: () => void;
  private readonly consumer: ContextConsumer<typeof commandContext, ReactiveElement>;
  private readonly updates: StoreSelector<unknown>;
  constructor(
    private host: ReactiveElement,
    options: Omit<CommandPart, "host" | "currentOwner" | "reconnect">,
  ) {
    this.record = { ...options, host, currentOwner: () => this.current, reconnect: () => this.reconnect() };
    parts.set(host, this.record);
    this.consumer = new ContextConsumer(host, {
      context: commandContext,
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
