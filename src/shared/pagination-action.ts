import { html } from "lit";
import { property } from "lit/decorators.js";
import { actionContent } from "./action-content";
import { AcmeActionElement } from "./action-element";
import { atomState } from "./atom-state";
import { deepActiveElement } from "./composed-tree";
import { message, messageCatalogs } from "./messages";
import { PaginationBinding } from "./pagination-context";
import { StoreSelector } from "./store-connection";
/** Native action/link rendering shared by page and relative-page controls.
 * @csspart item - Native page navigation action.
 */
export abstract class AcmePaginationAction extends AcmeActionElement {
  protected readonly binding: PaginationBinding;
  @atomState() @property({ noAccessor: true, useDefault: true }) href = "";
  constructor(protected readonly direction: "previous" | "next" | "item") {
    super();
    this.binding = new PaginationBinding(this, { target: () => this.control, page: () => this.destination });
  }
  private readonly messageUpdates = new StoreSelector(this, () => messageCatalogs);
  protected get destination(): number | undefined {
    return this.binding?.current?.view.get()[this.direction === "previous" ? "previous" : "next"];
  }
  protected get current() {
    return this.direction === "item" && this.destination === this.binding?.current?.view.get().page;
  }
  private get unavailable() {
    const view = this.binding?.current?.view.get(),
      page = this.destination;
    return !view || view.disabled || view.loading || page === undefined || page < 1 || (view.totalPages !== undefined && page > view.totalPages);
  }
  protected get fallbackAppearance() {
    return { variant: this.current ? "secondary" : "tertiary" };
  }
  protected get emphasized() {
    return this.current;
  }
  protected get link() {
    const page = this.destination,
      view = this.binding?.current?.view.get();
    const href = this.href || (page !== undefined ? view?.getPageUrl?.(page) : undefined);
    return href ? { href, target: "", rel: "" } : undefined;
  }
  protected get submission() {
    return { ...super.submission, link: !!this.link, disabled: super.submission.disabled || this.unavailable };
  }
  protected get effectiveDisabled() {
    return super.effectiveDisabled || this.unavailable;
  }
  protected synchronizeControl() {
    const control = this.control;
    if (control && this.unavailable && deepActiveElement(this.ownerDocument) === control) this.binding?.current?.recover();
    super.synchronizeControl();
    control?.setAttribute("part", "root item");
    if (control?.localName === "button") (control as HTMLButtonElement).disabled = this.disabled || this.nativeAction.fieldsetDisabled || this.unavailable;
    if (control?.localName === "a" && this.unavailable) control.tabIndex = -1;
    if (this.current) control?.setAttribute("aria-current", "page");
    else control?.removeAttribute("aria-current");
  }
  protected activate(event: MouseEvent) {
    if (this.link && (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return;
    const page = this.destination;
    if (page !== undefined && !this.binding.current?.page(page)) event.preventDefault();
  }
  protected get semanticDefaults() {
    const label =
      this.direction === "item"
        ? message(this.themeContext.scope.effective.get().locale, "pagination.page", "Page {page}").replaceAll(
            "{page}",
            new Intl.NumberFormat(this.themeContext.scope.effective.get().locale).format(this.destination ?? 1),
          )
        : undefined;
    return { ...super.semanticDefaults, label };
  }
  protected renderContent() {
    const locale = this.themeContext.scope.effective.get().locale;
    const text =
      this.direction === "item" ? new Intl.NumberFormat(locale).format(this.destination ?? 1) : message(locale, "pagination." + this.direction, this.direction === "next" ? "Next" : "Previous");
    return actionContent({ loading: this.loading, size: this.size, start: this.places.has("start"), end: this.places.has("end"), label: html`<slot>${text}</slot>` });
  }
}
