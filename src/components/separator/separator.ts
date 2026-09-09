import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";

/** Geist Separator: a 1px gray-400 rule, horizontal or vertical. */
@customElement("acme-separator")
export class AcmeSeparator extends AcmeElement {
  static styles = [
    sharedCss,
    css`:host{display:block}:host([vertical]){display:inline-block;align-self:stretch;height:var(--h,24px)} hr{border:0;border-top:1px solid var(--border);margin:var(--s-4) 0} :host([vertical]) hr{border:0;border-left:1px solid var(--border);width:0;height:100%;margin:0 var(--s-2)}`,
  ];
  @property({ type: Boolean, reflect: true }) vertical = false;
  render() {
    return html`<hr role="separator" aria-orientation=${this.vertical ? "vertical" : "horizontal"}>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-separator": AcmeSeparator;
  }
}
