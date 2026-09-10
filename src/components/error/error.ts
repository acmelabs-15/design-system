import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, glyphSized, sharedCss } from "../../base";
import { errorCss } from "./error.styles";

export type ErrorInfo = { message: string; action?: string; link?: string };

/**
 * Error: inline red copy for a failed section or resource. The root is an atomic alert; a 16px
 * icon sits left of the text; `label` adds a bold prefix ("Email Error:"); `error` renders a
 * message and an action link that opens in a new tab. Sizes small 13 / medium 14 / large 16.
 */
@customElement("acme-error")
export class AcmeError extends AcmeElement {
  static styles = [sharedCss, errorCss];
  /** The bold prefix before the message; unset shows none (`"false"` is read as none too). */
  @property({ converter: { fromAttribute: (v: string | null) => (v === null || v === "false" ? "" : v), toAttribute: (v: string) => v || "false" } }) label = "";
  @property() size: "small" | "medium" | "large" = "medium";
  /** `{ "message", "action", "link" }` as JSON: the message, then the action as a link. */
  @property({ type: Object }) error: ErrorInfo | null = null;

  render() {
    const c = this.cls("error", { sm: this.size === "small", lg: this.size === "large" });
    const action = this.error?.action
      ? html` <span class="action"><a class="link" href=${this.error.link ?? "#"} target="_blank" rel="noopener">${this.error.action}${glyphSized("ext")}</a></span>`
      : nothing;
    return html`<div class=${c} role="alert" aria-atomic="true" part="error">
      <div class="icon" aria-hidden="true">${glyphSized("alert")}</div>
      <div class="text">${this.label ? html`<b class="label">${this.label}:</b>` : nothing}<slot></slot>${this.error ? html`${this.error.message}${action}` : nothing}</div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-error": AcmeError;
  }
}
