import { pillStructureCss } from "../../generated/components/pill/pill-structure.styles";
import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { atomState } from "../../shared/atom-state";
import { pillCss } from "../../generated/components/pill/pill.styles";
/** A compact passive label or native link.
 * @slot - Label content.
 * @slot start - Leading content.
 * @slot end - Trailing content.
 * @csspart root - The label or link surface.
 */
export class AcmePill extends AcmeSemanticElement {
  static styles = [sharedCss, pillCss, pillStructureCss];
  @atomState() @property({ noAccessor: true, useDefault: true }) size: "small" | "medium" | "large" = "medium";
  @atomState() @property({ noAccessor: true, useDefault: true }) variant: "outline" | "solid" = "outline";
  @atomState() @property({ noAccessor: true, type: Boolean }) count = false;
  @atomState() @property({ noAccessor: true, useDefault: true }) href = "";
  @atomState() @property({ noAccessor: true, useDefault: true }) target = "";
  @atomState() @property({ noAccessor: true, useDefault: true }) rel = "";
  focus(options?: FocusOptions) {
    this.renderRoot?.querySelector<HTMLAnchorElement>("a")?.focus(options);
  }
  render() {
    const classes = this.cls("pill", { sm: this.size === "small", lg: this.size === "large", solid: this.variant === "solid", count: this.count });
    const content = html`<slot name="start"></slot><slot></slot><slot name="end"></slot>`;
    return this.href
      ? html`<a class=${classes} part="root" href=${this.href} target=${this.target || nothing} rel=${this.rel || nothing}>${content}</a>`
      : html`<span class=${classes} part="root">${content}</span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-pill": AcmePill;
  }
}
