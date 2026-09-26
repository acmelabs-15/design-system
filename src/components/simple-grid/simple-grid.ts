import { property } from "lit/decorators.js";
import { AcmeGridLayoutElement } from "../../shared/grid-layout-element";
import { atomState } from "../../shared/atom-state";
import type { ResponsiveInput } from "../../shared/responsive";
import { copyResponsiveInput, parseResponsiveAttribute } from "../../shared/responsive-input";
import { isColumnCount, isMinimumWidth, minimumTrack, simpleGridTracks } from "../../shared/simple-grid-sizing";
import type { StyleInputKey } from "../../shared/style-input-schema";

/** Equal columns or automatically fitted minimum-width columns, using native grid layout. */
export class AcmeSimpleGrid extends AcmeGridLayoutElement {
  @atomState() private sizing: Readonly<{ columns: ResponsiveInput<number>; minimum: ResponsiveInput<string | number> }> = Object.freeze({ columns: undefined, minimum: undefined });
  /** Positive column counts. Omission leaves native implicit grid behavior. */
  @property({ noAccessor: true })
  get columns(): ResponsiveInput<number> {
    return this.sizing.columns;
  }
  set columns(value: ResponsiveInput<number>) {
    const columns = copyResponsiveInput(value, isColumnCount),
      previous = this.columns;
    this.sizing = Object.freeze({ ...this.sizing, columns });
    this.requestUpdate("columns", previous);
  }
  /** Selects minimum-width mode for the whole component. Clear it to restore column-count mode. */
  @property({ noAccessor: true, attribute: "min-child-width" })
  get minChildWidth(): ResponsiveInput<string | number> {
    return this.sizing.minimum;
  }
  set minChildWidth(value: ResponsiveInput<string | number>) {
    const minimum = copyResponsiveInput(value, isMinimumWidth),
      previous = this.minChildWidth;
    this.sizing = Object.freeze({ ...this.sizing, minimum });
    this.requestUpdate("minChildWidth", previous);
  }
  private supportsMinimum(value: string): boolean {
    const css = this.ownerDocument.defaultView?.CSS;
    if (css?.supports) {
      return css.supports("grid-template-columns", minimumTrack(value));
    }
    const style = this.ownerDocument.createElement("div").style;
    style.setProperty("grid-template-columns", minimumTrack(value));
    return !!style.getPropertyValue("grid-template-columns");
  }
  attributeChangedCallback(name: string, previous: string | null, value: string | null): void {
    if (name === "columns") {
      const input = parseResponsiveAttribute(value, isColumnCount, { numbers: true });
      this.columns = input.value;
      if (input.diagnostic) {
        console.warn(this.localName, { ...input.diagnostic, attribute: name });
      }
    } else if (name === "min-child-width") {
      const scalar = (value: unknown): value is string | number => isMinimumWidth(value) && (typeof value === "number" || this.supportsMinimum(value));
      const input = parseResponsiveAttribute(value, scalar, { numbers: true });
      this.minChildWidth = input.value;
      if (input.diagnostic) {
        console.warn(this.localName, { ...input.diagnostic, attribute: name });
      }
    } else {
      super.attributeChangedCallback(name, previous, value);
    }
  }
  protected resolvedStyleInputs(): readonly (readonly [StyleInputKey, unknown])[] {
    const inputs = super.resolvedStyleInputs(),
      tracks = simpleGridTracks(this.columns, this.minChildWidth);
    return tracks === undefined ? inputs : [...inputs, ["gridTemplateColumns", tracks] as const];
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-simple-grid": AcmeSimpleGrid;
  }
}
