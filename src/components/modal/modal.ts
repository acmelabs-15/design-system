import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { sharedCss } from "../../base.js";
import { Overlay } from "../../shared/overlay.js";
import { buttonCss } from "../button/button.styles.js";
import { modalCss } from "./modal.styles.js";

/** Geist Modal: 540 wide, radius 12, title and subtitle in the head, a background-200 footer. Slots: default, subtitle, actions. */
@customElement("acme-modal")
export class AcmeModal extends Overlay {
  static styles = [
    sharedCss,
    modalCss,
    buttonCss,
    css`dialog{padding:0;border:0;background:transparent;max-width:none;max-height:none;overflow:visible;color:var(--text)} dialog::backdrop{background:var(--scrim)} .modal{margin:auto} :host([static]) dialog{position:static;display:block} :host([static]) .modal{width:100%;max-height:none;box-shadow:var(--ds-shadow-border-medium)}`,
  ];
  @property() heading = "";
  @property() size: "" | "narrow" | "wide" = "";
  @property({ type: Boolean, reflect: true }) static = false;
  render() {
    return html`<dialog @cancel=${this.onCancel} @click=${this.backdropClick} aria-labelledby="t" ?open=${this.static}>
      <div class=${this.cls("modal", { narrow: this.size === "narrow", wide: this.size === "wide" })} part="modal">
        <div class="modal-h"><h3 id="t">${this.heading}<slot name="heading"></slot></h3><slot name="subtitle"></slot></div>
        <div class="modal-b"><slot></slot></div>
        <div class="modal-f"><slot name="actions"></slot></div>
      </div></dialog>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-modal": AcmeModal;
  }
}
