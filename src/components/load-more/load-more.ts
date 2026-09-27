import { html } from "lit";
import { AcmeActionElement } from "../../shared/action-element";
import { actionContent } from "../../shared/action-content";
import { message, messageCatalogs } from "../../shared/messages";
import { StoreSelector } from "../../shared/store-connection";
/** Requests more results. The application owns loading and the result collection.
 * @acmeDefault variant "secondary"
 * @slot - Action label, with a localized Load More fallback.
 * @slot start - Leading content.
 * @slot end - Trailing content.
 * @fires {CustomEvent<{action:"load-more"}>} acme-request - A user requests more results.
 */
export class AcmeLoadMore extends AcmeActionElement {
  private readonly localeUpdates = new StoreSelector(this, () => this.themeContext.scope.effective);
  private readonly messageUpdates = new StoreSelector(this, () => messageCatalogs);
  protected get fallbackAppearance() {
    return { variant: "secondary" };
  }
  protected activate() {
    this.dispatchEvent(new CustomEvent("acme-request", { detail: Object.freeze({ action: "load-more" }), bubbles: true, composed: true }));
  }
  protected renderContent() {
    return actionContent({
      loading: this.loading,
      size: this.size,
      start: this.places.has("start"),
      end: this.places.has("end"),
      label: html`<slot>${message(this.themeContext.scope.effective.get().locale, "loadMore.label", "Load More")}</slot>`,
    });
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-load-more": AcmeLoadMore;
  }
}
