import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { fieldCss } from "../../shared/field.styles.js";
import { sliderCss } from "./slider.styles.js";

/** Geist Slider: 8px track, blue range, a 6×14 thumb. */
@customElement("acme-slider")
export class AcmeSlider extends AcmeElement {
  static styles = [sharedCss, sliderCss, fieldCss, css`:host{display:block} .slider{width:100%}`];
  @property({ type: Number }) value = 50;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 1;
  @property() label = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, attribute: "commit-on-release" }) commitOnRelease = false;
  render() {
    const pct = ((this.value - this.min) / (this.max - this.min)) * 100;
    return html`${this.label ? html`<span class="form-label">${this.label}</span>` : nothing}<input class="slider" type="range" .value=${String(this.value)} min=${this.min} max=${this.max} step=${this.step} ?disabled=${this.disabled} style=${`--pct:${pct}%`} aria-label=${this.label || nothing} @input=${(
      e: Event,
    ) => {
      this.value = Number((e.target as HTMLInputElement).value);
      if (!this.commitOnRelease) this.dispatchEvent(new CustomEvent("acme-change", { detail: { value: this.value }, bubbles: true, composed: true }));
    }} @change=${() => {
      if (this.commitOnRelease) this.dispatchEvent(new CustomEvent("acme-change", { detail: { value: this.value }, bubbles: true, composed: true }));
    }} part="input">`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-slider": AcmeSlider;
  }
}
