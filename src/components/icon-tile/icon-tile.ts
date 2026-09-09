import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { emptyStateCss } from "../empty-state/empty-state.styles.js";

@customElement("acme-icon-tile")
export class AcmeIconTile extends AcmeElement {
  static styles = [
    sharedCss,
    emptyStateCss,
    css`:host{display:inline-grid} .icon-tile{width:54px;height:54px;padding:10px;border-radius:var(--r);border:1px solid var(--ds-gray-alpha-200);background:var(--surface);display:grid;place-items:center;color:var(--text)} ::slotted(*){width:32px;height:32px}`,
  ];
  render() {
    return html`<span class="icon-tile"><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-icon-tile": AcmeIconTile;
  }
}
