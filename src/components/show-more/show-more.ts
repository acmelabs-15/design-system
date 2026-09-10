import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, glyphSized, sharedCss } from "../../base";
import { showMoreCss } from "./show-more.styles";
import "../button/button";

/**
 * Show more. A hairline rule with a small rounded secondary button in the middle that reads
 * "Show More", or "Show Less" once `expanded`; the chevron turns with it. The element is
 * controlled: a click bubbles as a native `click`, and the owner sets `expanded`. `loading` shows
 * the spinner while expanded; `no-border` hides the rule; slotted content replaces the text.
 */
@customElement("acme-show-more")
export class AcmeShowMore extends AcmeElement {
  static styles = [
    sharedCss,
    showMoreCss,
    css`
      :host {
        display: block;
      }
      acme-button {
        display: block;
      }
    `,
  ];
  @property({ type: Boolean, reflect: true }) expanded = false;
  /** The spinner, while expanded (the text reads "Show More" meanwhile). */
  @property({ type: Boolean }) loading = false;
  /** Hides the rule. */
  @property({ type: Boolean, attribute: "no-border" }) noBorder = false;
  render() {
    const line = html`<div class="line" data-line="true"></div>`;
    return html`<div class=${this.cls("show-more", { expanded: this.expanded, "no-border": this.noBorder })}>
      ${line}
      <div class="pill">
        <acme-button variant="secondary" size="small" shape="rounded" ?loading=${this.expanded && this.loading} part="button"
          ><slot
            ><div class="text" style="display:flex;align-items:center">
              Show ${this.expanded && !this.loading ? "Less" : "More"}<span class="chev">${glyphSized("chev-d")}</span>
            </div></slot
          ></acme-button
        >
      </div>
      ${line}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-show-more": AcmeShowMore;
  }
}
