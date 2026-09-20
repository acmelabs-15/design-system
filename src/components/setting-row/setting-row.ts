import { settingRowStructureCss } from "../../generated/components/setting-row/setting-row-structure.styles";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { settingRowCss } from "../../generated/components/setting-row/setting-row.styles";

/** Vercel setting row: a title and description with a control at the right. */

export class AcmeSettingRow extends AcmeElement {
  static styles = [
    sharedCss,
    settingRowCss,
    settingRowStructureCss,
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
