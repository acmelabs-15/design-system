import type { CSSResult, ReactiveController, ReactiveElement } from "lit";
import { constructedStyleSheet } from "./static-styles";
import { registerStyleProperties } from "./style-properties";

type Root = Document | ShadowRoot;
type Entry = { count: number; sheet?: CSSStyleSheet; node?: HTMLStyleElement; borrowed?: boolean };
const roots = new WeakMap<Root, Map<CSSResult, Entry>>();
/** Applies generated, explicitly scoped light-DOM rules in the host's actual tree root. */
export class RootStyles implements ReactiveController {
  private root?: Root;
  constructor(
    private host: ReactiveElement,
    private styles: readonly CSSResult[],
  ) {
    host.addController(this);
  }
  private release() {
    if (!this.root) {
      return;
    }
    const entries = roots.get(this.root)!;
    for (const style of this.styles) {
      const entry = entries.get(style);
      if (!entry || --entry.count) {
        continue;
      }
      if (entry.sheet && !entry.borrowed) {
        this.root.adoptedStyleSheets = this.root.adoptedStyleSheets.filter((sheet) => sheet !== entry.sheet);
      }
      entry.node?.remove();
      entries.delete(style);
    }
    if (!entries.size) {
      roots.delete(this.root);
    }
    this.root = undefined;
  }
  private apply() {
    if (!this.host.isConnected) {
      return;
    }
    const root = this.host.getRootNode();
    if (root.nodeType !== 9 && !(root.nodeType === 11 && "host" in root)) {
      return;
    }
    if (root === this.root) {
      return;
    }
    this.release();
    this.root = root as Root;
    let entries = roots.get(this.root);
    if (!entries) {
      entries = new Map();
      roots.set(this.root, entries);
    }
    const document = this.host.ownerDocument;
    for (const style of this.styles) {
      let entry = entries.get(style);
      if (entry) {
        entry.count++;
        continue;
      }
      registerStyleProperties(style, document.defaultView?.CSS);
      const sheet = constructedStyleSheet(document, style);
      if (sheet && "adoptedStyleSheets" in root) {
        const borrowed = this.root.adoptedStyleSheets.includes(sheet);
        if (!borrowed) {
          this.root.adoptedStyleSheets = [...this.root.adoptedStyleSheets, sheet];
        }
        entry = { count: 1, sheet, borrowed };
      } else {
        const node = document.createElement("style");
        node.textContent = style.cssText;
        const nonce = (document.defaultView as (Window & { litNonce?: string }) | null)?.litNonce;
        if (nonce !== undefined) {
          node.nonce = nonce;
        }
        if (this.root.nodeType === 9) {
          (this.root as Document).head.append(node);
        } else {
          this.root.append(node);
        }
        entry = { count: 1, node };
      }
      entries.set(style, entry);
    }
  }
  hostConnected() {
    this.apply();
  }
  hostUpdated() {
    this.apply();
  }
  hostDisconnected() {
    this.release();
  }
}
