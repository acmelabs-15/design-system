import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { type Breakpoint, breakpointVars, type GridPosition, perBreakpoint, positionCount, positionValue, type Responsive, responsive } from "../grid/grid";
import { gridCellCss } from "./grid-cell.styles";

/** Reads a breakpoint list from `hide` (`sm`, `"xs md"` or JSON). */
const breakpoints = {
  fromAttribute: (v: string | null): Breakpoint[] => (v === null ? [] : v.trim().startsWith("[") ? JSON.parse(v) : (v.split(/[\s,]+/).filter(Boolean) as Breakpoint[])),
  toAttribute: (v: Breakpoint[] | Breakpoint) => (Array.isArray(v) ? v.join(" ") : v),
};

/**
 * A cell of `acme-grid`: a padded box on the tracks its `row` and `column` name, a line number,
 * a `start/end` span or `auto` (flowing into the next free tracks), plain or per breakpoint as
 * JSON. A `solid` cell needs both, and clips the guides it covers. The cell draws over the guides;
 * `behind-grid` puts it under them; `no-padding` and `overflow` open the box; `hide` names the
 * breakpoints at which the cell is not displayed.
 */
@customElement("acme-grid-cell")
export class AcmeGridCell extends AcmeElement {
  static styles = [sharedCss, gridCellCss];
  @property({ converter: responsive }) row: Responsive<GridPosition> = "auto";
  @property({ converter: responsive }) column: Responsive<GridPosition> = "auto";
  /** Clips the guides the cell covers. Needs an explicit `row` and `column`. */
  @property({ type: Boolean }) solid = false;
  @property({ type: Boolean, attribute: "no-padding" }) noPadding = false;
  /** Lets content overflow the cell. */
  @property({ type: Boolean }) overflow = false;
  /** Draws the cell under the guides. */
  @property({ type: Boolean, attribute: "behind-grid" }) behindGrid = false;
  /** The breakpoints at which the cell is hidden. */
  @property({ converter: breakpoints }) hide: Breakpoint[] | Breakpoint = [];

  willUpdate() {
    if (this.solid && (this.row === "auto" || this.column === "auto")) throw new Error("A solid cell needs an explicit row and column");
  }

  /** The placement lands on the host as custom properties per breakpoint; the grid's sheet reads them. */
  updated() {
    const hidden = (bp: Breakpoint) => (this.hide === bp || (Array.isArray(this.hide) && this.hide.includes(bp)) ? "none" : undefined);
    const display = { xs: hidden("xs"), sm: hidden("sm"), smd: hidden("smd"), md: hidden("md"), lg: hidden("lg") };
    const vars: Record<string, string> = {
      ...breakpointVars("grid-row", perBreakpoint(this.row, positionValue)),
      ...breakpointVars("grid-column", perBreakpoint(this.column, positionValue)),
      ...breakpointVars("cell-rows", perBreakpoint(this.row, positionCount)),
      ...breakpointVars("cell-columns", perBreakpoint(this.column, positionCount)),
      ...breakpointVars("block-display", display),
    };
    const stale = Array.from({ length: this.style.length }, (_, i) => this.style.item(i)).filter(
      (n) => n.startsWith("--") && /-(grid-row|grid-column|cell-rows|cell-columns|block-display)$/.test(n) && !(n in vars),
    );
    for (const name of stale) this.style.removeProperty(name);
    for (const [k, v] of Object.entries(vars)) this.style.setProperty(k, v);
    this.style.setProperty("padding", this.noPadding ? "0" : "");
    this.style.setProperty("z-index", this.behindGrid ? "0" : "");
    this.style.setProperty("overflow", this.overflow ? "visible" : "");
    this.dispatchEvent(new Event("acme-grid-cell-change", { bubbles: true }));
  }

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-grid-cell": AcmeGridCell;
  }
}
