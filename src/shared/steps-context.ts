import { ContextConsumer, createContext } from "@lit/context";
import { createAtom, type ReadonlyAtom } from "@tanstack/lit-store";
import type { ReactiveElement } from "lit";
import { StoreSelector } from "./store-connection";
export type StepsPartKind = "item" | "trigger" | "content" | "previous" | "next";
export interface StepsPart {
  host: ReactiveElement;
  kind: StepsPartKind;
  value(): string;
  disabled(): boolean;
  completed?(): boolean | undefined;
  target(): HTMLElement | undefined;
  currentOwner(): StepsOwner | undefined;
  reconnect(): void;
}
export type StepItemState = Readonly<{ part: StepsPart; value: string; disabled: boolean; completed?: boolean }>;
export type StepsView = Readonly<{ value: number; linear: boolean; orientation: "horizontal" | "vertical"; items: readonly StepItemState[]; parts: readonly StepsPart[]; focused?: StepsPart }>;
export interface StepsOwner {
  view: ReadonlyAtom<StepsView>;
  register(part: StepsPart): () => void;
  index(value: string): number;
  valid(value: string): boolean;
  current(value: string): boolean;
  complete(value: string): boolean;
  counterpart(kind: StepsPartKind, value: string): StepsPart | undefined;
  tabindex(part: StepsPart): number;
  focus(part: StepsPart): void;
  move(part: StepsPart): void;
  recover(): void;
  canMove(part: StepsPart): boolean;
}
export const stepsContext = createContext<StepsOwner>(Symbol("acme-steps"));
export const stepContext = createContext<StepsPart>(Symbol("acme-step"));
const parts = new WeakMap<Element, StepsPart>();
const boundaries = new WeakSet<Element>();
export const stepsPartFor = (element: Element) => parts.get(element);
export const isStepsBoundary = (element: Element) => boundaries.has(element);
export const registerStepsBoundary = (element: Element) => boundaries.add(element);
export class StepsBinding {
  private readonly owner = createAtom<{ value?: StepsOwner }>({});
  readonly record: StepsPart;
  private release?: () => void;
  private readonly consumer: ContextConsumer<typeof stepsContext, ReactiveElement>;
  private readonly updates: StoreSelector<unknown>;
  constructor(
    private host: ReactiveElement,
    options: Omit<StepsPart, "host" | "currentOwner" | "reconnect">,
  ) {
    this.record = { ...options, host, currentOwner: () => this.current, reconnect: () => this.reconnect() };
    parts.set(host, this.record);
    this.consumer = new ContextConsumer(host, {
      context: stepsContext,
      subscribe: true,
      callback: (owner) => {
        if (owner === this.current) return;
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
    if (this.host.isConnected) this.consumer.hostConnected();
  }
}
