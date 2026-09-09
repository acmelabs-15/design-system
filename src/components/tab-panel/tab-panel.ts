import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";

@customElement("acme-tab-panel")
export class AcmeTabPanel extends AcmeElement {
  static styles = [sharedCss, css`:host{display:block}:host([hidden]){display:none}`];
  @property() value = "";
  render() {
    return html`<div role="tabpanel"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-tab-panel": AcmeTabPanel;
  }
}
