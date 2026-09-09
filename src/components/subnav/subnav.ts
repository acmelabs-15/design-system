import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { subnavCss } from "./subnav.styles.js";

/** Vercel sub-nav: 32px links under a top bar. */
@customElement("acme-subnav")
export class AcmeSubnav extends AcmeElement {
  static styles = [
    sharedCss,
    subnavCss,
    css`:host{display:block} ::slotted(a){display:inline-flex;align-items:center;height:32px;padding:6px 12px;border-radius:var(--r-sm);font-size:14px;line-height:20px;font-weight:500;color:var(--ds-gray-800);text-decoration:none} ::slotted(a:hover){color:var(--text)} ::slotted(a[aria-current="true"]){background:var(--ds-gray-200);color:var(--text)}`,
  ];
  render() {
    return html`<nav class="subnav" style="padding:0"><slot></slot></nav>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-subnav": AcmeSubnav;
  }
}
