import { css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { AcmeElement, glyphSized, sharedCss } from "../../base";
import { toasts } from "../../shared/state";
import type { ButtonColors, ButtonSize, ButtonVariant } from "../button/button";
import { copyButtonCss } from "./copy-button.styles";
import "../button/button";

/**
 * Copy button. An icon-only button (secondary, square, medium by default) that writes
 * `text-to-copy` to the clipboard. Its icon is a stack of two layers, the check and the copy
 * glyph, that swap for one second after a successful copy (or while `copied` is set), with an
 * assertive status line for screen readers. A failed copy raises an error toast. Fires
 * `acme-copy` on success and `acme-copy-error` on failure; a slotted `icon` replaces the copy glyph.
 *
 * The button inside is an `acme-button`, and its `button` part is forwarded with `exportparts`, so an
 * element that composes this one reaches the real button with `acme-copy-button::part(button)` rather
 * than landing on the host in between.
 */
@customElement("acme-copy-button")
export class AcmeCopyButton extends AcmeElement {
  static styles = [
    sharedCss,
    copyButtonCss,
    css`
      :host {
        display: inline-flex;
      }
      acme-button {
        display: inline-block;
      }
    `,
  ];
  /** The string that goes to the clipboard. */
  @property({ attribute: "text-to-copy" }) textToCopy = "";
  /** The accessible name: what is copied ("copy text"). */
  @property() label = "";
  /** The native tooltip. */
  @property() title = "";
  @property() variant: ButtonVariant = "secondary";
  @property() shape: "square" | "circle" | "rounded" = "square";
  @property() size: ButtonSize = "medium";
  /** The HTML button type. */
  @property() type: "button" | "submit" | "reset" = "button";
  @property({ type: Boolean, reflect: true }) disabled = false;
  /** Shows the check instead of the copy glyph (controlled; the button also sets it for a second after a copy). */
  @property({ type: Boolean }) copied = false;
  /** Custom colors at rest; any of `normal`, `hover`, `active` switches the button to the custom variant. */
  @property({ type: Object }) normal?: ButtonColors;
  @property({ type: Object }) hover?: ButtonColors;
  @property({ type: Object }) active?: ButtonColors;
  @state() private done = false;
  private timer?: ReturnType<typeof setTimeout>;

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this.timer);
  }

  /** Writes `text-to-copy` to the clipboard, shows the check for a second, and fires `acme-copy`.
   *  Public because an element that composes this one exposes its own `copy()` and delegates here. */
  copy = async () => {
    const text = this.textToCopy;
    clearTimeout(this.timer);
    try {
      await navigator.clipboard.writeText(text);
      this.done = true;
      this.timer = setTimeout(() => {
        this.done = false;
      }, 1000);
      this.dispatchEvent(new CustomEvent("acme-copy", { detail: { text }, bubbles: true, composed: true }));
    } catch {
      toasts.error("Failed to copy to clipboard");
      this.dispatchEvent(new CustomEvent("acme-copy-error", { detail: { text }, bubbles: true, composed: true }));
    }
  };

  render() {
    const copied = this.copied || this.done;
    const custom = !!(this.normal || this.hover || this.active);
    return html`<acme-button
      variant=${custom ? "custom" : this.variant}
      shape=${this.shape}
      size=${this.size}
      type=${this.type}
      svg-only
      ?disabled=${this.disabled}
      aria-label=${this.label || nothing}
      title=${this.title || nothing}
      .normal=${this.normal}
      .hover=${this.hover}
      .active=${this.active}
      @click=${this.copy}
      exportparts="button"
    >
      ${copied ? html`<div class="sr" role="status" aria-live="assertive">Copied!</div>` : nothing}
      <div class=${this.cls("stack", { copied })}>
        <div class="check">${glyphSized("check")}</div>
        <div class="copy"><slot name="icon">${glyphSized("copy")}</slot></div>
      </div>
    </acme-button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-copy-button": AcmeCopyButton;
  }
}
