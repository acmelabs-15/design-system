import { property } from "lit/decorators.js";
import { atomState } from "../../shared/atom-state";
import { AcmePaginationAction } from "../../shared/pagination-action";
/** One native page action or link, named by its page number.
 * @slot - Visible label; defaults to the localized page number.
 */
export class AcmePaginationItem extends AcmePaginationAction {
  @atomState() private targetPage = 1;
  /** @default 1 */
  @property({ noAccessor: true, type: Number, useDefault: true }) get page() {
    return this.targetPage;
  }
  set page(value: number) {
    if (!Number.isSafeInteger(value) || value < 1) {
      throw new RangeError("Pagination Item requires a positive page");
    }
    const previous = this.targetPage;
    this.targetPage = value;
    this.requestUpdate("page", previous);
  }
  constructor() {
    super("item");
  }
  protected get destination() {
    return this.page;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-pagination-item": AcmePaginationItem;
  }
}
