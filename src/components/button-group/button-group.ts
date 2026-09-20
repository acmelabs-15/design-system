import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { buttonCss } from "../../generated/components/button/button.styles";

/** A joined group of buttons; add `split` for the Geist split button. */

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
