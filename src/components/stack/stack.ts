import { AcmeStackElement } from "../../shared/stack-element";
import type { LayoutStyleValue } from "../../shared/layout-element";
import type { StyleInputKey } from "../../shared/style-input-schema";
/** A spaced column by default, with responsive direction and optional separators.
 * @attr flex-direction - Responsive main-axis direction.
 */
export class AcmeStack extends AcmeStackElement {
  protected static styleKeys: readonly StyleInputKey[] = [...AcmeStackElement.styleKeys, "flexDirection"];
  get flexDirection(): LayoutStyleValue<"flexDirection"> {
    return this.styleInputs.get("flexDirection");
  }
  set flexDirection(value: LayoutStyleValue<"flexDirection">) {
    this.styleInputs.set("flexDirection", value);
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-stack": AcmeStack;
  }
}
