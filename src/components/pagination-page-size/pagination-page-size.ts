import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { paginationPartsCss } from "../../generated/shared/pagination-parts.styles";
import { atomState } from "../../shared/atom-state";
import { message, messageCatalogs } from "../../shared/messages";
import { PaginationBinding } from "../../shared/pagination-context";
import { StoreSelector } from "../../shared/store-connection";
/** Optional application-owned result page-size selection.
 * @csspart page-size - Label/control layout.
 */
export class AcmePaginationPageSize extends AcmeElement {
  static styles = [sharedCss, paginationPartsCss];
  @atomState() private choices: readonly number[] = Object.freeze([10, 25, 50]);
  /** @default [10,25,50] */
  @property({ noAccessor: true, type: Array, useDefault: true }) get options() {
    return this.choices;
  }
  set options(value: readonly number[]) {
    if (!Array.isArray(value) || !value.length || value.some((item) => !Number.isSafeInteger(item) || item < 1) || new Set(value).size !== value.length) {
      throw new TypeError("Page-size options require distinct positive integers");
    }
    const previous = this.choices;
    this.choices = Object.freeze([...value]);
    this.requestUpdate("options", previous);
  }
  private readonly binding = new PaginationBinding(this, { target: () => this.renderRoot?.querySelector<HTMLElement>("acme-select") ?? undefined });
  private readonly messages = new StoreSelector(this, () => messageCatalogs);
  private change = (event: CustomEvent<{ value: string }>) => {
    event.stopPropagation();
    this.binding.current?.pageSize(Number(event.detail.value));
    this.requestUpdate();
  };
  protected updated() {
    const select = this.renderRoot.querySelector("acme-select") as (HTMLElement & { value?: string }) | null;
    const pageSize = this.binding.current?.view.get().pageSize;
    if (select && pageSize !== undefined) {
      select.value = String(pageSize);
    }
  }
  render() {
    const view = this.binding.current?.view.get(),
      locale = this.themeContext.scope.effective.get().locale,
      options = view && !this.options.includes(view.pageSize) ? [view.pageSize, ...this.options] : this.options;
    return html`<acme-field part="page-size" orientation="horizontal" .disabled=${!view || view.disabled || view.loading}><span slot="label">${message(locale, "pagination.pageSize", "Show")}</span><acme-select .value=${view ? String(view.pageSize) : undefined} @acme-change=${this.change}>${options.map((value) => html`<acme-option .value=${String(value)}>${new Intl.NumberFormat(locale).format(value)}</acme-option>`)}</acme-select></acme-field>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-pagination-page-size": AcmePaginationPageSize;
  }
}
