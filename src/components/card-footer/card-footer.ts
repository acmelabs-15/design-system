import { html } from "lit";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { cardSectionCss } from "../../generated/shared/card-section.styles";
/** Padded footer content in a Card.
 * @slot - Author-owned footer content.
 * @csspart footer - The content region.
 */
export class AcmeCardFooter extends AcmeSemanticElement {
  static styles = [sharedCss, cardSectionCss];
  render() {
    return html`<div part="root footer"><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-card-footer": AcmeCardFooter;
  }
}
