import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, glyphSized, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { createStore, StoreSelector, toasts } from "../../shared/state";
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
 * The button inside is an `acme-button`, and its `button` and `label` parts are forwarded with
 * `exportparts`, so an element that composes this one reaches the real button with
 * `acme-copy-button::part(button)` and its label wrapper with `::part(label)`, rather than landing on
 * the host in between. The icon stack is exposed the same way — `stack`, `check` and `icon` — because
 * a composing element styles the glyph, which lives in this element's tree and no selector of theirs
 * can otherwise reach.
 *
 * `label` and `icon` are different boxes and a composing element must not confuse them: `label` wraps
 * the whole stack and takes the button's own inline padding; `icon` is one absolutely-positioned layer
 * inside a 16px stack, so padding on it overflows the stack instead of widening the button.
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
  /** The check shown for a second after a copy. */
  @atomState() private done = false;
  /**
   * Whether anything is slotted for the icon. A composing element forwards a slot of its own into
   * this one, and a forwarded slot counts as assigned content even when empty, so the native
   * fallback would never show. `flatten` resolves the forwarded slot to what it actually holds, and
   * the glyph is rendered beside the slot rather than inside it.
   */
  @atomState() private hasIcon = false;
  /** `copied` is either controlled from outside or set by our own copy, so it is derived from both.
   *  A derived store recomputes only when what it reads changes, which is what a store gives that a
   *  plain field does not. */
  private showsCheck = createStore(() => this.copied || this.done);
  /** Held, not read: constructing a StoreSelector registers it as a reactive controller, which is
   *  what subscribes this element to the derived store. The linter reads it as unused; deleting it
   *  stops the check swap from re-rendering. */
  private checkSelector = new StoreSelector(this, () => this.showsCheck);
  private timer?: ReturnType<typeof setTimeout>;

  private readIconSlot = (e: Event) => {
    this.hasIcon = (e.target as HTMLSlotElement).assignedElements({ flatten: true }).length > 0;
  };

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
    const copied = this.showsCheck.get();
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
      exportparts="button,label"
    >
      ${copied ? html`<div class="sr" role="status" aria-live="assertive">Copied!</div>` : nothing}
      <div class=${this.cls("stack", { copied })} part="stack">
        <div class="check" part="check">${glyphSized("check")}</div>
        <div class="copy" part="icon">
          <slot name="icon" @slotchange=${this.readIconSlot}></slot>${this.hasIcon ? nothing : glyphSized("copy")}
        </div>
      </div>
    </acme-button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-copy-button": AcmeCopyButton;
  }
}
