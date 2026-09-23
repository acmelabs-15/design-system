import { ContextConsumer, createContext } from "@lit/context";
import { createAtom, type ReadonlyAtom } from "@tanstack/lit-store";
import type { ReactiveElement } from "lit";
import { StoreSelector } from "./store-connection";
import { ComposedParticipants } from "./composed-participants";
import { focusAvailable, focusSection } from "./focus-recovery";
export type DisclosureState = Readonly<{ expanded: boolean; disabled: boolean; canCollapse: boolean; lazyMount: boolean; unmountOnExit: boolean }>;
export type DisclosurePart = { host: ReactiveElement; kind: "trigger" | "content"; target(): HTMLElement | undefined; currentOwner(): DisclosureScope | undefined; reconnect(): void };
const parts = new WeakMap<Element, DisclosurePart>();
const boundaries = new WeakSet<Element>();
export const disclosureContext = createContext<DisclosureScope>(Symbol("acme-disclosure"));
export class DisclosureScope {
  readonly parts = createAtom<readonly DisclosurePart[]>([]);
  readonly state: ReadonlyAtom<DisclosureState>;
  readonly view: ReadonlyAtom<{ state: DisclosureState; parts: readonly DisclosurePart[] }>;
  private readonly participants: ComposedParticipants<DisclosurePart>;
  private releaseFocus?: () => void;
  constructor(
    readonly host: ReactiveElement,
    read: () => DisclosureState,
    private change: () => void,
    private navigation?: (part: DisclosurePart, event: KeyboardEvent) => void,
  ) {
    boundaries.add(host);
    host.addController({
      hostDisconnected: () => {
        this.releaseFocus?.();
        this.releaseFocus = undefined;
      },
    });
    this.state = createAtom(read);
    this.view = createAtom(() => ({ state: this.state.get(), parts: this.parts.get() }));
    this.participants = new ComposedParticipants(host, {
      owner: this,
      parts: () => this.parts.get(),
      find: (element) => parts.get(element),
      boundary: (element) => boundaries.has(element),
      slots: () => [...host.renderRoot.querySelectorAll("slot")],
    });
  }
  register(part: DisclosurePart) {
    this.parts.set((value) => [...value, part]);
    return () => this.parts.set((value) => value.filter((p) => p !== part));
  }
  counterpart(kind: "trigger" | "content") {
    return this.parts.get().find((part) => part.kind === kind && part.host.isConnected);
  }
  toggle() {
    const state = this.state.get();
    if (!state.disabled && (!state.expanded || state.canCollapse)) this.change();
  }
  key(part: DisclosurePart, event: KeyboardEvent) {
    this.navigation?.(part, event);
  }
  recover() {
    const trigger = this.counterpart("trigger");
    if (!this.state.get().disabled && focusAvailable(trigger?.target())) return;
    this.releaseFocus = focusSection(this.host, trigger ? [trigger.host] : []);
  }
}
export class DisclosureBinding {
  private readonly owner = createAtom<{ value?: DisclosureScope }>({});
  readonly record: DisclosurePart;
  private release?: () => void;
  private readonly consumer: ContextConsumer<typeof disclosureContext, ReactiveElement>;
  private readonly updates: StoreSelector<unknown>;
  constructor(
    private host: ReactiveElement,
    kind: DisclosurePart["kind"],
    target: () => HTMLElement | undefined,
  ) {
    this.record = { host, kind, target, currentOwner: () => this.current, reconnect: () => this.reconnect() };
    parts.set(host, this.record);
    this.consumer = new ContextConsumer(host, {
      context: disclosureContext,
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
export type AccordionState = Readonly<{ expanded: readonly string[]; multiple: boolean; collapsible: boolean; disabled: boolean; lazyMount: boolean; unmountOnExit: boolean }>;
export interface AccordionMember {
  host: ReactiveElement;
  value(): string;
  disabled(): boolean;
  scope: DisclosureScope;
  currentOwner(): AccordionOwner | undefined;
  reconnect(): void;
}
export interface AccordionOwner {
  state: ReadonlyAtom<AccordionState>;
  valid(member: AccordionMember): boolean;
  register(member: AccordionMember): () => void;
  toggle(member: AccordionMember): void;
  navigate(member: AccordionMember, event: KeyboardEvent): void;
}
export const accordionContext = createContext<AccordionOwner>(Symbol("acme-accordion"));
const items = new WeakMap<Element, AccordionMember>(),
  accordions = new WeakSet<Element>();
export const accordionMemberFor = (element: Element) => items.get(element);
export const registerAccordionMember = (member: AccordionMember) => items.set(member.host, member);
export const isAccordionBoundary = (element: Element) => accordions.has(element);
export const registerAccordionBoundary = (element: Element) => accordions.add(element);
