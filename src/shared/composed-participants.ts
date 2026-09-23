import type { ReactiveController, ReactiveElement } from "lit";
import { composedContains } from "./composed-tree";
export interface ScopeParticipant {
  readonly host: HTMLElement;
  currentOwner(): object | undefined;
  reconnect(): void;
}
type Options<Part extends ScopeParticipant> = {
  owner: object;
  parts(): readonly Part[];
  find(element: Element): Part | undefined;
  boundary(element: Element): boolean;
  slots(): readonly HTMLSlotElement[];
  descend?(part: Part): boolean;
  changed?(): void;
};
/** Refreshes context ownership when public slots or composed ancestry change. */
export class ComposedParticipants<Part extends ScopeParticipant> implements ReactiveController {
  private observer?: MutationObserver;
  private root?: HTMLElement | DocumentFragment;
  constructor(
    private host: ReactiveElement,
    private options: Options<Part>,
  ) {
    host.addController(this);
  }
  private changed = () => {
    this.options.changed?.();
    this.scan();
  };
  scan(): void {
    if (!this.host.isConnected) return;
    const found = new Set<Part>();
    const visit = (node: Node): void => {
      if (node.nodeType !== 1) return;
      const element = node as Element;
      const part = this.options.find(element);
      if (part) found.add(part);
      if (this.options.boundary(element) || (part && !this.options.descend?.(part))) return;
      const children = element.localName === "slot" ? (element as HTMLSlotElement).assignedNodes({ flatten: true }) : element.childNodes;
      for (const child of children) visit(child);
    };
    for (const slot of this.options.slots()) for (const node of slot.assignedNodes({ flatten: true })) visit(node);
    for (const part of [...this.options.parts()]) if (!composedContains(this.host, part.host)) part.reconnect();
    for (const part of found) if (part.currentOwner() !== this.options.owner) part.reconnect();
  }
  hostConnected(): void {
    this.host.addEventListener("slotchange", this.changed);
    this.observer = new MutationObserver(this.changed);
    this.observer.observe(this.host, { childList: true, subtree: true, attributes: true, attributeFilter: ["slot", "hidden"] });
  }
  hostUpdated(): void {
    if (!this.host.isConnected) return;
    if (this.root !== this.host.renderRoot) {
      this.root?.removeEventListener("slotchange", this.changed);
      this.root = this.host.renderRoot;
      this.root.addEventListener("slotchange", this.changed);
    }
    this.scan();
  }
  hostDisconnected(): void {
    this.observer?.disconnect();
    this.observer = undefined;
    this.host.removeEventListener("slotchange", this.changed);
    this.root?.removeEventListener("slotchange", this.changed);
    this.root = undefined;
    for (const part of [...this.options.parts()]) part.reconnect();
  }
}
