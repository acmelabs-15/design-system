import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base.js";
import { buttonCss } from "../button/button.styles.js";

/** Geist Split Button: the primary action joined to a menu of close variants. */
@customElement("acme-split-button")
export class AcmeSplitButton extends AcmeElement {
  static styles = [sharedCss, buttonCss, css`:host{display:inline-block;position:relative}`];
  @property() variant: "primary" | "secondary" = "primary";
  @property() size: "small" | "medium" | "large" = "medium";
  @property({ attribute: "menu-label" }) menuLabel = "More options";
  render() {
    const c = { primary: this.variant === "primary", sm: this.size === "small", lg: this.size === "large" };
    return html`<acme-menu align="end"><span slot="trigger" class="btn-group split"><button class=${this.cls("btn", c)} @click=${(e: Event) => {
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent("acme-click", { bubbles: true, composed: true }));
    }}><slot></slot></button><button class=${this.cls("btn", c)} aria-label=${this.menuLabel} aria-haspopup="true">${glyph("chev-d")}</button></span><slot name="items" slot="items"></slot></acme-menu>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-split-button": AcmeSplitButton;
  }
}
