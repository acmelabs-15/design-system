import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { commandMenuDividerCss } from "../command-menu/command-menu-divider.styles";

/**
 * A hairline between command menu rows, 8px above and below, spanning the list's padding. The
 * menu hides it while a query narrows the list, unless `always-render`. `page` keeps it to one
 * page of the menu.
 */
@customElement("acme-command-divider")
export class AcmeCommandDivider extends AcmeElement {
  static styles = [sharedCss, commandMenuDividerCss];
  /** The line stays while a query narrows the list. */
  @property({ type: Boolean, attribute: "always-render" }) alwaysRender = false;
  /** The page of the menu the line belongs to; unset, the root page. */
  @property() page = "";

  render() {
    return html`<div class="divider" role="separator" part="divider"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-command-divider": AcmeCommandDivider;
  }
}
