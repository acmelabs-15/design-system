import { html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { boolish } from "../../base";
import { AcmeClearableInput } from "../clearable-input/clearable-input";
import { searchInputCss } from "./search-input.styles";
import "../spinner/spinner";

/** The magnifying glass, 16px, drawn in the current color. */
const SEARCH_ICON = svg`<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M1.5 6.5a5 5 0 1 1 10 0 5 5 0 0 1-10 0M6.5 0a6.5 6.5 0 1 0 4.03 11.6l3.74 3.73 1.06-1.06-3.74-3.74A6.5 6.5 0 0 0 6.5 0"></path>`;

/**
 * A search field: a clearable input with a magnifying glass inside the field at the start (an
 * element in the `start` slot replaces it) and the field named "Search". `loading` swaps the glass
 * for a spinner; `clearable="false"` drops the clear button and the Escape shortcut.
 */
@customElement("acme-search")
export class AcmeSearch extends AcmeClearableInput {
  static styles = [...AcmeClearableInput.styles, searchInputCss];
  /** Replaces the glass with a spinner. */
  @property({ type: Boolean, reflect: true }) loading = false;
  /** `"false"` drops the clear button and the Escape shortcut. */
  @property({ converter: boolish }) clearable = true;
  protected get inputType() {
    return "search";
  }
  protected get fieldLabel() {
    return "Search";
  }
  /** The forwarded start slot: a slotted element, or its fallback, the glass or the spinner. */
  protected renderStart(): TemplateResult {
    return html`<slot name="start" slot="start"
      >${this.loading ? html`<acme-spinner size="md"></acme-spinner>` : html`<svg viewBox="0 0 16 16" height="16" width="16" style="color:currentColor" aria-hidden="true">${SEARCH_ICON}</svg>`}</slot
    >`;
  }
  protected renderEnd(): TemplateResult | typeof nothing {
    return this.clearable ? super.renderEnd() : nothing;
  }
  clear() {
    if (this.clearable) super.clear();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-search": AcmeSearch;
  }
}
