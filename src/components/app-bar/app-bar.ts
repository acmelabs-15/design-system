import { html } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { Places } from "../../shared/places";
import { composedParent } from "../../shared/composed-tree";
import { atomState } from "../../shared/atom-state";
import { appBarCss } from "../../generated/components/app-bar/app-bar.styles";
/** A flexible application header with explicit identity, content and actions.
 * @slot - Main header content.
 * @slot start - Leading identity or navigation.
 * @slot end - Trailing actions.
 * @csspart root - The native header.
 * @csspart start - Leading region.
 * @csspart content - Main region.
 * @csspart end - Trailing region.
 * @cssprop --acme-app-bar-offset - Sticky offset; defaults to 0px.
 */
export class AcmeAppBar extends AcmeSemanticElement {
  static styles = [sharedCss, appBarCss];
  private readonly places = new Places(this, { places: ["start", "end"] });
  connectedCallback() {
    super.connectedCallback();
    queueMicrotask(() => {
      if (this.isConnected) {
        this.requestUpdate();
      }
    });
  }
  @atomState() private placementValue: "static" | "sticky" = "static";
  /** @default "static" */
  @property({ noAccessor: true, reflect: true, useDefault: true }) get placement(): "static" | "sticky" {
    return this.placementValue;
  }
  set placement(value: "static" | "sticky") {
    if (!["static", "sticky"].includes(value)) {
      throw new TypeError("Invalid App Bar placement");
    }
    const previous = this.placementValue;
    this.placementValue = value;
    this.requestUpdate("placement", previous);
  }
  @atomState() private sizeValue: "small" | "medium" | "large" = "medium";
  /** @default "medium" */
  @property({ noAccessor: true, useDefault: true }) get size(): "small" | "medium" | "large" {
    return this.sizeValue;
  }
  set size(value: "small" | "medium" | "large") {
    if (!["small", "medium", "large"].includes(value)) {
      throw new TypeError("Invalid App Bar size");
    }
    const previous = this.sizeValue;
    this.sizeValue = value;
    this.requestUpdate("size", previous);
  }
  protected get semanticDefaults() {
    for (let node: Node | null = composedParent(this); node; node = composedParent(node)) {
      if (node.nodeType !== 1) {
        continue;
      }
      const element = node as Element;
      if (element.localName === "dialog" || ["dialog", "alertdialog"].includes(element.getAttribute("role") ?? "")) {
        return { role: "generic" };
      }
    }
    return {};
  }
  render() {
    return html`<header part="root" data-size=${this.size}><div part="start" ?hidden=${!this.places.has("start")}><slot name="start"></slot></div><div part="content"><slot></slot></div><div part="end" ?hidden=${!this.places.has("end")}><slot name="end"></slot></div></header>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-app-bar": AcmeAppBar;
  }
}
