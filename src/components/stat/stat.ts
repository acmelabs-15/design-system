import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { badgeCss } from "../badge/badge.styles";
import { statusDotCss } from "../status-dot/status-dot.styles";
import { trendCss } from "../trend/trend.styles";
import { statCss } from "./stat.styles";

/** House Stat: the one component for a headline figure. Slots: label, context, icon, end, default (value), unit, trend, delta, desc, meter, spark, meta, foot. */
@customElement("acme-stat")
export class AcmeStat extends AcmeElement {
  static styles = [
    sharedCss,
    statCss,
    trendCss,
    badgeCss,
    statusDotCss,
    css`
      :host {
        display: flex;
        flex: 1;
        min-width: 0;
      }
      dl {
        width: 100%;
      }
      .value ::slotted(acme-trend) {
        align-self: center;
      }
      .meter ::slotted(*) {
        display: block;
      }
    `,
  ];
  @property() label = "";
  @property() context = "";
  @property() unit = "";
  @property({ type: Boolean, attribute: "title-label" }) titleLabel = false;
  @property({ type: Number }) meter = -1;
  @property() meterLabel = "";
  @property({ type: Boolean, attribute: "meter-warn" }) meterWarn = false;
  render() {
    return html`<dl class="stat" part="stat">
      <div class="head"><slot name="icon"></slot><dt class=${this.cls("label", { title: this.titleLabel })}>${this.label}<slot name="label"></slot></dt><dd class=${this.cls("context", { sub: this.titleLabel })}>${this.context}<slot name="context"></slot></dd><span class="end"><slot name="end"></slot></span></div>
      <dd class="value"><slot></slot>${this.unit ? html`<span class="unit">${this.unit}</span>` : nothing}<slot name="trend"></slot></dd>
      <slot name="delta"></slot><slot name="desc"></slot>
      ${this.meter >= 0 ? html`<dd class=${this.cls("meter", { warn: this.meterWarn })}>${this.meterLabel ? html`<div class="meter-label lg">${this.meterLabel}</div>` : nothing}<div class="track"><span class="fill" style=${`width:${Math.min(100, this.meter)}%`}></span></div><slot name="meter-label"></slot></dd>` : nothing}
      <slot name="spark"></slot><slot name="meta"></slot><slot name="foot"></slot>
    </dl>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-stat": AcmeStat;
  }
}
