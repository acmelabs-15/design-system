import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { middleTruncateCss } from "./middle-truncate.styles.js";

/** Geist Middle Truncate: keeps the head and the tail of a path or an id. */
@customElement("acme-middle-truncate")
export class AcmeMiddleTruncate extends AcmeElement {
  static styles = [sharedCss, middleTruncateCss, css`:host{display:inline-flex;min-width:0;max-width:100%}`];
  @property() text = "";
  @property({ type: Number }) tail = 8;
  render() {
    const t = this.text;
    const cut = Math.max(0, t.length - this.tail);
    return html`<span class="truncate-mid" title=${t}><span class="head">${t.slice(0, cut)}</span><span class="tail">${t.slice(cut)}</span></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-middle-truncate": AcmeMiddleTruncate;
  }
}
