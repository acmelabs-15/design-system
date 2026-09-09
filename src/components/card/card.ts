import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { cardCss } from "./card.styles.js";

/** House card: the block that must read as its own object. */
@customElement("acme-card")
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
