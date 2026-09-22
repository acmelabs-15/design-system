import { guardSelectionChanges } from "./selection-member";
import { createAtom, type ReadonlyAtom, batch } from "@tanstack/lit-store";
import type { ReactiveController, ReactiveElement } from "lit";
export type TabsState = Readonly<{
  value?: string;
  orientation: "horizontal" | "vertical";
  activation: "automatic" | "manual";
  variant: "primary" | "inset";
  disabled: boolean;
  lazyMount: boolean;
  unmountOnExit: boolean;
}>;
export interface TabOwner {
  state: ReadonlyAtom<TabsState>;
  selected(member: TabPart): boolean;
  select(member: TabPart): void;
  focus(member: TabPart): void;
  tabindex(member: TabPart): number;
  counterpart(member: TabPart): TabPart | undefined;
  synchronize(): void;
  remove(member: TabPart): void;
}
export interface TabPart {
  host: ReactiveElement;
  kind: "tab" | "panel";
  value(): string;
  disabled(): boolean;
  target(): HTMLElement | undefined;
  indicatorTarget(): Element | undefined;
  owner(): TabOwner | undefined;
  connect(owner: TabOwner | undefined): void;
  synchronize(): void;
}
const participants = new WeakMap<Element, TabPart>(),
  owners = new WeakSet<Element>();
const changed = "acme-internal-tab-part";
export function composedParent(node: Node): Node | null {
  return (node.nodeType === 1 ? (node as Element).assignedSlot : null) ?? node.parentNode ?? (node.nodeType === 11 && "host" in node ? (node as ShadowRoot).host : null);
}
export function tabOrder(a: TabPart, b: TabPart): number {
  const ancestry = (node: Node) => {
    const nodes: Node[] = [];
    for (let current: Node | null = node; current; current = composedParent(current)) nodes.unshift(current);
    return nodes;
  };
  const left = ancestry(a.host),
    right = ancestry(b.host);
  let i = 0;
  while (i < left.length && left[i] === right[i]) i++;
  if (!left[i] || !right[i]) return left.length - right.length;
  return left[i].compareDocumentPosition(right[i]) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}
/** One explicit part registration, independent of markup selectors and class identity. */
export class TabConnection implements ReactiveController {
  private readonly current = createAtom<{ owner?: TabOwner }>({});
  private previous?: HTMLElement;
  readonly source = createAtom(() => this.current.get().owner);
  constructor(
    private host: ReactiveElement,
    readonly part: TabPart,
  ) {
    participants.set(host, part);
    host.addController(this);
  }
  get owner() {
    return this.current.get().owner;
  }
  setOwner(owner: TabOwner | undefined) {
    if (this.owner === owner) return;
    this.current.set({ owner });
    this.host.requestUpdate();
  }
  notify() {
    if (this.host.isConnected) this.host.dispatchEvent(new Event(changed, { bubbles: true, composed: true }));
  }
  hostConnected() {
    this.previous = undefined;
    this.notify();
  }
  hostUpdated() {
    const target = this.part.target();
    if (target !== this.previous) {
      this.previous = target;
      this.notify();
    }
  }
  hostDisconnected() {
    this.owner?.remove(this.part);
  }
}
/** Owns parts through the root's public tab/panel slots and nested-owner boundaries. */
export class TabRegistry implements ReactiveController {
  private readonly current = createAtom<readonly TabPart[]>(Object.freeze([]));
  readonly members = createAtom(() => this.current.get());
  private observer?: MutationObserver;
  private root?: HTMLElement | DocumentFragment;
  constructor(
    private host: ReactiveElement,
    private owner: TabOwner,
  ) {
    owners.add(host);
    guardSelectionChanges(host);
    host.addController(this);
  }
  private belongs(member: TabPart) {
    let slot = "";
    for (let node: Node | null = member.host; node; node = composedParent(node)) {
      if (node === this.host) return slot === (member.kind === "panel" ? "panels" : "");
      if (node !== member.host && node.nodeType === 1 && (participants.has(node as Element) || owners.has(node as Element))) return false;
      if (node.nodeType === 1) {
        const element = node as Element;
        if (element.localName === "slot" && element.getRootNode() === this.host.renderRoot) slot = (element as HTMLSlotElement).name;
        else if (element.parentNode === this.host) slot = element.getAttribute("slot") ?? "";
      }
    }
    return false;
  }
  private add(member: TabPart) {
    if (this.current.get().includes(member) || !this.belongs(member)) return;
    batch(() => {
      const previous = member.owner();
      if (previous && previous !== this.owner) previous.remove(member);
      member.connect(this.owner);
      this.current.set(Object.freeze([...this.current.get(), member]));
      this.owner.synchronize();
    });
  }
  remove(member: TabPart) {
    if (!this.current.get().includes(member)) return;
    batch(() => {
      this.current.set(Object.freeze(this.current.get().filter((part) => part !== member)));
      member.connect(undefined);
      this.owner.synchronize();
    });
  }
  private change = (event: Event) => {
    const member = participants.get(event.composedPath()[0] as Element);
    if (!member) return;
    event.stopPropagation();
    if (this.belongs(member)) this.add(member);
    else if (member.owner() === this.owner) this.remove(member);
    this.owner.synchronize();
    this.host.requestUpdate();
  };
  private scan = () => {
    if (!this.host.isConnected) return;
    const found = new Set<TabPart>();
    const visit = (node: Node) => {
      if (node.nodeType !== 1) return;
      const element = node as Element,
        part = participants.get(element);
      if (part) {
        found.add(part);
        return;
      }
      if (owners.has(element)) return;
      for (const child of element.localName === "slot" ? (element as HTMLSlotElement).assignedNodes({ flatten: true }) : [...element.childNodes]) visit(child);
    };
    const slots = [...(this.host.renderRoot?.querySelectorAll("slot") ?? [])];
    if (slots.length) for (const slot of slots) for (const node of slot.assignedNodes({ flatten: true })) visit(node);
    else for (const node of this.host.childNodes) visit(node);
    for (const member of this.current.get()) if (!this.belongs(member)) this.remove(member);
    for (const member of found) this.add(member);
    this.owner.synchronize();
  };
  hostConnected() {
    this.host.addEventListener(changed, this.change);
    this.host.addEventListener("slotchange", this.scan);
    this.observer = new MutationObserver(this.scan);
    this.observer.observe(this.host, { subtree: true, childList: true, attributes: true, attributeFilter: ["slot"] });
    this.scan();
  }
  hostUpdated() {
    if (this.root !== this.host.renderRoot) {
      this.root?.removeEventListener("slotchange", this.scan);
      this.root = this.host.renderRoot;
      this.root.addEventListener("slotchange", this.scan);
    }
    this.scan();
  }
  hostDisconnected() {
    this.host.removeEventListener(changed, this.change);
    this.host.removeEventListener("slotchange", this.scan);
    this.root?.removeEventListener("slotchange", this.scan);
    this.root = undefined;
    this.observer?.disconnect();
    this.observer = undefined;
    for (const member of this.current.get()) this.remove(member);
  }
}
