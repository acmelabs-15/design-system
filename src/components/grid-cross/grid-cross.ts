import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { gridCss } from "../grid/grid.styles.js";

@customElement("acme-grid-cross")
export class AcmeGridCross extends AcmeElement {
  static styles = [
    sharedCss,
    gridCss,
    css`:host{position:absolute;width:21px;height:21px;transform:translate(-50%,-50%);pointer-events:none;z-index:2} :host::before,:host::after{content:"";position:absolute;background:var(--ds-gray-alpha-600)} :host::before{left:10px;top:0;width:1px;height:21px} :host::after{top:10px;left:0;height:1px;width:21px}`,
  ];
  render() {
    return html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-grid-cross": AcmeGridCross;
  }
}
