import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { buttonCss } from "../button/button.styles.js";
import { panelCss } from "../panel/panel.styles.js";

/** Geist Fieldset (and the Vercel panel): a bordered card with a title, description and a tinted footer of actions. */
@customElement("acme-fieldset")
export class AcmeFieldset extends AcmeElement {
  static styles = [sharedCss, panelCss, buttonCss, css`:host{display:block} .panel-f.tinted{justify-content:space-between}`];
  @property() heading = "";
  @property() variant: "" | "error" | "warning" = "";
  @property({ type: Boolean }) disabled = false;
  @property() status = "";
  render() {
    return html`<div class=${this.cls("panel", { [this.variant]: !!this.variant })} part="panel">
      <div class=${this.cls("panel-b form", { disabled: this.disabled })}>${this.heading ? html`<h3 class="title-lg">${this.heading}</h3>` : nothing}<slot name="description"></slot><slot></slot></div>
      <slot name="footer"><div class="panel-f tinted"><span><slot name="status">${this.status}</slot></span><div class="actions"><slot name="actions"></slot></div></div></slot>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-fieldset": AcmeFieldset;
  }
}
