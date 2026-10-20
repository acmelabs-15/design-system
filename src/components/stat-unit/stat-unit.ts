import { html } from "lit";
import { AcmeElement, sharedCss } from "../../base";
import { statSurfaceCss } from "../../generated/shared/stat-surface.styles";
/** A unit inside Stat Value.
 * @slot - Unit text.
 * @csspart unit - Unit wrapper.
 */
export class AcmeStatUnit extends AcmeElement {
  static styles = [sharedCss, statSurfaceCss];
  render() {
    return html`<span part="unit"><slot></slot></span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-stat-unit": AcmeStatUnit;
  }
}
