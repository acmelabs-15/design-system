import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { loadingDotsCss } from "./loading-dots.styles.js";

/** Geist Loading Dots: sm 2 · md 3 · lg 4, appended to a verb in progress. */
@customElement("acme-loading-dots")
export class AcmeLoadingDots extends AcmeElement {
  static styles = [sharedCss, loadingDotsCss, css`:host{display:inline-flex;align-items:center;gap:4px;vertical-align:middle}`];
  @property() size: "small" | "medium" | "large" = "medium";
  render() {
    return html`<slot></slot><span class=${this.cls("dots", { sm: this.size === "small", lg: this.size === "large" })} aria-hidden="true"><i></i><i></i><i></i></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-loading-dots": AcmeLoadingDots;
  }
}
