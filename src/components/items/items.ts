import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { itemCss } from "../item/item.styles";

@customElement("acme-items")
export class AcmeItems extends AcmeElement {
  static styles = [
    sharedCss,
    itemCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  @property({ type: Boolean }) boxed = false;
  @property({ type: Boolean }) striped = false;
  render() {
    return html`<div class=${this.cls("items", { boxed: this.boxed, striped: this.striped })}><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-items": AcmeItems;
  }
}
