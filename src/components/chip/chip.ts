import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { chipCss } from "./chip.styles";

/** House chip: a pressable filter pill; `pressed` fills solid. */
@customElement("acme-chip")
export class AcmeChip extends AcmeElement {
  static styles = [sharedCss, chipCss];
  @property({ type: Boolean, reflect: true }) pressed = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  render() {
    return html`<button class="chip" aria-pressed=${this.pressed} ?disabled=${this.disabled} @click=${() => {
      this.pressed = !this.pressed;
      this.dispatchEvent(new CustomEvent("acme-change", { detail: { pressed: this.pressed }, bubbles: true }));
    }} part="chip"><slot></slot></button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-chip": AcmeChip;
  }
}
