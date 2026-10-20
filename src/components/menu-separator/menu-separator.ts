import { html } from "lit";
import { AcmeElement, sharedCss } from "../../base";
import { menuSeparatorStructureCss } from "../../generated/components/menu-separator/menu-separator-structure.styles";
/** A non-focusable separator between menu groups.
 * @csspart root - The separator.
 */
export class AcmeMenuSeparator extends AcmeElement {
  static styles = [sharedCss, menuSeparatorStructureCss];
  render() {
    return html`<div role="separator" part="root"></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-menu-separator": AcmeMenuSeparator;
  }
}
