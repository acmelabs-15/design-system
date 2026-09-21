import { appbarStructureCss } from "../../generated/components/appbar/appbar-structure.styles";
import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { StoreSelector } from "../../shared/store-connection";
import { buttonCss } from "../../generated/components/button/button.styles";
import { appbarCss } from "../../generated/components/appbar/appbar.styles";

/** House app bar: sticky, brand left, section links middle, tools right, with an appearance preference control. */

export class AcmeAppbar extends AcmeElement {
  constructor() {
    super();
    new StoreSelector(this, () => this.themeContext.scope.effective);
  }
  static styles = [sharedCss, appbarCss, buttonCss, appbarStructureCss];
  @property() name = "";
  @property() meta = "";
  @property() href = "#";
  @property({ type: Boolean, attribute: "no-theme" }) noTheme = false;
  render() {
    return html`<header class="appbar" part="appbar"><a class="brand" href=${this.href}><span class="logo"><slot name="logo"></slot></span><span><span class="name">${this.name}</span> ${this.meta ? html`<span class="meta">${this.meta}</span>` : nothing}</span></a><slot name="crumbs"></slot><nav class="appbar-nav" aria-label="Sections"><slot></slot></nav><div class="tools"><slot name="tools"></slot>${this.noTheme ? nothing : html`<acme-theme-switcher size="small" .value=${this.themeContext.scope.effective.get().appearance}></acme-theme-switcher>`}</div></header>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-appbar": AcmeAppbar;
  }
}
