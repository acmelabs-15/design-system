import { html } from "lit";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { cardSectionCss } from "../../generated/shared/card-section.styles";
/** Padded header content in a Card.
 * @slot - Author-owned header content.
 * @csspart header - The content region.
 */
export class AcmeCardHeader extends AcmeSemanticElement {
  static styles = [sharedCss, cardSectionCss];
  render() {
    return html`<div part="root header"><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-card-header": AcmeCardHeader;
  }
}
