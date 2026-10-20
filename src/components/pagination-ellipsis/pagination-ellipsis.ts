import { html } from "lit";
import { AcmeElement, sharedCss } from "../../base";
import { paginationPartsCss } from "../../generated/shared/pagination-parts.styles";
/** Non-action separator between ranges of page numbers.
 * @csspart item - Decorative omitted-page indicator.
 */
export class AcmePaginationEllipsis extends AcmeElement {
  static styles = [sharedCss, paginationPartsCss];
  render() {
    return html`<span part="item" aria-hidden="true">…</span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-pagination-ellipsis": AcmePaginationEllipsis;
  }
}
