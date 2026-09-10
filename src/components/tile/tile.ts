import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { tileCss } from "./tile.styles";

@customElement("acme-tile")
export class AcmeTile extends AcmeElement {
  static styles = [
    sharedCss,
    tileCss,
    css`
      :host {
        display: block;
        min-width: 0;
      }
    `,
  ];
  @property() label = "";
  @property() qualifier = "";
  @property({ type: Boolean }) plain = false;
  @property({ type: Boolean }) large = false;
  render() {
    return html`<div class=${this.cls("tile", { plain: this.plain, lg: this.large })} part="tile"><span class="label">${this.label}${this.qualifier ? html`<span class="q">${this.qualifier}</span>` : nothing}</span><span class="value"><slot></slot></span></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-tile": AcmeTile;
  }
}
