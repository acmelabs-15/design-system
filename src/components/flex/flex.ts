import { AcmeFlexLayoutElement } from "../../shared/flex-layout-element";
import type { LayoutStyleValue } from "../../shared/layout-element";
import type { StyleInputKey } from "../../shared/style-input-schema";

/**
 * Native flex arrangement with responsive CSS inputs and structural semantics.
 * @slot - Author-owned flex items.
 * @csspart root - The native flex container.
 * @attr flex-direction - Responsive main-axis direction.
 */
export class AcmeFlex extends AcmeFlexLayoutElement {
  protected static styleKeys: readonly StyleInputKey[] = [...AcmeFlexLayoutElement.styleKeys, "flexDirection"];
  get flexDirection(): LayoutStyleValue<"flexDirection"> {
    return this.styleInputs.get("flexDirection");
  }
  set flexDirection(value: LayoutStyleValue<"flexDirection">) {
    this.styleInputs.set("flexDirection", value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-flex": AcmeFlex;
  }
}
