import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { filterCss } from "../filter/filter.styles.js";

@customElement("acme-filters")
export class AcmeFilters extends AcmeElement {
  static styles = [sharedCss, filterCss, css`:host{display:block}`];
  render() {
    return html`<div class="filters-row"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-filters": AcmeFilters;
  }
}
