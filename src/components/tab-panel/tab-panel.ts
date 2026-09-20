import { tabPanelStructureCss } from "../../generated/components/tab-panel/tab-panel-structure.styles";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";

@customElement("acme-tab-panel")
export class AcmeTabPanel extends AcmeElement {
  static styles = [
    sharedCss,
    tabPanelStructureCss,
  ];
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
