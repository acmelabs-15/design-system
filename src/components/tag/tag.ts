import { html } from "lit";

import { AcmeElement, sharedCss } from "../../base";
import { tagCss } from "../../generated/components/tag/tag.styles";

/** House tag: a small gray mono keyword. */

export class AcmeTag extends AcmeElement {
  static styles = [sharedCss, tagCss];
  render() {
    return html`<span class="tag" part="tag"><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-tag": AcmeTag;
  }
}
