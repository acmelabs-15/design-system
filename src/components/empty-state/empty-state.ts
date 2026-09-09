import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { buttonCss } from "../button/button.styles.js";
import { emptyStateCss } from "./empty-state.styles.js";

/** Geist Empty State: a bordered card with an icon tile, title, message and actions. `flat` and `quiet` are the dashboard forms. */
@customElement("acme-empty-state")
export class AcmeEmptyState extends AcmeElement {
  static styles = [sharedCss, emptyStateCss, buttonCss];
  @property() heading = "";
  @property() variant: "" | "flat" | "quiet" = "";
  render() {
    return html`<div class=${this.cls("empty-state", { [this.variant]: !!this.variant })} role="region" aria-live="polite" part="empty"><slot name="icon"></slot><div class="text">${this.heading ? html`<div class="title">${this.heading}</div>` : nothing}<p class="message"><slot></slot></p></div><div class="actions"><slot name="actions"></slot></div></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-empty-state": AcmeEmptyState;
  }
}
