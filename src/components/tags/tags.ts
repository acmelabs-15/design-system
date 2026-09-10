import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { tagCss } from "../tag/tag.styles";

@customElement("acme-tags")
export class AcmeTags extends AcmeElement {
  static styles = [sharedCss, tagCss];
  render() {
    return html`<span class="tags"><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-tags": AcmeTags;
  }
}
