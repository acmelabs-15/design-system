import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { AcmeSizedTypographyElement } from "../../shared/typography-element";
import { atomState } from "../../shared/atom-state";
import { optionalString } from "../../shared/attributes";
import { linkStructureCss } from "../../generated/components/link/link-structure.styles";
import { Places } from "../../shared/places";

/** Native navigation with inline content and optional affixes.
 * @slot - Link content.
 * @slot start - Leading content.
 * @slot end - Trailing content.
 * @csspart root - The native anchor.
 * @csspart start - The leading slot.
 * @csspart end - The trailing slot.
 */
export class AcmeLink extends AcmeSizedTypographyElement {
  static styles = [...AcmeSizedTypographyElement.styles, linkStructureCss];
  static shadowRootOptions = { ...AcmeSizedTypographyElement.shadowRootOptions, delegatesFocus: true };
  @atomState() @property({ noAccessor: true, useDefault: true }) href = "";
  @atomState() @property({ noAccessor: true, useDefault: true }) target = "";
  @atomState() @property({ noAccessor: true, useDefault: true }) rel = "";
  @atomState() @property({ noAccessor: true, converter: optionalString }) download?: string;
  @atomState() @property({ noAccessor: true, reflect: true, useDefault: true }) underline: "auto" | "always" | "none" = "auto";
  @atomState() @property({ type: Boolean, noAccessor: true, reflect: true }) disabled = false;
  private readonly places = new Places(this, { places: ["start", "end"] });
  protected get semanticDefaults() {
    return this.disabled ? { role: "link" } : {};
  }
  private activate = (event: Event) => {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };
  render() {
    const start = html`<slot name="start"></slot>`,
      end = html`<slot name="end"></slot>`;
    return html`<a part="root" href=${this.disabled || !this.href ? nothing : this.href} target=${this.target || nothing} rel=${this.rel || nothing} download=${this.download ?? nothing} aria-disabled=${this.disabled ? "true" : nothing} tabindex=${this.disabled ? "-1" : nothing} @click=${this.activate} @auxclick=${this.activate}>${this.places.has("start") ? html`<span part="start">${start}</span>` : start}<slot></slot>${this.places.has("end") ? html`<span part="end">${end}</span>` : end}</a>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-link": AcmeLink;
  }
}
