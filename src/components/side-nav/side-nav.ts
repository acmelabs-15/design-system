import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { shellCss } from "../shell/shell.styles.js";

@customElement("acme-side-nav")
export class AcmeSideNav extends AcmeElement {
  static styles = [
    sharedCss,
    shellCss,
    css`:host{display:block;flex:1} ::slotted(a){display:flex;align-items:center;gap:6px;height:36px;padding:0 8px 0 10px;border-radius:var(--r-sm);color:var(--text-2);font-size:14px;line-height:20px;font-weight:500;letter-spacing:-.28px;text-decoration:none;white-space:nowrap} ::slotted(a:hover){background:var(--comp);color:var(--text)} ::slotted(a[aria-current="true"]){background:var(--ds-gray-200);color:var(--text)} ::slotted(.group){padding:12px 8px 2px;font-size:12px;line-height:16px;font-weight:500;text-transform:uppercase;color:var(--ds-gray-800)}`,
  ];
  render() {
    return html`<nav class="side-nav"><slot></slot></nav>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-side-nav": AcmeSideNav;
  }
}
