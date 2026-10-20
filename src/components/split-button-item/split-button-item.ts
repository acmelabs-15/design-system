import { AcmeMenuItem } from "../menu-item/menu-item";
/** A Menu Item in a Split Button's secondary action collection. */
export class AcmeSplitButtonItem extends AcmeMenuItem {}
declare global {
  interface HTMLElementTagNameMap {
    "acme-split-button-item": AcmeSplitButtonItem;
  }
}
