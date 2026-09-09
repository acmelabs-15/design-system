import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { bookCss } from "./book.styles.js";

/** Geist Book: a decorative cover. */
@customElement("acme-book")
export class AcmeBook extends AcmeElement {
  static styles = [sharedCss, bookCss, css`:host{display:inline-block}`];
  @property() heading = "";
  @property() author = "";
  @property() variant: "" | "simple" | "stripe" = "";
  @property() hue: "" | "blue" | "purple" | "teal" | "pink" | "green" | "gray" = "";
  render() {
    return html`<div class=${this.cls("book", { [this.variant]: !!this.variant, [`hue-${this.hue}`]: !!this.hue })} part="book"><span class="band"></span><slot name="icon"></slot><span class="title">${this.heading}<slot></slot></span>${this.author ? html`<span class="author">${this.author}</span>` : nothing}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-book": AcmeBook;
  }
}
