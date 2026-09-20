import { filtersStructureCss } from "../../generated/components/filters/filters-structure.styles";
import { html } from "lit";

import { AcmeElement, sharedCss } from "../../base";
import { filterCss } from "../../generated/components/filter/filter.styles";

export class AcmeFilters extends AcmeElement {
  static styles = [
    sharedCss,
    filterCss,
    filtersStructureCss,
  ];
  render() {
    return html`<div class="filters-row"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-filters": AcmeFilters;
  }
}
