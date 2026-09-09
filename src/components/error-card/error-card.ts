import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { errorCss } from "../error/error.styles.js";

/** Geist Error Card: red-100 surface with a title and message. */
@customElement("acme-error-card")
export class AcmeErrorCard extends AcmeElement {
  static styles = [sharedCss, errorCss];
  @property() title = "";
  render() {
    return html`<div class="error-card" part="card"><h3 class="title">${this.title}</h3><p class="message"><slot></slot></p></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-error-card": AcmeErrorCard;
  }
}
