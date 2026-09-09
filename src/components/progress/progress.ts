import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { progressCss } from "./progress.styles.js";

/** Geist Progress: 10px, radius 6, gray track; success blue, error red, warning amber. */
@customElement("acme-progress")
export class AcmeProgress extends AcmeElement {
  static styles = [sharedCss, progressCss];
  @property({ type: Number }) value = 0;
  @property({ type: Number }) max = 100;
  @property() variant: "" | "success" | "error" | "warning" | "secondary" = "";
  @property({ type: Number }) height = 10;
  @property({ type: Array }) stops: number[] = [];
  @property({ attribute: "aria-label" }) label = "";
  render() {
    const pct = Math.max(0, Math.min(100, (this.value / this.max) * 100));
    return html`<div class=${this.cls("progress", { [this.variant]: !!this.variant, sm: this.height <= 4 })} style=${this.height !== 10 && this.height > 4 ? `height:${this.height}px` : nothing} role="progressbar" aria-valuemin="0" aria-valuemax=${this.max} aria-valuenow=${this.value} aria-label=${this.label || nothing} part="track"><i style=${`width:${pct}%`} part="value"></i>${this.stops.map((s) => html`<span class="stop" style=${`left:${(s / this.max) * 100}%`}></span>`)}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-progress": AcmeProgress;
  }
}
