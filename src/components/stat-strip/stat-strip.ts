import { statStripStructureCss } from "../../generated/components/stat-strip/stat-strip-structure.styles";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { badgeCss } from "../../generated/components/badge/badge.styles";
import type { AcmeStripItem } from "../strip-item/strip-item";
import { statStripCss } from "../../generated/components/stat-strip/stat-strip.styles";

/** Vercel stat strip: selectable figures across the top of a chart card. Items: acme-strip-item. */
@customElement("acme-stat-strip")
export class AcmeStatStrip extends AcmeElement {
  static styles = [
    sharedCss,
    statStripCss,
    badgeCss,
    statStripStructureCss,
  ];
  @property() value = "";
  render() {
    return html`<div class="stat-strip" role="tablist" @acme-strip-select=${(e: CustomEvent) => {
      this.value = e.detail;
      for (const i of this.querySelectorAll<AcmeStripItem>("acme-strip-item")) i.selected = i.value === this.value;
      this.dispatchEvent(new CustomEvent("acme-change", { detail: { value: this.value }, bubbles: true }));
    }}><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-stat-strip": AcmeStatStrip;
  }
}
