import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { statCss } from "../stat/stat.styles.js";

@customElement("acme-stat-desc")
export class AcmeStatDesc extends AcmeElement {
  static styles = [sharedCss, statCss, css`:host{display:block} dd{margin:0}`];
  render() {
    return html`<dd class="desc"><slot></slot></dd>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-stat-desc": AcmeStatDesc;
  }
}
