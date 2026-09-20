import { menuSectionStructureCss } from "../../generated/components/menu-section/menu-section-structure.styles";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { menuSectionCss } from "../../generated/components/menu-section/menu-section.styles";

let seq = 0;

/**
 * A titled group of rows inside a menu: the `title` (the native attribute is consumed, so it never
 * shows as a tooltip; `heading` is the same) in gray-800 over a plain group list of the slotted
 * `acme-menu-item`s.
 */

export class AcmeMenuSection extends AcmeElement {
  static styles = [
    sharedCss,
    menuSectionCss,
    menuSectionStructureCss,
  ];
  @property() heading = "";
  private uid = `menu-section-${(++seq).toString(36)}`;

  connectedCallback() {
    super.connectedCallback();
    if (this.hasAttribute("title")) {
      if (!this.heading) this.heading = this.getAttribute("title") ?? "";
      this.removeAttribute("title");
    }
  }

  render() {
    return html`<li class="section" role="presentation" part="section">
      <span class="heading" id=${this.uid} aria-hidden="true">${this.heading}</span>
      <ul class="group" role="group" aria-labelledby=${this.uid}><slot></slot></ul>
    </li>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-menu-section": AcmeMenuSection;
  }
}
