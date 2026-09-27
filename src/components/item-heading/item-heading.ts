import { html } from "lit";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { itemPartCss } from "../../generated/shared/item-part.styles";
/** Descriptive heading content in an Item.
 * @slot - Author-owned heading content.
 * @csspart heading - The content region.
 */
export class AcmeItemHeading extends AcmeSemanticElement {
  static styles = [sharedCss, itemPartCss];
  render() {
    return html`<div part="root heading"><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-item-heading": AcmeItemHeading;
  }
}
