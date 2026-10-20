import { html } from "lit";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { itemPartCss } from "../../generated/shared/item-part.styles";
/** Descriptive media content in an Item.
 * @slot - Author-owned media content.
 * @csspart media - The content region.
 */
export class AcmeItemMedia extends AcmeSemanticElement {
  static styles = [sharedCss, itemPartCss];
  render() {
    return html`<div part="root media"><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-item-media": AcmeItemMedia;
  }
}
