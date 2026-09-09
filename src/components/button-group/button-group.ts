import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { buttonCss } from "../button/button.styles.js";

/** A joined group of buttons; add `split` for the Geist split button. */
@customElement("acme-button-group")
export class AcmeButtonGroup extends AcmeElement {
  static styles = [sharedCss, buttonCss];
  @property({ type: Boolean }) split = false;
  render() {
    return html`<span class=${this.cls("btn-group", { split: this.split })} part="group"><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-button-group": AcmeButtonGroup;
  }
}
