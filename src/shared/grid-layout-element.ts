import { AcmeLayoutElement, type LayoutStyleValue } from "./layout-element";
import { gridLayoutCss } from "../generated/shared/grid-layout.styles";
import type { StyleDisplayMode, StyleInputKey } from "./style-input-schema";

/**
 * Shared native grid arrangement and its common alignment/spacing inputs.
 * @slot - Author-owned grid items.
 * @csspart root - The native grid container.
 * @attr grid-auto-rows - Responsive implicit row sizes.
 * @attr align-items - Responsive block-axis item alignment.
 * @attr justify-items - Responsive inline-axis item alignment.
 * @attr align-content - Responsive block-axis track alignment.
 * @attr justify-content - Responsive inline-axis track alignment.
 * @attr gap - Responsive track spacing.
 * @attr row-gap - Responsive row spacing.
 * @attr column-gap - Responsive column spacing.
 */
export abstract class AcmeGridLayoutElement extends AcmeLayoutElement {
  static styles = [...AcmeLayoutElement.styles, gridLayoutCss];
  protected static layout = "grid" as const;
  protected static displayModes: readonly StyleDisplayMode[] = ["grid", "inline-grid", "none"];
  protected static styleKeys: readonly StyleInputKey[] = [...AcmeLayoutElement.styleKeys, "gridAutoRows", "alignItems", "justifyItems", "alignContent", "justifyContent", "gap", "rowGap", "columnGap"];
  get gridAutoRows(): LayoutStyleValue<"gridAutoRows"> {
    return this.styleInputs.get("gridAutoRows");
  }
  set gridAutoRows(value: LayoutStyleValue<"gridAutoRows">) {
    this.styleInputs.set("gridAutoRows", value);
  }
  get alignItems(): LayoutStyleValue<"alignItems"> {
    return this.styleInputs.get("alignItems");
  }
  set alignItems(value: LayoutStyleValue<"alignItems">) {
    this.styleInputs.set("alignItems", value);
  }
  get justifyItems(): LayoutStyleValue<"justifyItems"> {
    return this.styleInputs.get("justifyItems");
  }
  set justifyItems(value: LayoutStyleValue<"justifyItems">) {
    this.styleInputs.set("justifyItems", value);
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
