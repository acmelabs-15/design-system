import { ContextProvider } from "@lit/context";
import { createAtom } from "@tanstack/lit-store";
import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { sharedCss } from "../../base";
import { paginationNavigationCss } from "../../generated/components/pagination/pagination-navigation.styles";
import { atomState } from "../../shared/atom-state";
import { numberAttribute } from "../../shared/attributes";
import { ComposedParticipants } from "../../shared/composed-participants";
import { composedContains, deepActiveElement } from "../../shared/composed-tree";
import { message, messageCatalogs } from "../../shared/messages";
import { type PaginationOwner, type PaginationPart, type PaginationView, paginationContext, paginationPartFor } from "../../shared/pagination-context";
import { paginationRange, paginationState } from "../../shared/pagination-model";
import { Places } from "../../shared/places";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { StoreSelector } from "../../shared/store-connection";
/** Coordinates application-owned result pages and optional position/page-size controls.
 * @slot - Optional authored parts; otherwise renders the selected navigation variant.
 * @csspart root - Stable navigation wrapper.
 * @csspart navigation - Named native navigation region.
 * @fires {CustomEvent<{action:"page",page:number}|{action:"page-size",pageSize:number}>} acme-request - Cancelable application page or page-size request.
 */
export class AcmePagination extends AcmeSemanticElement {
  static styles = [sharedCss, paginationNavigationCss];
  private readonly places = new Places(this, { places: [""] });
  @atomState() private index = 1;
  /** @default 1 */
  @property({ noAccessor: true, type: Number, useDefault: true }) get page() {
    return this.index;
  }
  set page(value: number) {
    paginationState(value, 1);
    const previous = this.index;
    this.index = value;
    this.requestUpdate("page", previous);
  }
  @atomState() private length = 10;
  /** @default 10 */
  @property({ noAccessor: true, type: Number, useDefault: true, attribute: "page-size" }) get pageSize() {
    return this.length;
  }
  set pageSize(value: number) {
    paginationState(1, value);
    const previous = this.length;
    this.length = value;
    this.requestUpdate("pageSize", previous);
  }
  @atomState() private total?: number;
  @property({ noAccessor: true, converter: numberAttribute }) get count(): number | undefined {
    return this.total;
  }
  set count(value: number | undefined) {
    paginationState(1, 1, value);
    const previous = this.total;
    this.total = value;
    this.requestUpdate("count", previous);
  }
  @atomState() private nextAvailable?: boolean;
  @property({ noAccessor: true, attribute: "has-next-page", converter: { fromAttribute: (value: string | null) => (value === null ? undefined : value !== "false") } }) get hasNextPage():
    | boolean
    | undefined {
    return this.nextAvailable;
  }
  set hasNextPage(value: boolean | undefined) {
    if (value !== undefined && typeof value !== "boolean") throw new TypeError("hasNextPage requires a boolean or undefined");
    const previous = this.nextAvailable;
    this.nextAvailable = value;
    this.requestUpdate("hasNextPage", previous);
  }
  @atomState() @property({ noAccessor: true, type: Boolean }) loading = false;
  @atomState() @property({ noAccessor: true, type: Boolean }) disabled = false;
  @atomState() private treatment: "numbered" | "compact" = "numbered";
  /** @default "numbered" */
  @property({ noAccessor: true, useDefault: true }) get variant() {
    return this.treatment;
  }
  set variant(value: "numbered" | "compact") {
    if (value !== "numbered" && value !== "compact") throw new TypeError("Invalid Pagination variant");
    const previous = this.treatment;
    this.treatment = value;
    this.requestUpdate("variant", previous);
  }
  @atomState() private url?: (page: number) => string;
  @property({ noAccessor: true, attribute: false }) get getPageUrl() {
    return this.url;
  }
  set getPageUrl(value: ((page: number) => string) | undefined) {
    if (value !== undefined && typeof value !== "function") throw new TypeError("getPageUrl requires a function");
    const previous = this.url;
    this.url = value;
    this.requestUpdate("getPageUrl", previous);
  }
  private readonly parts = createAtom<readonly PaginationPart[]>([]);
  private readonly view = createAtom<PaginationView>(() => ({
    ...paginationState(this.page, this.pageSize, this.count, this.hasNextPage),
    loading: this.loading,
    disabled: this.disabled,
    getPageUrl: this.getPageUrl,
  }));
  private readonly owner: PaginationOwner = {
    view: this.view,
    register: (part) => {
      this.parts.set((parts) => [...parts, part]);
      return () => this.parts.set((parts) => parts.filter((p) => p !== part));
    },
    page: (page) => this.requestPage(page),
    pageSize: (pageSize) => this.requestSize(pageSize),
    recover: () => this.recover(),
  };
  private readonly provider = new ContextProvider(this, { context: paginationContext, initialValue: this.owner });
  private readonly updates = new StoreSelector(this, () => this.view);
  private readonly messages = new StoreSelector(this, () => messageCatalogs);
  private readonly participants = new ComposedParticipants(this, {
    owner: this.owner,
    parts: () => this.parts.get(),
    find: paginationPartFor,
    boundary: (el) => el instanceof AcmePagination,
    slots: () => [...this.renderRoot.querySelectorAll("slot")],
    changed: () => this.requestUpdate(),
  });
  private focusBefore?: Element | null;
  private requestPage(page: number) {
    const view = this.view.get();
    if (view.disabled || view.loading || !Number.isSafeInteger(page) || page < 1 || (view.totalPages !== undefined && page > view.totalPages)) return false;
    if (page === this.page) return true;
    return this.dispatchEvent(new CustomEvent("acme-request", { detail: Object.freeze({ action: "page", page }), bubbles: true, composed: true, cancelable: true }));
  }
  private requestSize(pageSize: number) {
    if (this.disabled || this.loading || !Number.isSafeInteger(pageSize) || pageSize < 1) return false;
    if (pageSize === this.pageSize) return true;
    return this.dispatchEvent(new CustomEvent("acme-request", { detail: Object.freeze({ action: "page-size", pageSize }), bubbles: true, composed: true, cancelable: true }));
  }
  private recover() {
    this.renderRoot?.querySelector<HTMLElement>("nav")?.focus({ preventScroll: true });
  }
  protected get semanticTarget() {
    return this.renderRoot?.querySelector<HTMLElement>("nav") ?? undefined;
  }
  protected get semanticDefaults() {
    return { role: "navigation", label: message(this.themeContext.scope.effective.get().locale, "pagination.label", "Pagination") };
  }
  protected willUpdate() {
    const active = deepActiveElement(this.ownerDocument);
    this.focusBefore = active && composedContains(this, active) ? active : undefined;
  }
  protected updated() {
    if (this.focusBefore && !this.focusBefore.isConnected) {
      const next = this.parts
        .get()
        .find((part) => part.page() === this.page)
        ?.target();
      if (next && !this.disabled && !this.loading) next.focus({ preventScroll: true });
      else this.recover();
    }
    this.focusBefore = undefined;
  }
  render() {
    const pages = paginationRange(this.page, this.view.get().totalPages);
    return html`<div part="root"><nav part="navigation" tabindex="-1" aria-busy=${String(this.loading)}><slot>${
      this.places.has("")
        ? nothing
        : html`<acme-pagination-previous></acme-pagination-previous>${
            this.variant === "compact"
              ? html`<acme-pagination-position></acme-pagination-position>`
              : repeat(
                  pages,
                  (page, index) => (typeof page === "number" ? page : "ellipsis-" + index),
                  (page) => (typeof page === "number" ? html`<acme-pagination-item .page=${page}></acme-pagination-item>` : html`<acme-pagination-ellipsis></acme-pagination-ellipsis>`),
                )
          }<acme-pagination-next></acme-pagination-next>`
    }</slot></nav></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-pagination": AcmePagination;
  }
}
