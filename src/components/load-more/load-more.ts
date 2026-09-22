import { loadMoreStructureCss } from "../../generated/components/load-more/load-more-structure.styles";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { AcmeElement, sharedCss } from "../../base";
import { loadMoreCss } from "../../generated/components/load-more/load-more.styles";
import { loadMorePlaceholderCss } from "../../generated/components/load-more/load-more-placeholder.styles";

/**
 * Load more button. A full-width secondary submit button that appends more items to a list,
 * 16px below it; the slot is the text, "Load More" by default. `loading` shows the spinner and
 * disables it; `no-gap` removes the space above; `no-border-radius` squares the corners so it
 * sits flush with the list; `placeholder` renders an empty block of the same height instead.
 */

export class AcmeLoadMore extends AcmeElement {
  static styles = [sharedCss, loadMoreCss, loadMorePlaceholderCss, loadMoreStructureCss];
  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, attribute: "no-gap" }) noGap = false;
  @property({ type: Boolean, attribute: "no-border-radius" }) noBorderRadius = false;
  /** An empty block of the button's height, while the list loads. */
  @property({ type: Boolean }) placeholder = false;
  render() {
    if (this.placeholder) return html`<div class=${classMap({ placeholder: true, "no-gap": this.noGap })}></div>`;
    return html`<acme-button
      class=${classMap({ "no-gap": this.noGap, "no-radius": this.noBorderRadius })}
      variant="secondary"
      type="submit"
      ?loading=${this.loading}
      ?disabled=${this.disabled}
      part="button"
      ><slot>Load More</slot></acme-button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-load-more": AcmeLoadMore;
  }
}
