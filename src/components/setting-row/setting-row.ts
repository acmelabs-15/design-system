import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { settingRowCss } from "./setting-row.styles";

/** Vercel setting row: a title and description with a control at the right. */
@customElement("acme-setting-row")
export class AcmeSettingRow extends AcmeElement {
  static styles = [
    sharedCss,
    settingRowCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  @property() heading = "";
  render() {
    return html`<div class="setting-row" part="row"><div><div class="title">${this.heading}</div><div class="desc"><slot></slot></div></div><div class="end"><slot name="control"></slot></div></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-setting-row": AcmeSettingRow;
  }
}
