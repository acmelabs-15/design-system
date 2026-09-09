import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { skeletonCss } from "./skeleton.styles.js";

/** Geist Skeleton: radius 5, a gray sweep; pill, rounded or squared to mirror the content. */
@customElement("acme-skeleton")
export class AcmeSkeleton extends AcmeElement {
  static styles = [sharedCss, skeletonCss, css`:host{display:inline-block;vertical-align:middle;max-width:100%}`];
  @property() width = "";
  @property() height = "";
  @property() shape: "" | "pill" | "rounded" | "squared" = "";
  @property({ type: Boolean }) still = false;
  render() {
    return html`<span class=${this.cls("skeleton", { [this.shape]: !!this.shape, still: this.still })} style=${`width:${this.width || "100%"};height:${this.height || "24px"}`} aria-hidden="true" part="skeleton"></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-skeleton": AcmeSkeleton;
  }
}
