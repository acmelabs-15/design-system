import { html } from "lit";
import { AcmeElement, sharedCss } from "../../base";
import { statSurfaceCss } from "../../generated/shared/stat-surface.styles";
/** Supporting context for the measurement.
 * @slot - Description content.
 * @csspart description - Supporting native definition.
 */
export class AcmeStatDescription extends AcmeElement {
  static styles = [sharedCss, statSurfaceCss];
  render() {
    return html`<dd part="description"><slot></slot></dd>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-stat-description": AcmeStatDescription;
  }
}
