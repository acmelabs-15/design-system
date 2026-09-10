import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { breakpointVars, type Responsive, responsive } from "../grid/grid";
import { gridCrossCss } from "./grid-cross.styles";

/**
 * A cross on a guide intersection of `acme-grid`: `row` and `column` are grid line numbers (1 is
 * the first line, the count plus one the last), plain or per breakpoint as JSON. 21px wide on large
 * screens, 15px on medium, 11px on small; two lines in the cross color, as wide as the guides.
 */
@customElement("acme-grid-cross")
export class AcmeGridCross extends AcmeElement {
  static styles = [sharedCss, gridCrossCss];
  @property({ converter: responsive }) row: Responsive<number> = 1;
  @property({ converter: responsive }) column: Responsive<number> = 1;

  /** The lines land on the host as custom properties per breakpoint; the grid's sheet places the cross by them. */
  updated() {
    const vars = { ...breakpointVars("cross-row", this.row), ...breakpointVars("cross-column", this.column) };
    const stale = Array.from({ length: this.style.length }, (_, i) => this.style.item(i)).filter((n) => /^--(?:[a-z]+-)?cross-(row|column)$/.test(n) && !(n in vars));
    for (const name of stale) this.style.removeProperty(name);
    for (const [k, v] of Object.entries(vars)) this.style.setProperty(k, v);
  }

  render() {
    return html`<div class="line" style="width:var(--cross-half-size);height:var(--cross-size);border-right-width:var(--guide-width)"></div>
      <div class="line" style="width:var(--cross-size);height:var(--cross-half-size);border-bottom-width:var(--guide-width)"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-grid-cross": AcmeGridCross;
  }
}
