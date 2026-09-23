import { html } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { atomState } from "../../shared/atom-state";
import { cardStructureCss } from "../../generated/components/card/card-structure.styles";
/** A related-content surface with optional padded regions.
 * @slot - Card sections, media or other author-owned content.
 * @csspart root - The native surface.
 * @cssprop --acme-card-padding - Padding supplied to the sections.
 * @cssprop --acme-card-radius - Surface and media corner radius.
 */
export class AcmeCard extends AcmeSemanticElement {
  static styles = [sharedCss, cardStructureCss];
  @atomState() @property({ noAccessor: true, reflect: true, useDefault: true }) variant: "default" | "outline" | "subtle" = "default";
  @atomState() @property({ noAccessor: true, reflect: true, useDefault: true }) size: "small" | "medium" | "large" = "medium";
  @atomState() @property({ noAccessor: true, reflect: true, useDefault: true }) as: "div" | "section" | "article" = "div";
  render() {
    switch (this.as) {
      case "section":
        return html`<section part="root"><slot></slot></section>`;
      case "article":
        return html`<article part="root"><slot></slot></article>`;
      default:
        return html`<div part="root"><slot></slot></div>`;
    }
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-card": AcmeCard;
  }
}
