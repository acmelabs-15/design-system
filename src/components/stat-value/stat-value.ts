import { html } from "lit";
import { AcmeElement, sharedCss } from "../../base";
import { statSurfaceCss } from "../../generated/shared/stat-surface.styles";
import { StatBinding } from "../../shared/stat-context";
/** Holds authored value content and optional Stat Unit; Stat owns loading presentation.
 * @slot - Value content, formatters and optional unit.
 * @csspart value - Native definition.
 */
export class AcmeStatValue extends AcmeElement {
  static styles = [sharedCss, statSurfaceCss];
  private readonly binding = new StatBinding(this);
  render() {
    return html`<dd part="value"><acme-skeleton .loading=${this.binding.loading}><span class="value-layout"><slot></slot></span></acme-skeleton></dd>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-stat-value": AcmeStatValue;
  }
}
