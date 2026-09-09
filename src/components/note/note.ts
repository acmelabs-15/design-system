import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base.js";
import { buttonCss } from "../button/button.styles.js";
import { noteCss } from "./note.styles.js";

export type NoteVariant = "" | "success" | "error" | "warning" | "secondary" | "violet" | "cyan";

const ICON: Record<string, string> = { "": "info", success: "check", error: "alert", warning: "warn", secondary: "info", violet: "info", cyan: "info" };

/** Geist Note: inline contextual feedback beside the thing it describes. Slots: default, label, action. */
@customElement("acme-note")
export class AcmeNote extends AcmeElement {
  static styles = [sharedCss, noteCss, buttonCss];
  @property() variant: NoteVariant = "";
  @property({ type: Boolean }) fill = false;
  @property() size: "small" | "medium" | "large" = "medium";
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean, attribute: "no-icon" }) noIcon = false;
  render() {
    const c = this.cls("note", { [this.variant]: !!this.variant, fill: this.fill, sm: this.size === "small", lg: this.size === "large", disabled: this.disabled });
    return html`<div class=${c} role="note" part="note">${this.noIcon ? nothing : html`<slot name="icon">${glyph(ICON[this.variant])}</slot>`}<span><slot name="label"></slot><slot></slot></span><slot name="action"></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-note": AcmeNote;
  }
}
