import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { buttonCss } from "../button/button.styles.js";

/** Geist Load More Button: a full-width secondary button at the foot of a list. */
@customElement("acme-load-more")
export class AcmeLoadMore extends AcmeElement {
  static styles = [sharedCss, buttonCss, css`:host{display:block} .btn{width:100%} :host([no-radius]) .btn{border-radius:0}`];
  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean, attribute: "no-radius", reflect: true }) noRadius = false;
  render() {
    return html`<button class=${this.cls("btn block", { loading: this.loading })} ?disabled=${this.loading} @click=${() => this.dispatchEvent(new CustomEvent("acme-load", { bubbles: true }))}><slot>${this.loading ? "Loading..." : "Load More"}</slot></button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-load-more": AcmeLoadMore;
  }
}
