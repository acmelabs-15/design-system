import { paginationStructureCss } from "../../generated/components/pagination/pagination-structure.styles";
import { html, nothing } from "lit";
import { property, query } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { Interaction } from "../../shared/interaction";
import { paginationCss } from "../../generated/components/pagination/pagination.styles";
import { paginationLinkCss } from "../../generated/components/pagination/pagination-link.styles";

/**
 * Pagination. The previous and next sibling pages as two links in a full-width space-between
 * row: the 13px gray-900 direction label over the 16px medium title, with a chevron placed
 * outside the title (left of the previous, right of the next); hovering a link turns both dark.
 * The accessible name reads "Go to previous page: <title>". An end without a title renders no
 * link. The `center` slot sits between them, on viewports of 1200px and up.
 */

export class AcmePagination extends AcmeElement {
  static styles = [sharedCss, paginationCss, paginationLinkCss, paginationStructureCss];
  /** Destination page name of the previous link; empty hides the link. */
  @property({ attribute: "prev-title" }) prevTitle = "";
  @property({ attribute: "prev-href" }) prevHref = "";
  /** Destination page name of the next link; empty hides the link. */
  @property({ attribute: "next-title" }) nextTitle = "";
  @property({ attribute: "next-href" }) nextHref = "";
  @query(".prev") private prev?: HTMLElement;
  @query(".next") private next?: HTMLElement;
  private prevInteraction = new Interaction(this);
  private nextInteraction = new Interaction(this);

  updated() {
    this.prevInteraction.attach(this.prev);
    this.nextInteraction.attach(this.next);
  }

  private link(dir: "prev" | "next", title: string, href: string) {
    const next = dir === "next";
    return html`<a class="link ${dir}" href=${href} aria-label=${`Go to ${next ? "next" : "previous"} page: ${title}`} part=${dir}
      ><span class="label">${next ? "Next" : "Previous"}</span>
      <div class="row"><span class="title">${title}</span><span class="chev">${next ? html`<acme-chevron-right-icon size="20px"></acme-chevron-right-icon>` : html`<acme-chevron-left-icon size="20px"></acme-chevron-left-icon>`}</span></div></a
    >`;
  }

  render() {
    return html`<nav class="pagination" aria-label="pagination" part="nav">
      ${this.prevTitle ? this.link("prev", this.prevTitle, this.prevHref) : nothing}
      <div class="center"><slot name="center"></slot></div>
      ${this.nextTitle ? this.link("next", this.nextTitle, this.nextHref) : nothing}
    </nav>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-pagination": AcmePagination;
  }
}
