import type { ReactiveController, ReactiveElement } from "lit";

export type HeadingTarget = Readonly<{ heading: HTMLHeadingElement; target: HTMLElement; id: string; label: string; level: number }>;
export const headingTargetsChanged = "acme-internal-heading-targets";
const sources = new WeakMap<Element, () => readonly HeadingTarget[]>();

/** Registers owned headings without opening arbitrary private shadow roots. */
export class HeadingTargets implements ReactiveController {
  private connected = false;
  private previous: readonly HeadingTarget[] = [];
  constructor(
    private host: ReactiveElement,
    private read: () => readonly HeadingTarget[],
  ) {
    host.addController(this);
  }
  hostConnected(): void {
    this.connected = true;
    sources.set(this.host, this.read);
  }
  hostUpdated(): void {
    if (!this.connected) {
      return;
    }
    const next = this.read();
    const same =
      next.length === this.previous.length &&
      next.every((item, index) => {
        const previous = this.previous[index];
        return item.heading === previous.heading && item.target === previous.target && item.id === previous.id && item.label === previous.label && item.level === previous.level;
      });
    if (same) {
      return;
    }
    this.previous = next;
    this.host.dispatchEvent(new Event(headingTargetsChanged, { bubbles: true, composed: true }));
  }
  hostDisconnected(): void {
    this.connected = false;
    sources.delete(this.host);
    this.previous = [];
  }
}

/** Public-tree discovery works for native prose and explicitly registered house heading hosts. */
export function discoverHeadingTargets(root: Document | ShadowRoot | Element): readonly HeadingTarget[] {
  const targets: HeadingTarget[] = [];
  const visit = (element: Element) => {
    const source = sources.get(element);
    if (source) {
      targets.push(...source());
      return;
    }
    if (/^h[1-6]$/.test(element.localName)) {
      targets.push(
        Object.freeze({ heading: element as HTMLHeadingElement, target: element as HTMLElement, id: element.id, label: element.textContent?.trim() ?? "", level: Number(element.localName.slice(1)) }),
      );
    }
  };
  if (root.nodeType === 1) {
    visit(root as Element);
  }
  for (const element of root.querySelectorAll("*")) {
    visit(element);
  }
  return Object.freeze(targets);
}
