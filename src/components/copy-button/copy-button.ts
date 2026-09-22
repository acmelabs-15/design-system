import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeActionElement } from "../../shared/action-element";
import { actionContent } from "../../shared/action-content";
import { atomState } from "../../shared/atom-state";
import { Places } from "../../shared/places";
import { StoreSelector } from "../../shared/store-connection";
import { message, messageCatalogs } from "../../shared/messages";
/** Copies an exact string and reports completion after the clipboard operation.
 * @slot - Optional action label.
 * @slot start - Leading content.
 * @slot end - Trailing content.
 * @csspart root - The native button.
 * @csspart icon - The current copy feedback icon.
 * @fires {CustomEvent<Record<string,never>>} acme-copy - Clipboard writing succeeded.
 * @fires {CustomEvent<{code:"clipboard";message:string}>} acme-error - Clipboard writing failed.
 */
export class AcmeCopyButton extends AcmeActionElement {
  @atomState() private copyValue = "";
  /** @default "" */
  @property({ noAccessor: true }) get value() {
    return this.copyValue;
  }
  set value(value: string) {
    const previous = this.copyValue;
    this.copyValue = value ?? "";
    if (previous !== this.copyValue) {
      this.generation++;
      this.stopTimer();
      this.done = false;
    }
    this.requestUpdate("value", previous);
  }
  @atomState() private duration = 1000;
  /** @default 1000 */
  @property({ type: Number, noAccessor: true, attribute: "copied-duration", converter: { fromAttribute: (value: string | null) => (value === null ? 1000 : Number(value)) } }) get copiedDuration() {
    return this.duration;
  }
  set copiedDuration(value: number) {
    if (!Number.isFinite(value) || value < 0) throw new RangeError("copiedDuration must be nonnegative");
    this.duration = value;
  }
  @atomState() private done = false;
  private readonly content = new Places(this, { places: [""] });
  private readonly labels = new StoreSelector(this, () => messageCatalogs);
  private readonly localeChanges = new StoreSelector(this, () => this.themeContext.scope.effective);
  private timer?: { view: Window; id: number };
  private generation = 0;
  get copied(): boolean {
    return this.done;
  }
  protected get iconOnly() {
    return !this.content.has("") && !this.places.has("end");
  }
  protected get resolvedShape() {
    return this.shape ?? (this.iconOnly ? "square" : undefined);
  }
  protected get semanticDefaults() {
    return !this.content.has("") ? { label: message(this.themeContext.scope.effective.get().locale, "copy.copy", "Copy") } : {};
  }
  private stopTimer() {
    if (this.timer) this.timer.view.clearTimeout(this.timer.id);
    this.timer = undefined;
  }
  async copy(): Promise<void> {
    const generation = ++this.generation;
    this.stopTimer();
    try {
      if (this.effectiveDisabled) throw new DOMException("The copy action is unavailable", "InvalidStateError");
      const clipboard = this.ownerDocument.defaultView?.navigator.clipboard;
      if (!clipboard?.writeText) throw new DOMException("Clipboard writing is unavailable", "NotSupportedError");
      await clipboard.writeText(this.value);
      if (!this.isConnected || generation !== this.generation) return;
      this.done = true;
      this.dispatchEvent(new CustomEvent<Record<string, never>>("acme-copy", { detail: {}, bubbles: true, composed: true }));
      const view = this.ownerDocument.defaultView;
      if (view)
        this.timer = {
          view,
          id: view.setTimeout(() => {
            this.timer = undefined;
            this.done = false;
          }, this.copiedDuration),
        };
    } catch (error) {
      if (this.isConnected && generation === this.generation) {
        this.done = false;
        this.dispatchEvent(
          new CustomEvent("acme-error", {
            detail: { code: "clipboard" as const, message: message(this.themeContext.scope.effective.get().locale, "copy.error", "Could not copy text") },
            bubbles: true,
            composed: true,
          }),
        );
      }
      throw error;
    }
  }
  protected activate() {
    void this.copy().catch(() => {});
  }
  disconnectedCallback() {
    this.generation++;
    this.stopTimer();
    this.done = false;
    super.disconnectedCallback();
  }
  protected renderContent() {
    const icon = this.copied ? html`<acme-check-icon part="icon" size="16px"></acme-check-icon>` : html`<acme-content-copy-icon part="icon" size="16px"></acme-content-copy-icon>`;
    if (this.iconOnly)
      return html`<slot name="start" ?hidden=${this.copied || this.loading}></slot>${this.loading ? html`<acme-spinner size=${this.size === "large" ? "large" : this.size === "medium" ? "medium" : "small"}></acme-spinner>` : this.copied || !this.places.has("start") ? icon : undefined}<slot></slot><slot name="end"></slot>`;
    return actionContent({ loading: this.loading, size: this.size, start: this.places.has("start"), end: this.places.has("end"), leading: icon, replaceStart: this.copied, exposeParts: false });
  }
  protected renderFeedback() {
    return html`<span class="sr" role="status" aria-atomic="true">${this.copied ? message(this.themeContext.scope.effective.get().locale, "copy.copied", "Copied") : ""}</span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-copy-button": AcmeCopyButton;
  }
}
