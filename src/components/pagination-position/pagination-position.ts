import { html } from "lit";
import { AcmeElement, sharedCss } from "../../base";
import { paginationPartsCss } from "../../generated/shared/pagination-parts.styles";
import { message, messageCatalogs } from "../../shared/messages";
import { PaginationBinding } from "../../shared/pagination-context";
import { StoreSelector } from "../../shared/store-connection";
/** Localized current page and known total; unknown totals remain unspecified.
 * @csspart position - Page position text.
 */
export class AcmePaginationPosition extends AcmeElement {
  static styles = [sharedCss, paginationPartsCss];
  private readonly binding = new PaginationBinding(this, { target: () => this.renderRoot?.querySelector<HTMLElement>("[part=position]") ?? undefined });
  private readonly messages = new StoreSelector(this, () => messageCatalogs);
  render() {
    const view = this.binding.current?.view.get();
    if (!view) {
      return html``;
    }
    const locale = this.themeContext.scope.effective.get().locale,
      number = new Intl.NumberFormat(locale);
    const text =
      view.totalPages === 0
        ? message(locale, "pagination.empty", "No results")
        : view.totalPages === undefined
          ? message(locale, "pagination.unknownPosition", "Page {page}")
          : message(locale, "pagination.position", "Page {page} of {total}");
    return html`<span part="position">${text.replaceAll("{page}", number.format(view.page)).replaceAll("{total}", view.totalPages === undefined ? "" : number.format(view.totalPages))}</span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-pagination-position": AcmePaginationPosition;
  }
}
