import { html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { boolish } from "../../base";
import { AcmeClearableInput } from "../clearable-input/clearable-input";
import { searchInputCss } from "../../generated/components/search/search-input.styles";

/**
 * A search field: a clearable input with a magnifying glass inside the field at the start (an
 * element in the `start` slot replaces it) and the field named "Search". `loading` swaps the glass
 * for a spinner; `clearable="false"` drops the clear button and the Escape shortcut.
 */

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
      >${this.loading ? html`<acme-spinner size="md"></acme-spinner>` : html`<acme-search-icon size="16px"></acme-search-icon>`}</slot
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
