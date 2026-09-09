import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { buttonCss } from "../button/button.styles.js";
import { panelCss } from "../panel/panel.styles.js";

@customElement("acme-panel-foot")
export class AcmePanelFoot extends AcmeElement {
  static styles = [sharedCss, panelCss, buttonCss, css`:host{display:block} .panel-f .actions{margin-left:auto;display:flex;gap:8px}`];
  @property({ type: Boolean }) tinted = false;
  render() {
    return html`<div class=${this.cls("panel-f", { tinted: this.tinted })}><slot></slot><div class="actions"><slot name="actions"></slot></div></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-panel-foot": AcmePanelFoot;
  }
}
