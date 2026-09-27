import { property } from "lit/decorators.js";
import { AcmeOptionControl } from "../../shared/option-control";
import { optionalString } from "../../shared/attributes";
/** A single value chosen from an owned option collection.
 * @slot - Options and named sections.
 * @slot trigger - Noninteractive content inside the native trigger button.
 * @slot start - Leading field content.
 * @slot end - Trailing field content.
 * @slot start-addon - External leading add-on.
 * @slot end-addon - External trailing add-on.
 * @slot empty - Empty collection message.
 * @slot footer - Independent content below the list.
 * @csspart root - Field surface.
 * @csspart trigger - Native combobox button.
 * @csspart content - Popup surface.
 * @csspart list - Listbox.
 * @csspart clear - Clear action.
 * @fires {CustomEvent<{value:string|undefined}>} acme-change - A user commits a choice.
 * @fires {CustomEvent<{open:boolean;reason:string}>} acme-open-change - A user changes popup visibility.
 */
export class AcmeSelect extends AcmeOptionControl {
  @property({ noAccessor: true, converter: optionalString }) get value(): string | undefined {
    return this.selectedValues[0];
  }
  set value(value: string | undefined) {
    this.selectedValues = value === undefined ? [] : [value];
  }
  @property({ noAccessor: true, attribute: false }) get defaultValue(): string | undefined {
    return this.resetValues[0];
  }
  set defaultValue(value: string | undefined) {
    this.resetValues = value === undefined ? [] : [value];
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-select": AcmeSelect;
  }
}
