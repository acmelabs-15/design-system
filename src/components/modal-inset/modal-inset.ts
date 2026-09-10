import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { modalInsetCss } from "./modal-inset.styles";

/**
 * The full-bleed tinted block inside a modal's body: it runs through the body's padding on both
 * sides (the padding variable reaches it from the body), with a hairline above and below and the
 * tinted fill. `last` makes it the body's final block: it meets the footer with no bottom hairline
 * and no body padding under it. An inset with no div after it drops its bottom hairline too.
 */
@customElement("acme-modal-inset")
export class AcmeModalInset extends AcmeElement {
  static styles = [
    sharedCss,
    modalInsetCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  /** The inset is the last thing in the body: it meets the footer with no bottom hairline. */
  @property({ type: Boolean, reflect: true }) last = false;
  private siblings?: MutationObserver;

  connectedCallback() {
    super.connectedCallback();
    this.place();
    if (typeof MutationObserver === "function" && this.parentNode) {
      this.siblings = new MutationObserver(() => this.place());
      this.siblings.observe(this.parentNode, { childList: true });
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.siblings?.disconnect();
    this.siblings = undefined;
  }

  /** Marks the inset that no div (or inset) follows among its siblings: the body's last block of its kind. */
  private place() {
    let last = true;
    for (let s = this.nextElementSibling; s; s = s.nextElementSibling) if (s.tagName === "DIV" || s.tagName === "ACME-MODAL-INSET") last = false;
    this.toggleAttribute("data-last-of-type", last);
  }

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-modal-inset": AcmeModalInset;
  }
}
