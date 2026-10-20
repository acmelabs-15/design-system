import { html } from "lit";
import { property } from "lit/decorators.js";
import { boolish } from "../../base";
import { atomState } from "../../shared/atom-state";
import { AcmeSingleLineControl } from "../../shared/single-line-control";
/** A native search field with a clear action and loading presentation.
 * @slot start - Replaces the search icon.
 * @slot end - Content inside the end of the field.
 * @slot start-addon - Attached start content.
 * @slot end-addon - Attached end content.
 * @csspart root - The attached field surface.
 * @csspart input - The native search input.
 * @csspart clear - The clear action.
 * @fires {CustomEvent<{value:string}>} acme-input - A live value edit.
 * @fires {CustomEvent<{value:string}>} acme-change - A committed value edit.
 */
export class AcmeSearch extends AcmeSingleLineControl {
  @atomState() @property({ noAccessor: true, type: Boolean }) loading = false;
  @atomState() @property({ noAccessor: true, converter: boolish }) clearable = true;
  protected get inputType() {
    return "search";
  }
  protected get busy() {
    return this.loading;
  }
  protected get semanticDefaults() {
    return { ...super.semanticDefaults, label: this.text("search.label", "Search") };
  }
  protected leading() {
    return this.loading ? html`<acme-spinner size="small"></acme-spinner>` : html`<acme-search-icon></acme-search-icon>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-search": AcmeSearch;
  }
}
