import { html } from "lit";
import { AcmeElement, sharedCss } from "../../base";
import { appBarRegionCss } from "../../generated/shared/app-bar-region.styles";
/** Start content in an App Bar.
 * @slot - Author-owned header content.
 * @csspart root - The content region.
 */
export class AcmeAppBarStart extends AcmeElement {
  static styles = [sharedCss, appBarRegionCss];
  connectedCallback() {
    if (!this.hasAttribute("slot")) this.slot = "start";
    super.connectedCallback();
  }
  render() {
    return html`<div part="root"><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-app-bar-start": AcmeAppBarStart;
  }
}
