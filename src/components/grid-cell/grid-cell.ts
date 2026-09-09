import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { gridCss } from "../grid/grid.styles.js";

@customElement("acme-grid-cell")
export class AcmeGridCell extends AcmeElement {
  static styles = [
    sharedCss,
    gridCss,
    css`:host{display:block;position:relative;min-height:120px;padding:48px;font-size:16px;line-height:24px;border-right:1px var(--gs-style,solid) var(--gs-line,var(--border));border-bottom:1px var(--gs-style,solid) var(--gs-line,var(--border))} :host([solid]){background:var(--surface);z-index:1} :host([span="2"]){grid-column:span 2} :host([span="3"]){grid-column:span 3} :host([span="all"]){grid-column:1/-1}`,
  ];
  @property({ type: Boolean, reflect: true }) solid = false;
  @property({ reflect: true }) span = "";
  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-grid-cell": AcmeGridCell;
  }
}
