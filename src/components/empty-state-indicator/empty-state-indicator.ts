import { html } from "lit";
import { AcmeElement, sharedCss } from "../../base";
import { emptyStateSurfaceCss } from "../../generated/shared/empty-state-surface.styles";
/** Holds an authored icon or illustration with its own accessible meaning.
 * @slot - Icon, Icon Tile or illustration.
 * @csspart root - Indicator wrapper.
 */
export class AcmeEmptyStateIndicator extends AcmeElement {
  static styles = [sharedCss, emptyStateSurfaceCss];
  render() {
    return html`<div part="root" data-kind="indicator"><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-empty-state-indicator": AcmeEmptyStateIndicator;
  }
}
