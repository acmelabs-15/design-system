import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { itemCss } from "../item/item.styles.js";

@customElement("acme-entity-list")
export class AcmeEntityList extends AcmeElement {
  static styles = [
    sharedCss,
    itemCss,
    css`:host{display:block;border-radius:5px;box-shadow:var(--ds-shadow-border);background:var(--surface);overflow:hidden} ::slotted(acme-entity){border-bottom:1px solid var(--border)} ::slotted(acme-entity:last-child){border-bottom:0} ::slotted(acme-entity){--entity-pad:16px}`,
  ];
  render() {
    return html`<div class="items entity" role="list"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-entity-list": AcmeEntityList;
  }
}
