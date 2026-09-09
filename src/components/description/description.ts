import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base.js";
import { descriptionCss } from "./description.styles.js";

/** Geist Description: a Title Case key and its value. */
@customElement("acme-description")
export class AcmeDescription extends AcmeElement {
  static styles = [sharedCss, descriptionCss];
  @property() title = "";
  @property({ type: Boolean }) right = false;
  @property({ type: Boolean }) ellipsis = false;
  @property() tooltip = "";
  render() {
    return html`<dl class=${this.cls("description", { right: this.right, ellipsis: this.ellipsis })} part="description"><dt>${this.title}${this.tooltip ? html`<span title=${this.tooltip}>${glyph("info", "ic")}</span>` : nothing}</dt><dd><slot></slot></dd></dl>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-description": AcmeDescription;
  }
}
