import { html } from "lit";
import { AcmeElement, sharedCss } from "../../base";
import { appBarRegionCss } from "../../generated/shared/app-bar-region.styles";
/** Content content in an App Bar.
 * @slot - Author-owned header content.
 * @csspart root - The content region.
 */
export class AcmeAppBarContent extends AcmeElement {
  static styles = [sharedCss, appBarRegionCss];

  render() {
    return html`<div part="root"><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-app-bar-content": AcmeAppBarContent;
  }
}
