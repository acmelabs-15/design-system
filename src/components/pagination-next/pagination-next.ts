import { AcmePaginationAction } from "../../shared/pagination-action";
/** Requests the next available page without changing application state.
 * @slot - Label; defaults to localized Next.
 */
export class AcmePaginationNext extends AcmePaginationAction {
  constructor() {
    super("next");
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-pagination-next": AcmePaginationNext;
  }
}
