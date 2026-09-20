import { html } from "lit";

import { AcmeElement, sharedCss } from "../../base";
import { tagCss } from "../../generated/components/tag/tag.styles";

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
