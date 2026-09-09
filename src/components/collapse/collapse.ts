import { animate } from "@lit-labs/motion";
import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { collapseCss } from "./collapse.styles.js";

/** Geist Collapse: a title that reveals content; `large` is the 84px docs form. Animates unless reduced motion. */
@customElement("acme-collapse")
export class AcmeCollapse extends AcmeElement {
  static styles = [
    sharedCss,
    collapseCss,
    css`:host{display:block} details.collapse{border-top:1px solid var(--border);border-bottom:1px solid var(--border)} :host(:not(:first-of-type)) details.collapse{border-top:0}`,
  ];
  @property() heading = "";
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean }) large = false;
  render() {
    return html`<details class=${this.cls("collapse", { lg: this.large })} ?open=${this.open} @toggle=${(e: Event) => {
      this.open = (e.target as HTMLDetailsElement).open;
      this.dispatchEvent(new CustomEvent("acme-toggle", { detail: { open: this.open }, bubbles: true }));
    }} part="collapse"><summary aria-expanded=${this.open}>${this.heading}<slot name="heading"></slot></summary><div class="collapse-b" ${animate({
      in: [
        { opacity: 0, transform: "translateY(-4px)" },
        { opacity: 1, transform: "none" },
      ],
      skipInitial: true,
    })}><slot></slot></div></details>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-collapse": AcmeCollapse;
  }
}
