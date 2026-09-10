import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { commandMenuGroupCss } from "../command-menu/command-menu-group.styles";

/**
 * A group of command menu rows under a `heading` (Title Case, one or two words): a 36px row of
 * 13px gray text over the slotted `acme-command-item` rows. The menu hides the group while no row
 * in it matches the query. `page` keeps the group, rows included, to one page of the menu.
 */
@customElement("acme-command-group")
export class AcmeCommandGroup extends AcmeElement {
  static styles = [sharedCss, commandMenuGroupCss];
  @property() heading = "";
  /** The page of the menu the group belongs to; unset, the root page. */
  @property() page = "";

  /** The group's rows, in order. */
  get items() {
    return Array.from(this.querySelectorAll("acme-command-item"));
  }

  render() {
    return html`<div class="group" role="presentation" part="group">
      ${this.heading ? html`<div class="heading" aria-hidden="true" id="heading" part="heading">${this.heading}</div>` : nothing}
      <div class="items" role="group" aria-labelledby=${this.heading ? "heading" : nothing} part="items"><slot></slot></div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-command-group": AcmeCommandGroup;
  }
}
