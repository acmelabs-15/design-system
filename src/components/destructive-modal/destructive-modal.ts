import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { glyph, sharedCss } from "../../base.js";
import { fieldCss } from "../../shared/field.styles.js";
import { Overlay } from "../../shared/overlay.js";
import { buttonCss } from "../button/button.styles.js";
import { modalCss } from "../modal/modal.styles.js";
import { noteCss } from "../note/note.styles.js";

/** Geist Destructive Action Modal: a typed gate; `phrase` must match before the primary enables. */
@customElement("acme-destructive-modal")
export class AcmeDestructiveModal extends Overlay {
  static styles = [
    sharedCss,
    modalCss,
    buttonCss,
    fieldCss,
    noteCss,
    css`dialog{padding:0;border:0;background:transparent;max-width:none;overflow:visible;color:var(--text)} dialog::backdrop{background:var(--scrim)} .modal{margin:auto} .field{margin:0} :host([static]) dialog{position:static;display:block} :host([static]) .modal{width:100%;max-height:none;box-shadow:var(--ds-shadow-border-medium)}`,
  ];
  @property() heading = "Delete Project";
  @property() phrase = "";
  @property() noun = "project name";
  @property() action = "";
  @property() irreversible = "";
  @property({ type: Boolean }) loading = false;
  @property() error = "";
  @property({ type: Boolean, reflect: true }) static = false;
  private typed = "";
  render() {
    const ok = this.typed === this.phrase && !this.loading;
    return html`<dialog @cancel=${this.onCancel} @click=${this.backdropClick} aria-labelledby="t" ?open=${this.static}>
      <form class="modal narrow" method="dialog" @submit=${(e: Event) => {
        e.preventDefault();
        if (ok) this.dispatchEvent(new CustomEvent("acme-confirm", { bubbles: true }));
      }} part="modal">
        <div class="modal-h"><h3 id="t">${this.heading}</h3><p><slot></slot></p></div>
        <div class="modal-b">
          ${this.irreversible ? html`<div class="note error fill" style="margin-bottom:24px">${glyph("alert")}<span>${this.irreversible}</span></div>` : nothing}
          <div class="field"><label class="plain" style="text-transform:none;color:var(--text)">To confirm, type the ${this.noun} “<b>${this.phrase}</b>”</label><input type="text" autocomplete="off" spellcheck="false" .value=${this.typed} aria-invalid=${this.error ? "true" : nothing} @input=${(
            e: Event,
          ) => {
            this.typed = (e.target as HTMLInputElement).value;
            this.requestUpdate();
          }}>${this.error ? html`<span class="msg error">${this.error}</span>` : nothing}</div>
        </div>
        <div class="modal-f"><button class="btn" type="button" ?disabled=${this.loading} @click=${() => this.close()}>Cancel</button><button class=${this.cls("btn primary", { loading: this.loading })} type="submit" ?disabled=${!ok}>${this.action || this.heading}</button></div>
      </form></dialog>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-destructive-modal": AcmeDestructiveModal;
  }
}
