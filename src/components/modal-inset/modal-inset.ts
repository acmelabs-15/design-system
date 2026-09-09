import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { modalCss } from "../modal/modal.styles.js";

/** The full-bleed tinted block inside a modal body. */
@customElement("acme-modal-inset")
export class AcmeModalInset extends AcmeElement {
  static styles = [sharedCss, modalCss, css`:host{display:block;margin:0 -20px} .modal-inset{margin:0}`];
  render() {
    return html`<div class="modal-inset"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-modal-inset": AcmeModalInset;
  }
}
