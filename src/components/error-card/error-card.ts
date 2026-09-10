import { html, nothing, type PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, glyphSized, sharedCss } from "../../base";
import { Interaction } from "../../shared/interaction";
import { errorCardCss } from "./error-card.styles";

/** The failure a card reports: its message and, from a server boundary, its digest. */
export type ErrorCardError = { message?: string; digest?: string };

/**
 * Error card: a red surface for a section or resource that failed to load. A red-200 column with
 * a 1px red-400 border, radius 8 and padding 16; the head centres a 16px icon and the 16/24 title.
 * `retry` appends a plain Retry control (the base button reset alone, a medium 16/24 red-900
 * label) that dispatches `acme-retry`; `retry-label` is its accessible name. `error` takes the
 * failure itself: its digest and message go to the console, the title is what the user reads.
 */
@customElement("acme-error-card")
export class AcmeErrorCard extends AcmeElement {
  static styles = [sharedCss, errorCardCss];
  /** The title line; the default slot adds rich content to it. */
  @property() heading = "";
  /** The failure, `{ "message", "digest" }` as JSON: logged to the console, never rendered. */
  @property({ type: Object }) error: ErrorCardError | null = null;
  /** Shows the Retry control; a click on it dispatches `acme-retry`. */
  @property({ type: Boolean }) retry = false;
  /** The Retry control's accessible name. */
  @property({ attribute: "retry-label" }) retryLabel = "";
  @query(".retry") private retryEl!: HTMLButtonElement | null;
  private interaction = new Interaction(this);

  willUpdate(changed: PropertyValues<this>) {
    if (!changed.has("error") || !this.error) return;
    if (this.error.digest) console.log(`Error digest: ${this.error.digest}`);
    console.log(`Error message: ${this.error.message}`);
  }

  updated() {
    this.interaction.attach(this.retryEl);
  }

  private onRetry = () => {
    this.dispatchEvent(new CustomEvent("acme-retry", { bubbles: true, composed: true }));
  };

  render() {
    const retry = this.retry
      ? html`<button class="retry" type="button" tabindex="0" aria-label=${this.retryLabel || nothing} @click=${this.onRetry} part="retry">
          <span class="retry-label"><span class="retry-text">Retry</span></span>
        </button>`
      : nothing;
    return html`<div class="card" part="card">
      <div class="head">${glyphSized("alert")}<h3 class="title">${this.heading}<slot></slot></h3></div>
      ${retry}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-error-card": AcmeErrorCard;
  }
}
