import { html } from "lit";
import { AcmeFormActionElement } from "../../shared/form-action-element";
/** An icon action with an author-supplied accessible name.
 * @slot - One icon.
 * @csspart root - The native control.
 * @csspart icon - The icon container.
 * @csspart spinner - The loading indicator.
 */
export class AcmeIconButton extends AcmeFormActionElement {
  protected get iconOnly() {
    return true;
  }
  /** @default "square" */
  get shape(): "square" | "circle" {
    return super.shape === "circle" ? "circle" : "square";
  }
  set shape(value: "square" | "circle" | undefined) {
    if (value !== undefined && value !== "square" && value !== "circle") throw new TypeError("Invalid icon button shape");
    super.shape = value;
  }
  private warned = false;
  protected updated(changed: Map<string, unknown>) {
    super.updated(changed);
    const named = !!this.ariaLabel?.trim() || !!this.ariaLabelledByElements?.length;
    if (!named && !this.warned) console.warn(this.localName, { code: "missing-action-name" });
    this.warned = !named;
  }
  protected renderContent() {
    return this.loading
      ? html`<acme-spinner exportparts="root:spinner" size=${this.size === "large" ? "large" : this.size === "medium" ? "medium" : "small"}></acme-spinner>`
      : html`<span class="label" part="icon"><slot></slot></span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-icon-button": AcmeIconButton;
  }
}
