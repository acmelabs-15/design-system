import { css, html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { html as staticHtml, unsafeStatic } from "lit/static-html.js";
import { AcmeElement, glyphSized, sharedCss } from "../../base";
import { Interaction } from "../../shared/interaction";
import { toasts } from "../../shared/state";
import { textCopyCss } from "./text-copy.styles";
import "../tooltip/tooltip";
import { atomState } from "../../shared/atom-state";

type Layer = "copy" | "check";
const EXIT_MS = 400;

/**
 * Text with copy button. A full-width text button: the label (a `p` by default; `as` picks the
 * tag) beside a 16px icon that swaps from the copy glyph to a check for one second after a copy.
 * The leaving layer shrinks and fades (`data-phase="exiting"`) while the next one mounts. Renders
 * nothing without `text-to-copy`. `ellipsis` truncates the label; `show-tooltip` shows the text
 * to copy on hover; `success-message` goes out as a toast after a copy, and a failed copy raises an
 * error toast. Fires `acme-copy` on success. The label is the `text` part.
 */
@customElement("acme-text-copy")
export class AcmeTextCopy extends AcmeElement {
  static styles = [
    sharedCss,
    textCopyCss,
    css`
      :host {
        display: block;
      }
      acme-tooltip {
        display: block;
      }
    `,
  ];
  /** The string that goes to the clipboard; without it the element renders nothing. */
  @property({ attribute: "text-to-copy" }) textToCopy = "";
  /** The visible label. */
  @property({ attribute: "text-label" }) textLabel = "";
  /** The toast after a successful copy. */
  @property({ attribute: "success-message" }) successMessage = "";
  /** Truncates the label with an ellipsis. */
  @property({ type: Boolean }) ellipsis = false;
  /** Shows the text to copy in a tooltip on hover. */
  @property({ type: Boolean, attribute: "show-tooltip" }) showTooltip = false;
  /** The label's tag. */
  @property() as = "p";
  @atomState() private copied = false;
  @atomState() private exiting?: Layer;
  @atomState() private phase: "entering" | "entered" = "entered";
  @atomState() private enterAnimated = false;
  @query(".text-copy") private root!: HTMLElement;
  private interaction = new Interaction(this);
  private timer?: ReturnType<typeof setTimeout>;
  private exitTimer?: ReturnType<typeof setTimeout>;

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this.timer);
    clearTimeout(this.exitTimer);
  }

  updated() {
    this.interaction.attach(this.root);
    if (this.phase === "entering") requestAnimationFrame(() => (this.phase = "entered"));
  }

  /** Swaps the active layer: the old one exits for 400ms, the new one enters animated. */
  private swap(copied: boolean) {
    if (copied === this.copied) return;
    this.exiting = this.copied ? "check" : "copy";
    this.copied = copied;
    this.phase = "entering";
    this.enterAnimated = true;
    clearTimeout(this.exitTimer);
    this.exitTimer = setTimeout(() => (this.exiting = undefined), EXIT_MS);
  }

  private copy = () => {
    const text = this.textToCopy;
    if (!text) return;
    clearTimeout(this.timer);
    this.swap(true);
    navigator.clipboard
      .writeText(text)
      .then(() => {
        if (this.successMessage) toasts.show(this.successMessage);
        this.dispatchEvent(new CustomEvent("acme-copy", { detail: { text }, bubbles: true, composed: true }));
      })
      .catch(() => toasts.error("Failed to copy to clipboard"));
    this.timer = setTimeout(() => this.swap(false), 1000);
  };

  private layer(id: Layer, phase: string, animate: boolean) {
    return html`<div class="layer" data-phase=${phase} data-enter=${animate ? "animate" : nothing}>${glyphSized(id === "check" ? "check" : "copy")}</div>`;
  }

  render() {
    if (!this.textToCopy) return nothing;
    const active: Layer = this.copied ? "check" : "copy";
    const tag = unsafeStatic(/^[a-z][a-z0-9-]*$/i.test(this.as) ? this.as : "p");
    const body = html`<div class="body">
      ${staticHtml`<${tag} class="text" part="text">${this.textLabel}</${tag}>`}
      <div class="swap">${this.exiting ? this.layer(this.exiting, "exiting", false) : nothing}${this.layer(active, this.phase, this.enterAnimated)}</div>
    </div>`;
    return html`<button class=${this.cls("text-copy", { ellipsis: this.ellipsis })} type="button" @click=${this.copy} part="button">
      ${this.showTooltip ? html`<acme-tooltip text=${this.textToCopy}>${body}</acme-tooltip>` : body}
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-text-copy": AcmeTextCopy;
  }
}
