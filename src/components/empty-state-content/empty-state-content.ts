import { html } from "lit";
import { AcmeElement, sharedCss } from "../../base";
import { emptyStateSurfaceCss } from "../../generated/shared/empty-state-surface.styles";
/** Groups authored empty-state content without choosing a heading level.
 * @slot - Indicator, heading, description and other content.
 * @csspart root - Content column.
 */
export class AcmeEmptyStateContent extends AcmeElement {
  static styles = [sharedCss, emptyStateSurfaceCss];
  render() {
    return html`<div part="root" data-kind="content"><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-empty-state-content": AcmeEmptyStateContent;
  }
}
