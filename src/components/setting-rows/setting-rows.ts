import { settingRowsStructureCss } from "../../generated/components/setting-rows/setting-rows-structure.styles";
import { html } from "lit";

import { AcmeElement, sharedCss } from "../../base";
import { settingRowCss } from "../../generated/components/setting-row/setting-row.styles";

export class AcmeSettingRows extends AcmeElement {
  static styles = [
    sharedCss,
    settingRowCss,
    settingRowsStructureCss,
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
