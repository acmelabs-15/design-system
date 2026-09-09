import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { contextCardCss } from "./context-card.styles.js";

/** Geist Context Card: a floating white card on hover or focus, richer than a tooltip. */
@customElement("acme-context-card")
export class AcmeContextCard extends AcmeElement {
  static styles = [
    sharedCss,
    contextCardCss,
    css`:host{display:inline-block;position:relative} .context-card{position:absolute;left:50%;bottom:calc(100% + 12px);transform:translateX(-50%);opacity:0;pointer-events:none;transition:opacity var(--dur) var(--ease) .15s;z-index:30;width:max-content} :host([open]) .context-card{opacity:1;pointer-events:auto} :host([static]) .context-card{position:static;transform:none;opacity:1;pointer-events:auto}`,
  ];
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean, reflect: true }) static = false;
  private t = 0;
  render() {
    return html`<span @mouseenter=${() => {
      this.t = window.setTimeout(() => {
        this.open = true;
      }, 150);
    }} @mouseleave=${() => {
      clearTimeout(this.t);
      this.open = false;
    }} @focusin=${() => {
      this.open = true;
    }} @focusout=${() => {
      this.open = false;
    }}><slot></slot></span><div class="context-card" role="dialog"><slot name="content"></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-context-card": AcmeContextCard;
  }
}
