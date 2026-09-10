import { css, html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { AcmeElement, boolish, sharedCss } from "../../base";
import { Interaction } from "../../shared/interaction";
import type { AcmeCopyButton } from "../copy-button/copy-button";
import "../copy-button/copy-button";
import { snippetCss } from "./snippet.styles";

const text = { fromAttribute: (v: string | null): string | string[] => (v?.trim().startsWith("[") ? (JSON.parse(v) as string[]) : (v ?? "")) };

/**
 * Snippet: one copyable command in 13/20 mono inside a 6px-radius bordered box, with a `$ `
 * prompt before each line and a 32px square copy button at the right, whose icon stack swaps to
 * a check for one second after a copy (or while `copied` is set). `text` takes a string or a
 * JSON array of lines; `copy-text` is copied instead when set. `dark` inverts the box; `variant`
 * tints it success, error or warning, `fill` fills it; `placeholder` shows in an empty snippet at
 * half opacity; `compact` is the 36px one-line box; `icon="false"` drops the button and
 * `not-focusable` disables it. Fires `acme-copy` after a copy; a failed copy raises an error toast.
 */
@customElement("acme-snippet")
export class AcmeSnippet extends AcmeElement {
  static styles = [
    sharedCss,
    snippetCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  @property({ converter: text }) text: string | string[] = "";
  /** Goes to the clipboard instead of `text`. */
  @property({ attribute: "copy-text" }) copyText = "";
  /** `prompt="false"` for URLs, JSON and verbatim output. */
  @property({ converter: boolish }) prompt = true;
  /** `icon="false"` drops the copy button. */
  @property({ converter: boolish }) icon = true;
  @property({ type: Boolean }) dark = false;
  @property() variant: "" | "success" | "error" | "warning" = "";
  /** Fills the box with the type's color. */
  @property({ type: Boolean }) fill = false;
  /** Shown in an empty snippet, not copied. */
  @property() placeholder = "";
  /** The 36px one-line box. */
  @property({ type: Boolean }) compact = false;
  /** Disables the copy button. */
  @property({ type: Boolean, attribute: "not-focusable" }) notFocusable = false;
  /** CSS width of the box, e.g. `300px` or `100%`. */
  @property() width = "";
  /** Shows the check whatever the button did (controlled). */
  @property({ type: Boolean }) copied = false;
  /** Whether the consumer slotted an icon. An empty forwarded slot still reads as assigned content in
   *  the copy button, which would hide its own copy glyph, so the slot is forwarded only when filled. */
  @state() private hasIcon = false;
  @query(".action") private action!: HTMLElement | null;
  @query("acme-copy-button") private button?: AcmeCopyButton;
  private interaction = new Interaction(this);

  /** The lines shown. */
  get lines(): string[] {
    return Array.isArray(this.text) ? this.text : this.text ? [this.text] : [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.hasIcon = !!this.querySelector('[slot="icon"]');
  }

  updated() {
    this.interaction.attach(this.action);
    this.hasIcon = !!this.querySelector('[slot="icon"]');
  }

  /** What the copy button writes to the clipboard: `copy-text` when set, else the lines joined. */
  get clipboardText(): string {
    return this.copyText || (Array.isArray(this.text) ? this.text.join("\n") : this.text);
  }

  /** Copies the snippet, as clicking its button does. The button owns the clipboard write, the
   *  one-second check and the `acme-copy` event, which bubbles through this element. */
  copy(): void {
    this.button?.copy();
  }

  render() {
    const empty = !this.text && !!this.placeholder;
    const c = this.cls("snippet", {
      "no-prompt": !this.prompt,
      dark: this.dark,
      [this.variant]: !!this.variant,
      fill: this.fill && !!this.variant,
      placeholder: empty,
    });
    const style = `${this.width ? `width:${this.width};` : ""}height:${this.compact ? "36px" : "auto"}`;
    const lines = Array.isArray(this.text)
      ? this.text.map((l) => html`<pre>${l}</pre>`)
      : html`<pre style=${this.compact ? "height:36px;line-height:1" : nothing}>${this.text || this.placeholder}</pre>`;
    return html`<div class=${c} style=${style} part="snippet">
      ${lines}
      ${
        this.icon
          ? html`<div class="action">
              <acme-copy-button
                variant="secondary"
                shape="square"
                size="small"
                ?disabled=${this.notFocusable}
                label="Copy to clipboard"
                text-to-copy=${this.clipboardText}
                ?copied=${this.copied}
                part="button"
                >${this.hasIcon ? html`<slot name="icon" slot="icon"></slot>` : nothing}</acme-copy-button
              >
            </div>`
          : nothing
      }
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-snippet": AcmeSnippet;
  }
}
