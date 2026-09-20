import { panelStructureCss } from "../../generated/components/panel/panel-structure.styles";
import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { buttonCss } from "../../generated/components/button/button.styles";
import { panelHeadCss } from "../../generated/components/panel-head/panel-head.styles";
import { panelCss } from "../../generated/components/panel/panel.styles";

/** Vercel panel: radius 6, shadow border, a 56px head, a body, a footer. */

export class AcmePanel extends AcmeElement {
  static styles = [
    sharedCss,
    panelCss,
    panelHeadCss,
    buttonCss,
    panelStructureCss,
  ];
  @property() heading = "";
  @property() sub = "";
  @property() when = "";
  @property({ type: Boolean }) tight = false;
  @property({ type: Boolean }) chart = false;
  @property() variant: "" | "danger" | "error" | "warning" = "";
  render() {
    const hasHead = this.heading || this.sub;
    return html`<div class=${this.cls("panel", { chart: this.chart, [this.variant]: !!this.variant })} part="panel">${hasHead ? html`<div class="panel-h"><div><h3 class="title">${this.heading}${this.when ? html`<span class="when">${this.when}</span>` : nothing}</h3>${this.sub ? html`<p class="sub">${this.sub}</p>` : nothing}</div><div class="actions"><slot name="actions"></slot></div></div>` : nothing}<slot name="head"></slot><div class=${this.cls("panel-b", { tight: this.tight })}><slot></slot></div><slot name="footer"></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-panel": AcmePanel;
  }
}
