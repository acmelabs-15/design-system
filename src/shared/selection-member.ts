import { batch, createAtom, type ReadonlyAtom } from "@tanstack/lit-store";
import type { ReactiveController, ReactiveElement } from "lit";

export const selectionMemberChange = "acme-internal-selection-member";
export type SelectionContext = Readonly<{ disabled: boolean; invalid: boolean; size?: string }>;
export interface SelectionOwner {
  kind: "checkbox" | "radio";
  state: ReadonlyAtom<SelectionContext>;
  checked(member: SelectionMember): boolean;
  change(member: SelectionMember, checked: boolean, reason: "programmatic" | "user"): void;
  remove(member: SelectionMember): void;
  synchronize(): void;
}
export interface SelectionMember {
  host: ReactiveElement;
  kind: "checkbox" | "radio" | "switch";
  owner(): SelectionOwner | undefined;
  value(): string;
  disabled(): boolean;
  required(): boolean;
  target(): HTMLInputElement;
  validation(): Readonly<{ flags: ValidityStateFlags; message: string }>;
  synchronize(): void;
  connect(owner: SelectionOwner | undefined): void;
}
const members = new WeakMap<Element, SelectionMember>();
const boundaries = new WeakSet<Element>();
const guarded = new WeakSet<Element>();
export function guardSelectionChanges(host: ReactiveElement): void {
  if (guarded.has(host)) {
    return;
  }
  guarded.add(host);
  host.addEventListener("acme-change", (event) => {
    if (event.composedPath()[0] !== host) {
      event.stopImmediatePropagation();
    }
  });
}
export const selectionMember = (element: Element) => members.get(element);
/** Binds an explicit control to its nearest logical selection owner. */
export class SelectionConnection implements ReactiveController {
  private readonly current = createAtom<{ owner?: SelectionOwner }>({});
  private previousTarget?: HTMLInputElement;
  readonly source = createAtom(() => this.current.get().owner);
  constructor(
    private host: ReactiveElement,
    readonly member: SelectionMember,
  ) {
    if (members.has(host)) {
      throw new Error("One selection participant per control");
    }
    members.set(host, member);
    guardSelectionChanges(host);
    host.addController(this);
  }
  get owner() {
    return this.current.get().owner;
  }
  setOwner(owner: SelectionOwner | undefined) {
    if (this.owner === owner) {
      return;
    }
    this.current.set({ owner });
    this.host.requestUpdate();
  }
  notify() {
    if (this.host.isConnected) {
      this.host.dispatchEvent(new Event(selectionMemberChange, { bubbles: true, composed: true }));
    }
  }
  hostConnected() {
    this.previousTarget = undefined;
    this.notify();
  }
  hostUpdated() {
    const target = this.member.target();
    if (target !== this.previousTarget) {
      this.previousTarget = target;
      this.notify();
    }
  }
  hostDisconnected() {
    this.owner?.remove(this.member);
  }
}
function parent(node: Node): Node | null {
  return (node.nodeType === 1 ? (node as Element).assignedSlot : null) ?? node.parentNode ?? (node.nodeType === 11 && "host" in node ? (node as ShadowRoot).host : null);
}
function ancestry(node: Node): Node[] {
  const result: Node[] = [];
  for (let current: Node | null = node; current; current = parent(current)) {
    result.unshift(current);
  }
  return result;
}

