import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { gridCss } from "./grid.styles.js";

/** Geist Grid: guide-line cells. Children: acme-grid-cell. */
@customElement("acme-grid")
export class AcmeGrid extends AcmeElement {
  static styles = [sharedCss, gridCss, css`:host{display:block} .gs{--cols:var(--ds-cols,3)} ::slotted(acme-grid-cell){display:contents}`];
  @property({ type: Number }) columns = 3;
  @property({ type: Boolean }) dashed = false;
  @property({ type: Boolean }) debug = false;
  @property({ attribute: "hide-guides" }) hideGuides: "" | "row" | "column" = "";
  @property({ type: Boolean }) page = false;
  render() {
    const g = html`<div class=${this.cls("gs", { dashed: this.dashed, debug: this.debug, "hide-rows": this.hideGuides === "row", "hide-cols": this.hideGuides === "column" })} style=${`--ds-cols:${this.columns}`} part="grid"><slot></slot><slot name="cross"></slot></div>`;
    return this.page ? html`<div class="gs-page">${g}</div>` : g;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-grid": AcmeGrid;
  }
}
