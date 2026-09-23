import { html } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss } from "../../base";
import { emptyStateSurfaceCss } from "../../generated/shared/empty-state-surface.styles";
import { atomState } from "../../shared/atom-state";
import { Places } from "../../shared/places";
import { AcmeSemanticElement } from "../../shared/semantic-element";
/** An empty collection or view with authored headings and actions.
 * @slot - Composed Empty State Content or additional content.
 * @slot indicator - Optional illustration or Empty State Indicator.
 * @slot heading - Authored heading at the correct document level.
 * @slot description - Explanation of the empty state.
 * @slot actions - Application-owned actions.
 * @csspart root - Empty-state surface.
 * @csspart indicator - Indicator region.
 * @csspart content - Text region.
 * @csspart heading - Heading region.
 * @csspart description - Description region.
 * @csspart actions - Actions region.
 */
export class AcmeEmptyState extends AcmeSemanticElement {
  static styles = [sharedCss, emptyStateSurfaceCss];
  @atomState() private scale: "small" | "medium" | "large" = "medium";
  /** @default "medium" */
  @property({ noAccessor: true, useDefault: true }) get size() {
    return this.scale;
  }
  set size(value: "small" | "medium" | "large") {
    if (!["small", "medium", "large"].includes(value)) throw new TypeError("Invalid Empty State size");
    const previous = this.scale;
    this.scale = value;
    this.requestUpdate("size", previous);
  }
  @atomState() private treatment: "default" | "outline" | "subtle" = "default";
  /** @default "default" */
  @property({ noAccessor: true, useDefault: true }) get variant() {
    return this.treatment;
  }
  set variant(value: "default" | "outline" | "subtle") {
    if (!["default", "outline", "subtle"].includes(value)) throw new TypeError("Invalid Empty State variant");
    const previous = this.treatment;
    this.treatment = value;
    this.requestUpdate("variant", previous);
  }
  private readonly places = new Places(this, { places: ["indicator", "heading", "description", "actions"] });
  render() {
    return html`<div part="root" data-kind="root" data-size=${this.size} data-variant=${this.variant}><div part="indicator" ?hidden=${!this.places.has("indicator")}><slot name="indicator"></slot></div><div part="content" ?hidden=${!this.places.has("heading") && !this.places.has("description")}><div part="heading" ?hidden=${!this.places.has("heading")}><slot name="heading"></slot></div><div part="description" ?hidden=${!this.places.has("description")}><slot name="description"></slot></div></div><slot></slot><div part="actions" ?hidden=${!this.places.has("actions")}><slot name="actions"></slot></div></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-empty-state": AcmeEmptyState;
  }
}
