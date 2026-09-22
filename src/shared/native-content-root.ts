import type { ReactiveController, ReactiveElement } from "lit";

export const nativeContentMarker = "data-acme-native-root";
/** Owns one native light-DOM container while retaining complete author node ranges. */
export class NativeContentRoot<T extends HTMLElement> implements ReactiveController {
  private current: T;
  private initialized = false;
  private collecting = false;
  private observer?: MutationObserver;
  constructor(
    private host: ReactiveElement,
    private create: () => T,
    private changed: (root: T) => void,
  ) {
    this.current = create();
    host.addController(this);
  }
  get root(): T {
    return this.current;
  }
  private collect = () => {
    if (!this.host.isConnected || this.collecting) return;
    this.collecting = true;
    try {
      const supplied = [...this.host.children].find(
        (node) =>
          node !== this.current && node.localName === this.current.localName && node.namespaceURI === this.current.namespaceURI && node.getAttribute(nativeContentMarker) === this.current.localName,
      );
      if (supplied && (!this.initialized || this.current.parentNode !== this.host)) this.current = supplied as T;
      else if (this.initialized && this.current.parentNode !== this.host) this.current = this.create();
      this.current.setAttribute(nativeContentMarker, this.current.localName);
      this.changed(this.current);
      const nodes = [...this.host.childNodes].filter((node) => node !== this.current);
      let focused = this.host.ownerDocument.activeElement as HTMLElement | null;
      const focusPath: HTMLElement[] = [];
      while (focused) {
        focusPath.push(focused);
        const next = focused.shadowRoot?.activeElement as HTMLElement | undefined;
        if (!next) break;
        focused = next;
      }
      const displaced = focusPath.some((active) => nodes.some((node) => node === active || node.contains(active)));
      const textTarget = focused?.localName === "input" || focused?.localName === "textarea" ? (focused as HTMLInputElement | HTMLTextAreaElement) : undefined;
      const selection =
        textTarget?.selectionStart !== null && textTarget?.selectionStart !== undefined
          ? { start: textTarget.selectionStart, end: textTarget.selectionEnd!, direction: textTarget.selectionDirection ?? "none" }
          : undefined;
      if (this.current.parentNode !== this.host) this.host.append(this.current);
      for (const node of nodes) {
        const target = this.current as T & { moveBefore?: (node: Node, before: Node | null) => void };
        if (target.moveBefore && node.isConnected) target.moveBefore(node, null);
        else target.append(node);
      }
      if (displaced && focused?.isConnected && !focused.matches(":disabled") && !focused.closest("[inert]")) {
        focused.focus({ preventScroll: true });
        if (selection) textTarget!.setSelectionRange(selection.start, selection.end, selection.direction);
      }
      this.initialized = true;
      this.changed(this.current);
    } finally {
      this.collecting = false;
    }
  };
  hostConnected() {
    this.collect();
    this.observer = new MutationObserver(this.collect);
    this.observer.observe(this.host, { childList: true });
  }
  hostUpdated() {
    this.collect();
  }
  hostDisconnected() {
    this.observer?.disconnect();
    this.observer = undefined;
  }
}
