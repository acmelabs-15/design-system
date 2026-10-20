import { AcmeLayoutElement, type LayoutStyleValue } from "./layout-element";
import { flexStructureCss } from "../generated/components/flex/flex-structure.styles";
import { flexStyleInputSchema, type StyleDisplayMode, type StyleInputKey } from "./style-input-schema";

/**
 * Native flex arrangement with responsive CSS inputs and structural semantics.
 * @slot - Author-owned flex items.
 * @csspart root - The native flex container.
 * @attr flex-wrap - Responsive wrapping mode.
 * @attr align-items - Responsive cross-axis alignment.
 * @attr align-content - Responsive wrapped-line alignment.
 * @attr justify-content - Responsive main-axis alignment.
 * @attr gap - Responsive spacing between items and lines.
 * @attr row-gap - Responsive row spacing.
 * @attr column-gap - Responsive column spacing.
 */
export abstract class AcmeFlexLayoutElement extends AcmeLayoutElement {
  static styles = [...AcmeLayoutElement.styles, flexStructureCss];
  protected static layout = "flex" as const;
  protected static styleKeys: readonly StyleInputKey[] = [...AcmeLayoutElement.styleKeys, ...(Object.keys(flexStyleInputSchema).filter((key) => key !== "flexDirection") as StyleInputKey[])];
  protected static displayModes: readonly StyleDisplayMode[] = ["flex", "inline-flex", "none"];
  get flexWrap(): LayoutStyleValue<"flexWrap"> {
    return this.styleInputs.get("flexWrap");
  }
  set flexWrap(value: LayoutStyleValue<"flexWrap">) {
    this.styleInputs.set("flexWrap", value);
  }
  get alignItems(): LayoutStyleValue<"alignItems"> {
    return this.styleInputs.get("alignItems");
  }
  set alignItems(value: LayoutStyleValue<"alignItems">) {
    this.styleInputs.set("alignItems", value);
  }
  get alignContent(): LayoutStyleValue<"alignContent"> {
    return this.styleInputs.get("alignContent");
  }
  set alignContent(value: LayoutStyleValue<"alignContent">) {
    this.styleInputs.set("alignContent", value);
  }
  get justifyContent(): LayoutStyleValue<"justifyContent"> {
    return this.styleInputs.get("justifyContent");
  }
  set justifyContent(value: LayoutStyleValue<"justifyContent">) {
    this.styleInputs.set("justifyContent", value);
  }
  get gap(): LayoutStyleValue<"gap"> {
    return this.styleInputs.get("gap");
  }
  set gap(value: LayoutStyleValue<"gap">) {
    this.styleInputs.set("gap", value);
  }
  get rowGap(): LayoutStyleValue<"rowGap"> {
    return this.styleInputs.get("rowGap");
  }
  set rowGap(value: LayoutStyleValue<"rowGap">) {
    this.styleInputs.set("rowGap", value);
  }
  get columnGap(): LayoutStyleValue<"columnGap"> {
    return this.styleInputs.get("columnGap");
  }
  set columnGap(value: LayoutStyleValue<"columnGap">) {
    this.styleInputs.set("columnGap", value);
  }
}
