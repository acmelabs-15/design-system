import { html } from "lit";
import { AcmeElement, sharedCss } from "../../base";
import { statSurfaceCss } from "../../generated/shared/stat-surface.styles";
/** Additional measurement context, displays or application actions.
 * @slot - Footer content.
 * @csspart footer - Footer definition.
 */
export class AcmeStatFooter extends AcmeElement {
  static styles = [sharedCss, statSurfaceCss];
  render() {
    return html`<dd part="footer"><slot></slot></dd>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-stat-footer": AcmeStatFooter;
  }
}
