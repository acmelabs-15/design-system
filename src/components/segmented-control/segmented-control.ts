import { createAtom } from "@tanstack/lit-store";
import { StoreSelector } from "../../shared/store-connection";
import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { atomState } from "../../shared/atom-state";
import { optionalString } from "../../shared/attributes";
import { AcmeSingleSelectionGroup } from "../../shared/single-selection-group";
import { segmentedControlStructureCss } from "../../generated/components/segmented-control/segmented-control-structure.styles";
/** One form value selected through an outlined group of radio choices.
 * @slot - Segmented Control Item members.
 * @csspart root - The named radio group.
 * @csspart indicator - The moving selected surface.
 * @fires {CustomEvent<{value:string}>} acme-change - The user selected a value.
 */
export class AcmeSegmentedControl extends AcmeSingleSelectionGroup {
  static styles = [...AcmeSingleSelectionGroup.styles, segmentedControlStructureCss];
  @atomState() private direction: "horizontal" | "vertical" = "horizontal";
  /** @default "horizontal" */
  @property({ noAccessor: true, converter: optionalString }) get orientation(): "horizontal" | "vertical" {
    return this.direction;
  }
  set orientation(value: "horizontal" | "vertical" | undefined) {
    const next = value ?? "horizontal";
    if (!["horizontal", "vertical"].includes(next)) throw new TypeError("Invalid selection orientation");
    const old = this.direction;
    this.direction = next;
    this.requestUpdate("orientation", old);
  }
  @atomState() private controlSize: "small" | "medium" | "large" = "medium";
  /** @default "medium" */
  @property({ noAccessor: true, converter: optionalString }) get size(): "small" | "medium" | "large" {
    return this.controlSize;
  }
  set size(value: "small" | "medium" | "large" | undefined) {
    const next = value ?? "medium";
    if (!["small", "medium", "large"].includes(next)) throw new TypeError("Invalid selection size");
    const old = this.controlSize;
    this.controlSize = next;
    this.requestUpdate("size", old);
  }
  protected get collectionSize() {
    return this.size;
  }
  private readonly selectedTarget = createAtom(() => this.members.find((member) => member.value() === this.value)?.target());
  private readonly selectedUpdates = new StoreSelector(this, () => this.selectedTarget);
  render() {
    return html`<div class="segmented" part="root" tabindex="-1" aria-orientation=${this.orientation} aria-invalid=${this.field.description.get()?.invalid ? "true" : nothing} aria-required=${this.requiredState.get() ? "true" : nothing} aria-disabled=${this.nativeForm.effectiveDisabled ? "true" : nothing}><acme-group attached outline .size=${this.size} .orientation=${this.orientation}><slot></slot></acme-group><acme-selection-indicator exportparts="paint:indicator" .target=${this.selectedTarget.get()} .orientation=${this.orientation}></acme-selection-indicator></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-segmented-control": AcmeSegmentedControl;
  }
}
