import { type CSSResult, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { AcmeTheme } from "../../components/theme/theme";
import { atomState } from "../../shared/atom-state";
import { composedParent } from "../../shared/composed-tree";
import type { ThemeSource } from "../../shared/theme-context";
import { densityTokenDefinitions, themeOverrideSelector, themeTokenDefinitions } from "../../shared/theme-tokens";
/** Carries a complete scope and its public CSS tokens into an owned overlay.
 * @internal
 */
export class AcmeOverlayTheme extends AcmeTheme {
  @atomState() private supplied?: ThemeSource;
  @property({ noAccessor: true, attribute: false }) get source(): ThemeSource | undefined {
    return this.supplied;
  }
  set source(value: ThemeSource | undefined) {
    if (value !== undefined && (typeof value.get !== "function" || typeof value.subscribe !== "function")) throw new TypeError("Overlay theme requires a theme source");
    const previous = this.supplied;
    this.supplied = value;
    this.themeContext.setSource(value);
    this.requestUpdate("source", previous);
  }
  @atomState() private referenceElement?: HTMLElement;
  @property({ noAccessor: true, attribute: false }) get reference(): HTMLElement | undefined {
    return this.referenceElement;
  }
  set reference(value: HTMLElement | undefined) {
    if (value === this.referenceElement) return;
    this.stopWatching();
    this.referenceElement = value;
    this.observe();
    this.refresh();
    this.requestUpdate("reference");
  }
  private transferred?: CSSResult;
  private text = "";
  private observer?: MutationObserver;
  private window?: Window;
  private nodes: Node[] = [];
  protected get scopedStyles() {
    return this.transferred ? [...super.scopedStyles, this.transferred] : super.scopedStyles;
  }
  private observe() {
    const reference = this.referenceElement;
    if (!this.isConnected || !reference?.isConnected) return;
    const nodes: Node[] = [];
    for (let node: Node | null = reference; node; node = composedParent(node)) nodes.push(node);
    if (nodes.length === this.nodes.length && nodes.every((node, i) => node === this.nodes[i])) return;
    this.stopWatching();
    this.nodes = nodes;
    this.observer = new MutationObserver(() => {
      if (!reference.isConnected) {
        this.stopWatching();
        return;
      }
      this.observe();
      this.refresh();
    });
    for (const node of nodes) {
      if (node.nodeType === 1) this.observer.observe(node, { attributes: true, childList: true });
      else if (node.nodeType === 11) this.observer.observe(node, { childList: true });
    }
    this.window = reference.ownerDocument.defaultView ?? undefined;
    this.window?.addEventListener("resize", this.refresh);
    this.window?.document.addEventListener("load", this.refresh, true);
  }
  private stopWatching() {
    this.observer?.disconnect();
    this.observer = undefined;
    this.window?.removeEventListener("resize", this.refresh);
    this.window?.document.removeEventListener("load", this.refresh, true);
    this.window = undefined;
    this.nodes = [];
  }
  refresh = () => {
    const reference = this.referenceElement;
    if (reference && !reference.isConnected) return;
    const buffer = this.ownerDocument.createElement("span").style;
    if (reference) {
      const view = reference.ownerDocument.defaultView;
      if (!view) return;
      const computed = view.getComputedStyle(reference);
      const densityProperties = new Set<string>(densityTokenDefinitions.map((token) => token.cssProperty));
      const ownDensity = this.themeContext.scope.authored.get().density !== undefined;
      for (const token of themeTokenDefinitions) {
        if (ownDensity && densityProperties.has(token.cssProperty)) continue;
        const value = computed.getPropertyValue(token.cssProperty);
        if (value.trim()) buffer.setProperty(token.cssProperty, value);
      }
    }
    const text = buffer.cssText;
    if (text === this.text) return;
    this.text = text;
    this.transferred = text ? unsafeCSS(themeOverrideSelector + "{" + text + "}") : undefined;
    this.refreshScopedStyles();
  };
  connectedCallback() {
    super.connectedCallback();
    this.observe();
    this.refresh();
  }
  protected updated() {
    super.updated();
    this.observe();
    this.refresh();
  }
  disconnectedCallback() {
    this.stopWatching();
    super.disconnectedCallback();
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-overlay-theme": AcmeOverlayTheme;
  }
}
