import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { filterCss } from "./filter.styles.js";

/** Vercel filter chips: a pill that names a key and value, with a remove; `suggest` for a dashed suggestion, `add` for the trigger. */
@customElement("acme-filter")
export class AcmeFilter extends AcmeElement {
  static styles = [sharedCss, filterCss, css`:host{display:inline-flex}`];
  @property() key = "";
  @property() value = "";
  @property({ type: Boolean }) suggest = false;
  @property({ type: Boolean }) add = false;
  @property({ type: Boolean }) removable = false;
  render() {
    return html`<span class=${this.cls("filter", { suggest: this.suggest, add: this.add })} role="button" tabindex="0" @click=${() => this.dispatchEvent(new CustomEvent("acme-select", { bubbles: true, composed: true }))} part="filter"><slot name="icon"></slot>${this.key ? html`<span class="key">${this.key}</span>` : nothing}${this.value ? html`<b>${this.value}</b>` : nothing}<slot></slot>${
      this.removable
        ? html`<button class="x" aria-label="Remove" @click=${(e: Event) => {
            e.stopPropagation();
            this.dispatchEvent(new CustomEvent("acme-remove", { bubbles: true, composed: true }));
          }}>×</button>`
        : nothing
    }</span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-filter": AcmeFilter;
  }
}
