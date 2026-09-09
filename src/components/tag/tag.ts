import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { tagCss } from "./tag.styles.js";

/** House tag: a small gray mono keyword. Wrap several in acme-tags. */
@customElement("acme-tag")
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
