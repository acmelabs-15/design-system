import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import type { AcmeTabs } from "../tabs/tabs.js";
import { tabsCss } from "../tabs/tabs.styles.js";

@customElement("acme-tab")
export class AcmeTab extends AcmeElement {
  static styles = [sharedCss, tabsCss, css`:host{display:contents} .tabs{display:contents;height:auto;box-shadow:none;padding:0}`];
  @property() value = "";
  @property({ type: Boolean, reflect: true }) selected = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property() tooltip = "";
  focus() {
    this.shadowRoot?.querySelector("button")?.focus();
  }
  render() {
    const secondary = (this.parentElement as AcmeTabs | null)?.secondary;
    return html`<div class=${this.cls("tabs", { secondary: !!secondary })}><button role="tab" aria-selected=${this.selected} tabindex=${this.selected ? 0 : -1} ?disabled=${this.disabled} title=${this.tooltip || nothing} @click=${() => this.dispatchEvent(new CustomEvent("acme-tab-click", { detail: this, bubbles: true, composed: true }))} part="tab"><slot name="icon"></slot><slot></slot></button></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-tab": AcmeTab;
  }
}
