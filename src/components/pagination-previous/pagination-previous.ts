import { AcmePaginationAction } from "../../shared/pagination-action";
/** Requests the previous available page without changing application state.
 * @slot - Label; defaults to localized Previous.
 */
export class AcmePaginationPrevious extends AcmePaginationAction {
  constructor() {
    super("previous");
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-pagination-previous": AcmePaginationPrevious;
  }
}
