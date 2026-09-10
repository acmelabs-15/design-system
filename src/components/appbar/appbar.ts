import { SignalWatcher } from "@lit-labs/signals";
import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { buttonCss } from "../button/button.styles";
import { appbarCss } from "./appbar.styles";

/** House app bar: sticky, brand left, section links middle, tools right, with the Geist theme switcher. */
@customElement("acme-appbar")
export class AcmeAppbar extends SignalWatcher(AcmeElement) {
  static styles = [
    sharedCss,
    appbarCss,
    buttonCss,
    css`
      :host {
        display: block;
        position: sticky;
        top: 0;
        z-index: 100;
      }
      .appbar {
        position: static;
      }
      ::slotted(a) {
        display: inline-flex;
        align-items: center;
        height: 30px;
        padding: 0 10px;
        border-radius: var(--r-sm);
        color: var(--text-2);
        font-size: 14px;
        line-height: 20px;
        white-space: nowrap;
        text-decoration: none;
      }
      ::slotted(a:hover) {
        color: var(--text);
        background: var(--comp);
      }
      ::slotted(a[aria-current="true"]) {
        color: var(--text);
        font-weight: 500;
      }
    `,
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
