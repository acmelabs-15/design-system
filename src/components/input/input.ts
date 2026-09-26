import { optionalString } from "../../shared/attributes";
import { property } from "lit/decorators.js";
import { atomState } from "../../shared/atom-state";
import { AcmeSingleLineControl } from "../../shared/single-line-control";

export type InputSize = "small" | "medium" | "large";
export type InputType = "text" | "email" | "url" | "tel" | "password" | "search";
/** A native single-line text control.
 * @slot start - Content inside the start of the field.
 * @slot end - Content inside the end of the field.
 * @slot start-addon - Attached content outside the start of the field.
 * @slot end-addon - Attached content outside the end of the field.
 * @csspart root - The attached field surface.
 * @csspart input - The native input.
 * @csspart start - The inside start content.
 * @csspart end - The inside end content.
 * @csspart start-addon - The external start content.
 * @csspart end-addon - The external end content.
 * @csspart clear - The clear action.
 * @fires {CustomEvent<{value:string}>} acme-input - A live value edit.
 * @fires {CustomEvent<{value:string}>} acme-change - A committed value edit.
 */
export class AcmeInput extends AcmeSingleLineControl {
  @atomState() private kind: InputType = "text";
  /** @default "text" */
  @property({ noAccessor: true, converter: optionalString }) get type(): InputType {
    return this.kind ?? "text";
  }
  set type(value: InputType | undefined) {
    value ??= "text";
    if (!["text", "email", "url", "tel", "password", "search"].includes(value)) {
      throw new TypeError("Invalid input type");
    }
    const old = this.kind;
    this.kind = value;
    this.nativeForm?.refreshValue();
    this.requestUpdate("type", old);
  }
  protected get inputType() {
    return this.type;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-input": AcmeInput;
  }
}
