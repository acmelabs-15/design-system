import { AcmeGridLayoutElement } from "../../shared/grid-layout-element";
import type { LayoutStyleValue } from "../../shared/layout-element";
import type { StyleInputKey } from "../../shared/style-input-schema";

/**
 * Native grid tracks, areas and placement with responsive CSS inputs.
 * @attr grid-template-columns - Responsive column tracks and named lines.
 * @attr grid-template-rows - Responsive row tracks and named lines.
 * @attr grid-template-areas - Responsive named areas.
 * @attr grid-auto-columns - Responsive implicit column sizes.
 * @attr grid-auto-flow - Responsive auto-placement direction and density.
 */
export class AcmeGrid extends AcmeGridLayoutElement {
  protected static styleKeys: readonly StyleInputKey[] = [...AcmeGridLayoutElement.styleKeys, "gridTemplateColumns", "gridTemplateRows", "gridTemplateAreas", "gridAutoColumns", "gridAutoFlow"];
  get gridTemplateColumns(): LayoutStyleValue<"gridTemplateColumns"> {
    return this.styleInputs.get("gridTemplateColumns");
  }
  set gridTemplateColumns(value: LayoutStyleValue<"gridTemplateColumns">) {
    this.styleInputs.set("gridTemplateColumns", value);
  }
  get gridTemplateRows(): LayoutStyleValue<"gridTemplateRows"> {
    return this.styleInputs.get("gridTemplateRows");
  }
  set gridTemplateRows(value: LayoutStyleValue<"gridTemplateRows">) {
    this.styleInputs.set("gridTemplateRows", value);
  }
  get gridTemplateAreas(): LayoutStyleValue<"gridTemplateAreas"> {
    return this.styleInputs.get("gridTemplateAreas");
  }
  set gridTemplateAreas(value: LayoutStyleValue<"gridTemplateAreas">) {
    this.styleInputs.set("gridTemplateAreas", value);
  }
  get gridAutoColumns(): LayoutStyleValue<"gridAutoColumns"> {
    return this.styleInputs.get("gridAutoColumns");
  }
  set gridAutoColumns(value: LayoutStyleValue<"gridAutoColumns">) {
    this.styleInputs.set("gridAutoColumns", value);
  }
  get gridAutoFlow(): LayoutStyleValue<"gridAutoFlow"> {
    return this.styleInputs.get("gridAutoFlow");
  }
  set gridAutoFlow(value: LayoutStyleValue<"gridAutoFlow">) {
    this.styleInputs.set("gridAutoFlow", value);
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-grid": AcmeGrid;
  }
}
