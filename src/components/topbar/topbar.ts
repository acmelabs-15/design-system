import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { shellCss } from "../shell/shell.styles";

@customElement("acme-topbar")
export class AcmeTopbar extends AcmeElement {
  static styles = [
    sharedCss,
    shellCss,
    css`
      :host {
        display: block;
        position: sticky;
        top: 0;
        z-index: 5;
      }
      .topbar {
        position: static;
      }
    `,
  ];
  @property() center = "";
  render() {
    return html`<div class="topbar"><slot name="start"></slot><div class="center">${this.center}<slot name="center"></slot></div><slot name="end"></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-topbar": AcmeTopbar;
  }
}
