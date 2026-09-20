import { barRowsStructureCss } from "../../generated/components/bar-rows/bar-rows-structure.styles";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";

export class AcmeBarRows extends AcmeElement {
  static styles = [
    sharedCss,
    barRowsStructureCss,
  ];
  @property({ type: Boolean, reflect: true }) lined = false;
  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-bar-rows": AcmeBarRows;
  }
}
