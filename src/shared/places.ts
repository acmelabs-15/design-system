import { createAtom } from "@tanstack/lit-store";
import type { ReactiveController, ReactiveControllerHost } from "lit";

export const PLACES = ["start-addon", "start", "end-addon", "end"] as const;
export type Place = (typeof PLACES)[number];
type Host = ReactiveControllerHost & Element & { renderRoot?: HTMLElement | DocumentFragment };

function hasContent(node: Node): boolean {
  if (node.nodeType === 3) {
    return !!node.textContent?.trim();
  }
  if (node.nodeType !== 1) {
    return false;
  }
  if ((node as Element).localName !== "slot") {
    return true;
  }
  return (node as HTMLSlotElement).assignedNodes({ flatten: true }).some(hasContent);
}

/** Tracks content assigned to this host's declared places, including forwarded slots. */
export class Places implements ReactiveController {
  private readonly filled = createAtom<ReadonlySet<string>>(new Set<string>());
  private watch?: MutationObserver;
  private root?: HTMLElement | DocumentFragment;
  private readonly names: readonly string[];
  constructor(
    private host: Host,
    options: { places?: readonly string[] } = {},
  ) {
    this.names = options.places ?? PLACES;
    host.addController(this);
  }
  has(name: string): boolean {
    return this.filled.get().has(name);
  }
  read = (): void => {
    const now = new Set<string>();
    for (const name of this.names) {
      // Direct light children are also available before a conditional slot's first render.
      const slot = [...(this.host.renderRoot?.querySelectorAll("slot") ?? [])].find((slot) => slot.name === name);
      const nodes = slot
        ? slot.assignedNodes().length
          ? slot.assignedNodes({ flatten: true })
          : []
        : [...this.host.childNodes].filter((child) => (child.nodeType === 3 ? name === "" : child.nodeType === 1 && ((child as Element).getAttribute("slot") ?? "") === name));
      if (nodes.some(hasContent)) {
        now.add(name);
      }
    }
    const before = this.filled.get();
    if (now.size === before.size && [...now].every((name) => before.has(name))) {
      return;
    }
    this.filled.set(now);
    this.host.requestUpdate();
  };
  hostConnected(): void {
    this.read();
    this.host.addEventListener("slotchange", this.read);
    this.watch = new MutationObserver(this.read);
    this.watch.observe(this.host, { childList: true, subtree: true, attributes: true, attributeFilter: ["slot"], characterData: true });
    this.bindRoot();
  }
  private bindRoot(): void {
    const root = this.host.renderRoot;
    if (root === this.root) {
      return;
    }
    this.root?.removeEventListener("slotchange", this.read);
    this.root = root;
    this.root?.addEventListener("slotchange", this.read);
  }
  hostDisconnected(): void {
    this.watch?.disconnect();
    this.watch = undefined;
    this.host.removeEventListener("slotchange", this.read);
    this.root?.removeEventListener("slotchange", this.read);
    this.root = undefined;
  }
  hostUpdate(): void {
    this.read();
  }
  hostUpdated(): void {
    this.bindRoot();
    this.read();
  }
}
