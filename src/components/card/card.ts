import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { cardCss } from "../../generated/components/card/card.styles";

/** House card: the block that must read as its own object. */

export class AcmeCard extends AcmeElement {
  static styles = [sharedCss, cardCss];
  @property() variant: "" | "raised" | "flat" | "feature" = "";
  render() {
    return html`<div class=${this.cls("card", { [this.variant]: !!this.variant })} part="card"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-card": AcmeCard;
  }
}
