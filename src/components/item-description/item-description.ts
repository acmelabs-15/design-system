import { html } from "lit";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { itemPartCss } from "../../generated/shared/item-part.styles";
/** Descriptive description content in an Item.
 * @slot - Author-owned description content.
 * @csspart description - The content region.
 */
export class AcmeItemDescription extends AcmeSemanticElement {
  static styles = [sharedCss, itemPartCss];
  render() {
    return html`<div part="root description"><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-item-description": AcmeItemDescription;
  }
}
