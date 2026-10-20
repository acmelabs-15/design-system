import { html } from "lit";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { cardSectionCss } from "../../generated/shared/card-section.styles";
/** Padded body content in a Card.
 * @slot - Author-owned body content.
 * @csspart body - The content region.
 */
export class AcmeCardBody extends AcmeSemanticElement {
  static styles = [sharedCss, cardSectionCss];
  render() {
    return html`<div part="root body"><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-card-body": AcmeCardBody;
  }
}
