import { html } from "lit";
import { AcmeElement, sharedCss } from "../../base";
import { statSurfaceCss } from "../../generated/shared/stat-surface.styles";
/** Names the following measurement using a native description-list term.
 * @slot - Measurement label and optional supporting help.
 * @csspart label - Native term.
 */
export class AcmeStatLabel extends AcmeElement {
  static styles = [sharedCss, statSurfaceCss];
  render() {
    return html`<dt part="label"><slot></slot></dt>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-stat-label": AcmeStatLabel;
  }
}