/** Discovers explicit participants through public slots and owns their membership lifetime. */
export class SelectionRegistry implements ReactiveController {
  private readonly current = createAtom<readonly SelectionMember[]>(Object.freeze([]));
  readonly members = createAtom(() => this.current.get());
  private root?: HTMLElement | DocumentFragment;
  private observer?: MutationObserver;
  constructor(
    private host: ReactiveElement,
    private owner: SelectionOwner,
  ) {
    boundaries.add(host);
    guardSelectionChanges(host);
    host.addController(this);
  }
  private add(member: SelectionMember) {
    if (member.kind !== this.owner.kind) {
      return;
    }
    if (this.current.get().includes(member)) {
      return;
    }
    batch(() => {
      const previous = member.owner();
      if (previous && previous !== this.owner) {
        previous.remove(member);
      }
      member.connect(this.owner);
      this.current.set(Object.freeze([...this.current.get(), member]));
      this.owner.synchronize();
    });
  }
  remove(member: SelectionMember) {
    if (!this.current.get().includes(member)) {
      return;
    }
    batch(() => {
      this.current.set(Object.freeze(this.current.get().filter((value) => value !== member)));
      this.owner.synchronize();
      member.connect(undefined);
    });
  }
  private belongs(member: SelectionMember) {
    for (let node = parent(member.host); node; node = parent(node)) {
      if (node.nodeType !== 1) {
        continue;
      }
      if (members.has(node as Element)) {
        return false;
      }
      if (boundaries.has(node as Element)) {
        return node === this.host;
      }
    }
    return false;
  }
  private nested(member: SelectionMember) {
    for (let node = parent(member.host); node && node !== this.host; node = parent(node)) {
      if (node.nodeType === 1 && (members.has(node as Element) || boundaries.has(node as Element))) {
        return true;
      }
    }
    return false;
  }
  private changed = (event: Event) => {
    if (!this.host.isConnected) {
      return;
    }
    const member = selectionMember(event.composedPath()[0] as Element);
    if (!member) {
      return;
    }
    event.stopPropagation();
    if (this.nested(member)) {
      if (member.owner() === this.owner) {
        this.remove(member);
      }
      return;
    }
    if (member.kind !== this.owner.kind) {
      console.warn(this.host.localName, { code: "unsupported-selection-member" });
      return;
    }
    batch(() => {
      this.add(member);
      this.scan();
    });
  };
  private scan = () => {
    if (!this.host.isConnected) {
      return;
    }
    const found = new Set<SelectionMember>();
    const visit = (node: Node) => {
      if (node.nodeType !== 1) {
        return;
      }
      const element = node as Element;
      const member = selectionMember(element);
      if (member) {
        found.add(member);
        return;
      }
      if (boundaries.has(element)) {
        return;
      }
      const children = element.localName === "slot" ? (element as HTMLSlotElement).assignedNodes({ flatten: true }) : [...element.childNodes];
      for (const child of children) {
        visit(child);
      }
    };
    const slot = this.host.renderRoot?.querySelector("slot");
    for (const node of slot ? slot.assignedNodes({ flatten: true }) : [...this.host.childNodes]) {
      visit(node);
    }
    for (const member of this.current.get()) {
      if (!found.has(member) && !this.belongs(member)) {
        this.remove(member);
      }
    }
    for (const member of found) {
      if (!this.nested(member)) {
        this.add(member);
      }
    }
    this.owner.synchronize();
  };
  hostConnected() {
    this.host.addEventListener(selectionMemberChange, this.changed);
    this.host.addEventListener("slotchange", this.scan);
    this.observer = new MutationObserver(this.scan);
    this.observer.observe(this.host, { subtree: true, childList: true, attributes: true, attributeFilter: ["slot"] });
    this.scan();
  }
  hostUpdated() {
    if (!this.host.isConnected) {
      return;
    }
    if (this.root !== this.host.renderRoot) {
      this.root?.removeEventListener("slotchange", this.scan);
      this.root = this.host.renderRoot;
      this.root.addEventListener("slotchange", this.scan);
    }
    this.scan();
  }
  hostDisconnected() {
    this.host.removeEventListener(selectionMemberChange, this.changed);
    this.host.removeEventListener("slotchange", this.scan);
    this.root?.removeEventListener("slotchange", this.scan);
    this.root = undefined;
    this.observer?.disconnect();
    this.observer = undefined;
    for (const member of this.current.get()) {
      this.remove(member);
    }
  }
}
/** Orders explicit members across their known shadow boundaries without inspecting private trees. */
export function selectionOrder(a: { host: Node }, b: { host: Node }): number {
  const left = ancestry(a.host),
    right = ancestry(b.host);
  let i = 0;
  while (i < left.length && left[i] === right[i]) {
    i++;
  }
  if (!left[i] || !right[i]) {
    return left.length - right.length;
  }
  return left[i].compareDocumentPosition(right[i]) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}
