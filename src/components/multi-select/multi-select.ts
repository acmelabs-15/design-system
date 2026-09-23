import { property } from "lit/decorators.js";
import { AcmeOptionControl } from "../../shared/option-control";
/** Multiple choices with one canonical value array and repeated native form entries.
 * @slot - Options and named sections.
 * @slot trigger - Noninteractive content inside the native trigger button.
 * @slot start - Leading field content.
 * @slot end - Trailing field content.
 * @slot empty - Empty collection message.
 * @slot footer - Independent content below the list.
 * @csspart root - Field surface.
 * @csspart trigger - Named native button.
 * @csspart value - Accessible selection summary.
 * @csspart content - Popup surface.
 * @csspart list - Multiselectable listbox.
 * @fires {CustomEvent<{value:readonly string[]}>} acme-change - A user changes the selected values.
 * @fires {CustomEvent<{open:boolean;reason:string}>} acme-open-change - A user changes popup visibility.
 */
export class AcmeMultiSelect extends AcmeOptionControl {
  protected get multiple(): boolean {
    return true;
  }
  /** @default [] */
  @property({ noAccessor: true, attribute: false }) get value(): readonly string[] {
    return this.selectedValues;
  }
  set value(value: readonly string[]) {
    this.selectedValues = value;
  }
  @property({ noAccessor: true, attribute: false }) get defaultValue(): readonly string[] {
    return this.resetValues;
  }
  set defaultValue(value: readonly string[]) {
    this.resetValues = value;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-multi-select": AcmeMultiSelect;
  }
}
