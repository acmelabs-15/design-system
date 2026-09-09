import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base.js";
import { paginationCss } from "./pagination.styles.js";

/** Geist Pagination: previous and next sibling pages. */
@customElement("acme-pagination")
export class AcmePagination extends AcmeElement {
  static styles = [sharedCss, paginationCss, css`:host{display:block}`];
  @property({ attribute: "prev-title" }) prevTitle = "";
  @property({ attribute: "prev-href" }) prevHref = "";
  @property({ attribute: "next-title" }) nextTitle = "";
  @property({ attribute: "next-href" }) nextHref = "";
  render() {
    return html`<nav class="pagination" aria-label="Pagination" part="nav">${this.prevTitle ? html`<a href=${this.prevHref} aria-label=${`Go to previous page: ${this.prevTitle}`}><small>Previous</small><b>${glyph("back")}${this.prevTitle}</b></a>` : html`<span></span>`}${this.nextTitle ? html`<a class="next" href=${this.nextHref} aria-label=${`Go to next page: ${this.nextTitle}`}><small>Next</small><b>${this.nextTitle}${glyph("arrow")}</b></a>` : nothing}</nav>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-pagination": AcmePagination;
  }
}
