import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { boolish } from "../../base";
import { atomState } from "../../shared/atom-state";
import { optionalString } from "../../shared/attributes";
import { AcmeSingleSelectionGroup } from "../../shared/single-selection-group";
import { radioGroupStructureCss } from "../../generated/components/radio-group/radio-group-structure.styles";
/** Owns one selected value, native submission and radio keyboard navigation.
 * @slot - Radio or Radio Card members.
 * @csspart root - The named radio group.
 * @fires {CustomEvent<{value:string}>} acme-change - The user selected a group member.
 */
export class AcmeRadioGroup extends AcmeSingleSelectionGroup {
  static styles = [...AcmeSingleSelectionGroup.styles, radioGroupStructureCss];
  @atomState() private direction: "horizontal" | "vertical" = "vertical";
  /** @default "vertical" */
  @property({ noAccessor: true, converter: optionalString }) get orientation(): "horizontal" | "vertical" {
    return this.direction;
  }
  set orientation(value: "horizontal" | "vertical" | undefined) {
    const next = value ?? "vertical";
    if (next !== "horizontal" && next !== "vertical") {
      throw new TypeError("Invalid radio orientation");
    }
    const previous = this.direction;
    this.direction = next;
    this.requestUpdate("orientation", previous);
  }
  @atomState() @property({ noAccessor: true, converter: boolish }) loop = true;

  protected get selectionLoop() {
    return this.loop;
  }
  render() {
    return html`<div class="radio-group" part="root" tabindex="-1" data-orientation=${this.orientation} aria-orientation=${this.orientation} aria-invalid=${this.field.description.get()?.invalid ? "true" : nothing} aria-required=${this.requiredState.get() ? "true" : nothing} aria-disabled=${this.nativeForm.effectiveDisabled ? "true" : nothing}><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-radio-group": AcmeRadioGroup;
  }
}
