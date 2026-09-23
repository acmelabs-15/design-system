import { html } from "lit";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { itemPartCss } from "../../generated/shared/item-part.styles";
/** Descriptive metadata content in an Item.
 * @slot - Author-owned metadata content.
 * @csspart metadata - The content region.
 */
export class AcmeItemMetadata extends AcmeSemanticElement {
  static styles = [sharedCss, itemPartCss];
  render() {
    return html`<div part="root metadata"><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-item-metadata": AcmeItemMetadata;
  }
}
