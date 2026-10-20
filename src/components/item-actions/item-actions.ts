import { html } from "lit";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { itemPartCss } from "../../generated/shared/item-part.styles";
/** Descriptive actions content in an Item.
 * @slot - Author-owned actions content.
 * @csspart actions - The content region.
 */
export class AcmeItemActions extends AcmeSemanticElement {
  static styles = [sharedCss, itemPartCss];
  render() {
    return html`<div part="root actions"><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-item-actions": AcmeItemActions;
  }
}
