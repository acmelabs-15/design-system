import { tagStructureCss } from "../../generated/components/tag/tag-structure.styles";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { tagCss } from "../../generated/components/tag/tag.styles";
/** A passive keyword with optional leading and trailing content.
 * @slot - Keyword content.
 * @slot start - Leading content.
 * @slot end - Trailing content.
 * @csspart root - The tag surface.
 */
export class AcmeTag extends AcmeElement {
  static styles = [sharedCss, tagCss, tagStructureCss];
  @atomState() @property({ noAccessor: true, useDefault: true }) size: "small" | "medium" | "large" = "medium";
  render() {
    return html`<span class=${this.cls("tag", { small: this.size === "small", large: this.size === "large" })} part="root"><slot name="start"></slot><slot></slot><slot name="end"></slot></span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-tag": AcmeTag;
  }
}
