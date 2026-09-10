import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import "../modal/modal";
import "../input/input";
import "../button/button";
import "../note/note";
import "../error/error";
import type { AcmeInput } from "../input/input";
import type { ModalDismissReason } from "../modal/modal";
import { destructiveModalCss } from "./destructive-modal.styles";

/** Why the modal cancelled: the Cancel button, the Escape key or a press outside the panel. */
export type DestructiveCancelReason = "cancel" | ModalDismissReason;

/**
 * Destructive action modal: a 480px modal that confirms a destructive action behind a typed gate.
 * The panel holds the heading, the description (the default slot) and a stack: the red band naming
 * what cannot be undone (`irreversible-description`; leave it out for a reversible action), the
 * prompt "To confirm, type the project name “my-project”" above the verification input, and the
 * inline error line (`error`). The footer holds Cancel and the red confirm button, which enables
 * only while the typed text equals `verification-phrase`; Enter in the input confirms the same
 * way. Leaving the input with a wrong non-empty value marks it invalid ("The project name must
 * match exactly."). `loading` disables the input and both buttons and spins the confirm. The
 * input gets focus on open; the typed text resets on close. The caller owns `open`: confirm
 * dispatches `acme-confirm` and leaves the modal open; Cancel, Escape and a press outside dispatch
 * `acme-cancel` (cancelable, `detail.reason`) and close it unless the event is prevented.
 */
@customElement("acme-destructive-modal")
export class AcmeDestructiveModal extends AcmeElement {
  static styles = [sharedCss, destructiveModalCss];
  /** Open state; `show()` and `close()` set it. */
  @property({ type: Boolean, reflect: true }) open = false;
  /** Title Case, Verb + Noun, a statement: "Delete Project". */
  @property() heading = "";
  /** The confirm button's label; the heading when unset. */
  @property({ attribute: "confirm-label" }) confirmLabel = "";
  @property({ attribute: "cancel-label" }) cancelLabel = "Cancel";
  /** The confirm button's variant. */
  @property({ attribute: "confirm-variant" }) confirmVariant = "error";
  /** The text the user must type exactly. */
  @property({ attribute: "verification-phrase" }) verificationPhrase = "";
  /** Names the phrase in the prompt: "To confirm, type the project name …". */
  @property({ attribute: "verification-label" }) verificationLabel = "";
  /** The red band's text: "Deleting my-project cannot be undone."; unset for a reversible action. */
  @property({ attribute: "irreversible-description" }) irreversibleDescription = "";
  /** Disables the input and both buttons and spins the confirm. */
  @property({ type: Boolean }) loading = false;
  /** An inline error under the input (a string, or an Error whose message shows); the modal stays open. */
  @property() error: string | Error | null = null;
  /** The panel's width in px. */
  @property({ type: Number }) width = 480;
  @state() private typed = "";
  /** The input has lost focus once: a wrong value reads as invalid from then on. */
  @state() private touched = false;

  show() {
    this.open = true;
  }
  close() {
    this.open = false;
  }

  private get matched() {
    return this.typed === this.verificationPhrase;
  }

  updated(ch: Map<string, unknown>) {
    if (ch.has("open") && !this.open) {
      this.typed = "";
      this.touched = false;
    }
  }

  private onInput = (e: Event) => {
    this.typed = (e.target as AcmeInput).value;
  };

  private onBlur = () => {
    this.touched = true;
  };

  /** Enter in the input submits: the confirm, gated the same way as the button. */
  private onKey = (e: KeyboardEvent) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    this.confirm();
  };

  private confirm = () => {
    if (!this.matched || this.loading) return;
    this.dispatchEvent(new CustomEvent("acme-confirm", { bubbles: true, composed: true }));
  };

  /** Asks to cancel: the cancelable `acme-cancel` event, then the close. */
  private cancel(reason: DestructiveCancelReason) {
    const ok = this.dispatchEvent(new CustomEvent<{ reason: DestructiveCancelReason }>("acme-cancel", { detail: { reason }, bubbles: true, composed: true, cancelable: true }));
    if (ok) this.close();
  }

  private onCancelClick = () => this.cancel("cancel");

  /** The modal's own dismissal (Escape, a press outside) is this element's cancel: the modal's event stops here and its close is this element's. */
  private onDismiss = (e: CustomEvent<{ reason: ModalDismissReason }>) => {
    e.preventDefault();
    e.stopPropagation();
    this.cancel(e.detail.reason);
  };

  render() {
    const mismatch = this.touched && this.typed !== "" && !this.matched;
    const inputError = mismatch ? (this.verificationLabel ? `The ${this.verificationLabel} must match exactly.` : "Doesn’t match.") : "";
    const message = this.error instanceof Error ? this.error.message : this.error;
    const prompt = `To confirm, type ${this.verificationLabel ? `the ${this.verificationLabel} ` : ""}“${this.verificationPhrase}”`;
    return html`<acme-modal .open=${this.open} width=${this.width} heading=${this.heading} initial-focus="acme-input" @acme-dismiss=${this.onDismiss} part="modal">
      <slot slot="subtitle"></slot>
      <div class=${this.cls("stack", { irreversible: !!this.irreversibleDescription, loading: this.loading, errored: !!message })} part="stack">
        ${this.irreversibleDescription ? html`<acme-note variant="error" fill part="band">${this.irreversibleDescription}</acme-note>` : nothing}
        <div class="field" part="field">
          <label class="prompt" id="prompt-label" for="prompt" part="prompt">To confirm, type ${this.verificationLabel ? html`the ${this.verificationLabel} ` : nothing}“<b class="phrase" translate="no">${this.verificationPhrase}</b>”</label>
          <acme-input
            id="prompt"
            aria-label=${prompt}
            autocomplete="off"
            translate="no"
            .value=${this.typed}
            ?disabled=${this.loading}
            .error=${inputError}
            @acme-input=${this.onInput}
            @focusout=${this.onBlur}
            @keydown=${this.onKey}
            part="input"
          ></acme-input>
        </div>
        ${message ? html`<acme-error part="error">${message}</acme-error>` : nothing}
      </div>
      <acme-button slot="actions" variant="secondary" ?disabled=${this.loading} @click=${this.onCancelClick} part="cancel">${this.cancelLabel}</acme-button>
      <acme-button slot="actions" variant=${this.confirmVariant} type="submit" ?disabled=${!this.matched || this.loading} ?loading=${this.loading} @click=${this.confirm} part="confirm">${this.confirmLabel || this.heading}</acme-button>
    </acme-modal>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-destructive-modal": AcmeDestructiveModal;
  }
}
