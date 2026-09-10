import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { menuDividerCss } from "./menu-divider.styles";

/** A 1px separator row between the rows of a menu, bleeding into the list's padding. */
@customElement("acme-menu-divider")
export class AcmeMenuDivider extends AcmeElement {
  static styles = [
    sharedCss,
    menuDividerCss,
    css`
      :host {
        display: block;
      }
      .divider {
        list-style: none;
      }
    `,
  ];
  render() {
    return html`<li class="divider" role="separator" part="divider"></li>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-menu-divider": AcmeMenuDivider;
  }
}
