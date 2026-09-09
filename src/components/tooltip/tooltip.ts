import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { tooltipCss } from "./tooltip.styles.js";

/** Geist Tooltip: a 13px gray-1000 bubble with a stem, on hover and focus after ~150 ms. */
@customElement("acme-tooltip")
export class AcmeTooltip extends AcmeElement {
  static styles = [
    sharedCss,
    tooltipCss,
    css`:host{display:inline-block;position:relative} .tooltip{position:absolute;left:50%;bottom:calc(100% + 10px);transform:translateX(-50%);white-space:nowrap;opacity:0;pointer-events:none;transition:opacity var(--dur) var(--ease) .15s;z-index:30} .tooltip::after{content:"";position:absolute;left:50%;top:100%;transform:translateX(-50%);border:7px solid transparent;border-top:6px solid var(--ds-gray-1000);border-bottom:0} :host([side="bottom"]) .tooltip{bottom:auto;top:calc(100% + 10px)} :host([side="bottom"]) .tooltip::after{top:auto;bottom:100%;border-top:0;border-bottom:6px solid var(--ds-gray-1000)} :host([open]) .tooltip{opacity:1} .tooltip.wrap{white-space:normal;width:max-content}`,
  ];
  @property() text = "";
  @property({ reflect: true }) side: "top" | "bottom" = "top";
  @property() variant: "" | "success" | "error" | "warning" | "violet" = "";
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean }) wrap = false;
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
    }} @keydown=${(e: KeyboardEvent) => {
      if (e.key === "Escape") this.open = false;
    }}><slot></slot></span><span class=${this.cls("tooltip", { [this.variant]: !!this.variant, wrap: this.wrap })} role="tooltip">${this.text}<slot name="content"></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-tooltip": AcmeTooltip;
  }
}
