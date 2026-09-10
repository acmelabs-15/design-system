import { css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { entityListCss } from "./entity-list.styles";
import { entityListWrapCss } from "./entity-list-wrap.styles";

/**
 * Entity list: a list in the page background, ringed by the border shadow, radius 5, clipping its
 * rows; every row but the last carries a 1px divider. The rows are acme-entity elements in the
 * default slot. A `header` slot stacks a heading over the list (12px apart); the list then rounds
 * its bottom corners only.
 */
@customElement("acme-entity-list")
export class AcmeEntityList extends AcmeElement {
  static styles = [
    sharedCss,
    entityListCss,
    entityListWrapCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  @state() private hasHeader = false;

  connectedCallback() {
    super.connectedCallback();
    this.hasHeader ||= !!this.querySelector(':scope > [slot="header"]');
  }

  firstUpdated() {
    this.hasHeader ||= !!this.querySelector(':scope > [slot="header"]');
  }

  private headerSlotted = (e: Event) => {
    this.hasHeader = (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).some((n) => n.nodeType === 1 || (n.textContent ?? "").trim());
  };

  render() {
    const header = html`<slot name="header" @slotchange=${this.headerSlotted}></slot>`;
    const list = html`<ul class=${this.cls("list", { headed: this.hasHeader })} part="list"><slot></slot></ul>`;
    return this.hasHeader ? html`<div class="wrap" part="wrap">${header}${list}</div>` : html`${header}${list}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-entity-list": AcmeEntityList;
  }
}
