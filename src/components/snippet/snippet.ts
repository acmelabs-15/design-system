import { css, html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { AcmeElement, boolish, glyphSized, sharedCss } from "../../base";
import { Interaction } from "../../shared/interaction";
import { toasts } from "../../shared/state";
import "../button/button";
import { copyButtonCss } from "../copy-button/copy-button.styles";
import { snippetCss } from "./snippet.styles";

const text = { fromAttribute: (v: string | null): string | string[] => (v?.trim().startsWith("[") ? (JSON.parse(v) as string[]) : (v ?? "")) };

/**
 * Snippet: one copyable command in 13/20 mono inside a 6px-radius bordered box, with a `$ `
 * prompt before each line and a 32px square copy button at the right, whose icon stack swaps to
 * a check for one second after a copy (or while `copied` is set). `text` takes a string or a
 * JSON array of lines; `copy-text` is copied instead when set. `dark` inverts the box; `type`
 * tints it success, error or warning, `fill` fills it; `placeholder` shows in an empty snippet at
 * half opacity; `compact` is the 36px one-line box; `icon="false"` drops the button and
 * `not-focusable` disables it. Fires `acme-copy` after a copy; a failed copy raises an error toast.
 */
@customElement("acme-snippet")
export class AcmeSnippet extends AcmeElement {
  static styles = [
    sharedCss,
    snippetCss,
    copyButtonCss,
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
  @property() type: "" | "success" | "error" | "warning" = "";
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
  @state() private done = false;
  @query(".action") private action!: HTMLElement | null;
  private timer?: ReturnType<typeof setTimeout>;
  private interaction = new Interaction(this);

  /** The lines shown. */
  get lines(): string[] {
    return Array.isArray(this.text) ? this.text : this.text ? [this.text] : [];
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this.timer);
  }

  updated() {
    this.interaction.attach(this.action);
  }

  async copy() {
    const value = this.copyText || (Array.isArray(this.text) ? this.text.join("\n") : this.text);
    clearTimeout(this.timer);
    try {
      await navigator.clipboard.writeText(value);
      this.done = true;
      this.timer = setTimeout(() => {
        this.done = false;
      }, 1000);
      this.dispatchEvent(new CustomEvent("acme-copy", { detail: { text: value }, bubbles: true, composed: true }));
    } catch {
      toasts.error("Failed to copy to clipboard");
    }
  }

  render() {
    const copied = this.copied || this.done;
    const empty = !this.text && !!this.placeholder;
    const c = this.cls("snippet", {
      "no-prompt": !this.prompt,
      dark: this.dark,
      [this.type]: !!this.type,
      fill: this.fill && !!this.type,
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
              <acme-button variant="secondary" shape="square" size="small" svg-only ?disabled=${this.notFocusable} aria-label="Copy to clipboard" @click=${this.copy} part="button"
                >${copied ? html`<div class="sr" role="status" aria-live="assertive">Copied!</div>` : nothing}<div class=${this.cls("stack", { copied })}>
                  <div class="check">${glyphSized("check")}</div>
                  <div class="copy"><slot name="icon">${glyphSized("copy")}</slot></div>
                </div></acme-button
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
