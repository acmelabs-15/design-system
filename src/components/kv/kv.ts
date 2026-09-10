import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { kvCss } from "./kv.styles";

/** House key-value row with a hairline. */
@customElement("acme-kv")
export class AcmeKv extends AcmeElement {
  static styles = [
    sharedCss,
    kvCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  @property() when = "";
  @property({ type: Boolean }) soon = false;
  render() {
    return html`<div class="kv" part="row"><div class="key"><slot></slot><small><slot name="sub"></slot></small></div>${this.when ? html`<span class=${this.cls("when", { soon: this.soon })}>${this.when}</span>` : nothing}<span class="value"><slot name="value"></slot><span class="conv"><slot name="conv"></slot></span></span></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-kv": AcmeKv;
  }
}
