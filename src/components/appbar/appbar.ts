import { appbarStructureCss } from "../../generated/components/appbar/appbar-structure.styles";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { buttonCss } from "../../generated/components/button/button.styles";
import { appbarCss } from "../../generated/components/appbar/appbar.styles";

/** House app bar: sticky, brand left, section links middle, tools right, with the Geist theme switcher. */
@customElement("acme-appbar")
export class AcmeAppbar extends AcmeElement {
  static styles = [
    sharedCss,
    appbarCss,
    buttonCss,
    appbarStructureCss,
  ];
  @property() name = "";
  @property() meta = "";
  @property() href = "#";
  @property({ type: Boolean, attribute: "no-theme" }) noTheme = false;
  render() {
    return html`<header class="appbar" part="appbar"><a class="brand" href=${this.href}><span class="logo"><slot name="logo"></slot></span><span><span class="name">${this.name}</span> ${this.meta ? html`<span class="meta">${this.meta}</span>` : nothing}</span></a><slot name="crumbs"></slot><nav class="appbar-nav" aria-label="Sections"><slot></slot></nav><div class="tools"><slot name="tools"></slot>${this.noTheme ? nothing : html`<acme-theme-switcher small></acme-theme-switcher>`}</div></header>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-appbar": AcmeAppbar;
  }
}
