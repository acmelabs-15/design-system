import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base.js";
import { buttonCss } from "../button/button.styles.js";
import { scrollerCss } from "./scroller.styles.js";

/** Geist Scroller: overflow along one axis with edge fades and optional scroll buttons. */
@customElement("acme-scroller")
export class AcmeScroller extends AcmeElement {
  static styles = [
    sharedCss,
    scrollerCss,
    buttonCss,
    css`:host{display:block} .scroller{max-height:var(--h,none)} .scroller.x > div{display:flex;gap:var(--gap,16px)} .btns{display:flex;gap:8px;margin-top:16px}`,
  ];
  @property() axis: "x" | "y" | "both" = "x";
  @property({ type: Boolean }) buttons = false;
  @property() label = "content";
  private by(d: number) {
    const s = this.shadowRoot!.querySelector(".scroller") as HTMLElement;
    this.axis === "y" ? s.scrollBy({ top: d * s.clientHeight * 0.8, behavior: "smooth" }) : s.scrollBy({ left: d * s.clientWidth * 0.8, behavior: "smooth" });
  }
  render() {
    return html`<div class=${this.cls("scroller", { x: this.axis !== "y", y: this.axis === "y" })} part="scroller"><div><slot></slot></div></div>${this.buttons ? html`<div class="btns"><button class="iconbtn circle sm" aria-label=${`Scroll ${this.label} ${this.axis === "y" ? "up" : "left"}`} @click=${() => this.by(-1)}>${glyph(this.axis === "y" ? "up" : "back")}</button><button class="iconbtn circle sm" aria-label=${`Scroll ${this.label} ${this.axis === "y" ? "down" : "right"}`} @click=${() => this.by(1)}>${glyph(this.axis === "y" ? "down" : "arrow")}</button></div>` : nothing}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-scroller": AcmeScroller;
  }
}
