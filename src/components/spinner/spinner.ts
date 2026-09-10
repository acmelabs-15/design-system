import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { spinnerCss } from "./spinner.styles";

export type SpinnerSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
/** Per size: [blade count, cycle ms, modifier class]. The box and blade sizes are in the styles. */
const SIZES: Record<SpinnerSize, [number, number, string]> = {
  sm: [8, 1000, "sm"],
  md: [10, 1000, ""],
  lg: [12, 1200, "lg"],
  xl: [12, 1200, "xl"],
  "2xl": [15, 1200, "x2"],
  "3xl": [15, 1200, "x3"],
  "4xl": [18, 1300, "x4"],
};

/**
 * Spinner: blades fading in turn around a square box. The root carries the size class,
 * `role="status"` and `aria-label="Loading"`; each blade is an absolutely positioned child with
 * its rotation, cycle and delay as inline style; a visually hidden "Loading..." follows. Sizes
 * sm 12 · md 16 · lg 20 · xl 24 · 2xl 32 · 3xl 40 · 4xl 56. The blades take the current colour
 * (gray-700 by default); `color` sets it. The host carries `data-glyph="circular"`, so a badge
 * or button icon slot pulls the round glyph in like any other.
 */
@customElement("acme-spinner")
export class AcmeSpinner extends AcmeElement {
  static styles = [
    sharedCss,
    spinnerCss,
    css`
      :host {
        display: inline-flex;
      }
    `,
  ];
  /** sm · md · lg · xl · 2xl · 3xl · 4xl. */
  @property() size: SpinnerSize = "md";
  /** Any CSS colour for the blades. */
  @property() color = "";
  connectedCallback() {
    super.connectedCallback();
    this.dataset.glyph = "circular";
  }
  render() {
    const [n, dur, cls] = SIZES[this.size] ?? SIZES.md;
    const blades = Array.from({ length: n }, (_, i) => {
      const delay = -Math.round((dur * (n - 1 - i)) / n);
      const style = `--animation-delay:${delay}ms;--animation-duration:${dur}ms;animation:spinner-opacity var(--animation-duration, 1.2s) linear infinite;animation-delay:var(--animation-delay, 0);transform:rotate(${(360 * i) / n}deg) translate(146%)`;
      return html`<div class="blade" aria-hidden="true" style=${style}></div>`;
    });
    return html`<div class=${this.cls("spinner", { [cls]: !!cls })} style=${this.color ? `color:${this.color}` : nothing} role="status" aria-label="Loading" part="spinner">
      ${blades}<span class="sr">Loading...</span>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-spinner": AcmeSpinner;
  }
}
