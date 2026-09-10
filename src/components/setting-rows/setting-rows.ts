import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { settingRowCss } from "../setting-row/setting-row.styles";

@customElement("acme-setting-rows")
export class AcmeSettingRows extends AcmeElement {
  static styles = [
    sharedCss,
    settingRowCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  render() {
    return html`<div class="setting-rows"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-setting-rows": AcmeSettingRows;
  }
}
