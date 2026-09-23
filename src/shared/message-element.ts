import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss } from "../base";
import { messageSurfaceCss } from "../generated/shared/message-surface.styles";
import { atomState } from "./atom-state";
import { message, messageCatalogs } from "./messages";
import { Places } from "./places";
import { AcmeSemanticElement } from "./semantic-element";
import { StoreSelector } from "./store-connection";
export type MessageVariant = "default" | "success" | "error" | "warning" | "secondary" | "violet" | "cyan";
export type MessageSize = "small" | "medium" | "large";
/** Shared presentation for supplied section and page messages. */
export abstract class AcmeMessageElement extends AcmeSemanticElement {
  static styles = [sharedCss, messageSurfaceCss];
  protected abstract get kind(): "alert" | "banner";
  @atomState() private treatment: MessageVariant = "default";
  /** @default "default" */
  @property({ noAccessor: true, useDefault: true }) get variant(): MessageVariant {
    return this.treatment;
  }
  set variant(value: MessageVariant) {
    if (!["default", "success", "error", "warning", "secondary", "violet", "cyan"].includes(value)) throw new TypeError("Invalid message variant");
    const previous = this.treatment;
    this.treatment = value;
    this.requestUpdate("variant", previous);
  }
  @atomState() private scale: MessageSize = "medium";
  /** @default "medium" */
  @property({ noAccessor: true, useDefault: true }) get size(): MessageSize {
    return this.scale;
  }
  set size(value: MessageSize) {
    if (!["small", "medium", "large"].includes(value)) throw new TypeError("Invalid message size");
    const previous = this.scale;
    this.scale = value;
    this.requestUpdate("size", previous);
  }
  @atomState() @property({ noAccessor: true, type: Boolean }) dismissible = false;
  @atomState() @property({ noAccessor: true, useDefault: true }) heading = "";
  private readonly places = new Places(this, { places: ["heading", "start", "end", "actions"] });
  private readonly localeUpdates = new StoreSelector(this, () => this.themeContext.scope.effective);
  private readonly messageUpdates = new StoreSelector(this, () => messageCatalogs);
  private dismiss = () => {
    this.dispatchEvent(new CustomEvent("acme-request", { detail: Object.freeze({ action: "dismiss" }), bubbles: true, composed: true, cancelable: true }));
  };
  private icon() {
    if (this.variant === "success") return html`<acme-check-icon size="1em"></acme-check-icon>`;
    if (this.variant === "error") return html`<acme-error-icon size="1em"></acme-error-icon>`;
    if (this.variant === "warning") return html`<acme-warning-icon size="1em"></acme-warning-icon>`;
    return html`<acme-info-icon size="1em"></acme-info-icon>`;
  }
  render() {
    return html`<div part="root" data-kind=${this.kind} data-variant=${this.variant} data-size=${this.size}><span part="icon"><slot name="start">${this.icon()}</slot></span><div class="body"><div part="heading" ?hidden=${!this.heading && !this.places.has("heading")}><slot name="heading"><strong>${this.heading}</strong></slot></div><div part="content"><slot></slot></div></div><div part="end" ?hidden=${!this.places.has("end")}><slot name="end"></slot></div><div part="actions" ?hidden=${!this.places.has("actions")}><slot name="actions"></slot></div>${this.dismissible ? html`<acme-icon-button part="close" variant="tertiary" size="small" .ariaLabel=${message(this.themeContext.scope.effective.get().locale, "message.dismiss", "Dismiss message")} @click=${this.dismiss}><acme-close-icon></acme-close-icon></acme-icon-button>` : nothing}</div>`;
  }
}
