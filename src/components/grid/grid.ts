import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import type { AcmeGridCell } from "../grid-cell/grid-cell";
import type { AcmeGridSystem } from "../grid-system/grid-system";
import { gridCss } from "./grid.styles";

/** The breakpoints, by viewport width: xs to 400, sm to 600, smd to 768, md to 960, lg beyond. */
export type Breakpoint = "xs" | "sm" | "smd" | "md" | "lg";
export const BREAKPOINTS: Breakpoint[] = ["xs", "sm", "smd", "md", "lg"];
/** One value for every breakpoint, or a value per breakpoint (`sm` is required; the others fill in from their neighbours). */
export type Responsive<T> = T | { xs?: T; sm: T; smd?: T; md?: T; lg?: T; xl?: T };
/** A grid line or span: a line number (`2`, negative counts from the end), a `start/end` string (`1/3`), a `[start, end]` pair, or `auto`. */
export type GridPosition = number | string | [number, number];

/** Reads a plain value or a JSON object of breakpoint values from an attribute. */
export const responsive = {
  fromAttribute: (v: string | null) => (v?.trim().startsWith("{") || v?.trim().startsWith("[") ? JSON.parse(v) : (v ?? "")),
  toAttribute: (v: unknown) => (v && typeof v === "object" ? JSON.stringify(v) : v == null ? null : String(v)),
};

/** The value at every breakpoint: an object fills xs from sm, smd from md, md from smd, lg from md, each down to sm. */
export function restrict<T>(v: Responsive<T>): Record<Breakpoint, T> {
  if (v && typeof v === "object" && !Array.isArray(v)) {
    const o = v as { xs?: T; sm: T; smd?: T; md?: T; lg?: T };
    if (!("sm" in o)) throw new Error("A responsive value needs an sm key");
    const out = { xs: o.xs || o.sm, sm: o.sm, smd: o.smd || o.md || o.sm, md: o.md || o.smd || o.sm, lg: o.lg || o.md || o.sm };
    if (Object.values(out).some((x) => x == null)) throw new Error("A responsive value needs a value at sm, md or lg");
    return out;
  }
  return { xs: v as T, sm: v as T, smd: v as T, md: v as T, lg: v as T };
}

/**
 * Custom properties for a value per breakpoint: `--name` for a plain value; for an object, `--<bp>-name` at each
 * breakpoint whose value differs from the one before (xs only when it differs from sm; smd also when it equals sm but not md).
 */
export function breakpointVars(name: string, v: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (!v || typeof v !== "object") {
    if (v != null) out[`--${name}`] = String(v);
    return out;
  }
  const t = v as Record<string, unknown>;
  let prev: unknown;
  for (const bp of [...BREAKPOINTS, "xl"]) {
    const x = t[bp];
    if ((bp !== "xs" || t.xs !== t.sm) && ((x != null && x !== prev) || (bp === "smd" && t.smd === t.sm && t.smd !== t.md))) {
      out[`--${bp}-${name}`] = String(x);
      prev = x;
    }
  }
  return out;
}

/** A position as a `grid-row` / `grid-column` value. */
export const positionValue = (p: GridPosition): string => {
  if (typeof p === "number") return p < 0 ? `span 1 / ${p}` : `${p} / span 1`;
  if (Array.isArray(p)) return `${p[0]}/${p[1]}`;
  if (!p) throw new Error("A grid position is a number, a start/end string or a pair");
  return p;
};
/** The number of tracks a position spans (`auto` stays `auto`). */
export const positionCount = (p: GridPosition): number | "auto" => {
  if (typeof p === "number") return 1;
  if (Array.isArray(p)) return p[1] - p[0];
  if (!p) throw new Error("A grid position is a number, a start/end string or a pair");
  if (p === "auto") return "auto";
  const [a, b] = p.split("/");
  return Number(b) - Number(a);
};
/** A position as a `[start, end]` span of grid lines; a negative line counts back from `count` tracks. */
export const positionSpan = (p: GridPosition, count?: number): [number, number] => {
  if (typeof p === "number") return p < 0 ? [1, p] : [p, p + 1];
  if (p === "auto" || !p) throw new Error("A solid cell needs an explicit row and column");
  if (typeof p === "string") {
    const [a, b] = p.split("/");
    const s = Number(a);
    const e = Number(b);
    return Number.isNaN(e) ? positionSpan(s, count) : positionSpan([s, e], count);
  }
  let [s, e] = p;
  if (s < 0 && count) s = count + s;
  if (e < 0 && count) e = count + 2 + e;
  return [s, e];
};
/** A responsive position through a converter, per breakpoint, the larger breakpoints filling in from the smaller ones. */
export function perBreakpoint<R>(p: Responsive<GridPosition>, convert: (p: GridPosition, count?: number) => R, counts?: Responsive<number>): Record<Breakpoint, R> {
  const n = restrict(p);
  const i = restrict(counts as Responsive<number | undefined>);
  const xs = convert(n.xs, i.xs);
  const sm = convert(n.sm, i.sm);
  const smd = convert(n.smd, i.smd);
  const md = convert(n.md, i.md);
  const out = { xs: xs || sm, sm, smd: smd || md || sm, md: md || smd || sm, lg: convert(n.lg, i.lg) || md || smd || sm };
  if (Object.values(out).some((x) => x === undefined)) throw new Error("A cell position is missing at a breakpoint");
  return out;
}

const heightValue = (h: string | number): string => {
  if (h === "fit-content" || h === "auto") return "fit-content";
  if (typeof h === "number") return `${h}px`;
  if (h?.includes("var(") && h.includes(")")) return h;
  return "calc(var(--width) / var(--grid-columns) * var(--grid-rows))";
};
const sameSpans = (a: Span[][], b: Span[][]) => JSON.stringify(a) === JSON.stringify(b);
/** Reads a boolean or a `row` / `column` value from the `hide-guides` attribute. */
const hideGuides = {
  fromAttribute: (v: string | null): boolean | "row" | "column" => (v === null ? false : v === "row" || v === "column" ? v : v !== "false"),
  toAttribute: (v: boolean | "row" | "column") => (v === false ? null : v === true ? "" : v),
};
type Span = { row: [number, number]; column: [number, number] };

/**
 * A grid of `columns` by `rows` tracks inside an `acme-grid-system`: the section takes the system's
 * width and draws a guide behind every track; the cells (`acme-grid-cell`) and crosses
 * (`acme-grid-cross`) are its slotted children. Both counts take one number or a value per breakpoint
 * (`{"sm":1,"md":2,"lg":3}`); the guides are then drawn once per breakpoint and shown by media query.
 * A solid cell clips the guides it covers. The system's debug and dashed modes reach the section as
 * `data-debug` and `data-dashed`.
 */
@customElement("acme-grid")
export class AcmeGrid extends AcmeElement {
  static styles = [
    sharedCss,
    gridCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  @property({ converter: responsive }) columns: Responsive<number> = 1;
  @property({ converter: responsive }) rows: Responsive<number> = 1;
  /** `fit-content` (the default), `preserve-aspect-ratio` (square cells: the height follows the width and the counts), a number of px, or a `var()`. */
  @property({ converter: responsive }) height: Responsive<string | number> = "fit-content";
  /** Hides every guide (a bare attribute), the row guides or the column guides. */
  @property({ converter: hideGuides, attribute: "hide-guides" }) hideGuides: boolean | "row" | "column" = false;
  /** Draws the guides dashed. */
  @property({ type: Boolean, attribute: "dashed-guides" }) dashedGuides = false;
  /** Drops the section's bottom border. */
  @property({ type: Boolean, attribute: "no-system-border" }) noSystemBorder = false;
  /** Reads the breakpoint from the system's container instead of the viewport. */
  @property({ type: Boolean, attribute: "use-container" }) useContainer = false;
  @atomState() private systemDebug = false;
  @atomState() private systemDashed = false;
  @atomState() private cells: AcmeGridCell[] = [];
  private systemWatch?: MutationObserver;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("acme-grid-cell-change", this.onCellChange);
    this.watchSystem();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("acme-grid-cell-change", this.onCellChange);
    this.systemWatch?.disconnect();
    this.systemWatch = undefined;
  }

  /** The system's debug and dashed modes, read off its reflected attributes and followed as they change. */
  private watchSystem() {
    const system = this.closest("acme-grid-system") as AcmeGridSystem | null;
    const read = () => {
      this.systemDebug = !!system?.hasAttribute("debug");
      this.systemDashed = !!system?.hasAttribute("dashed-guides");
    };
    read();
    if (!system || typeof MutationObserver === "undefined") return;
    this.systemWatch = new MutationObserver(read);
    this.systemWatch.observe(system, { attributes: true, attributeFilter: ["debug", "dashed-guides"] });
  }
  private onCellChange = () => this.readCells();
  private readCells = () => {
    this.cells = [...this.children].filter((c): c is AcmeGridCell => c.tagName === "ACME-GRID-CELL");
  };

  /** The solid cells' spans per breakpoint: the guides they cover are clipped. */
  private clipSpans(): Record<Breakpoint, Span[]> {
    const solid = this.cells.filter((c) => c.solid && c.row !== "auto" && c.column !== "auto" && c.row !== "" && c.column !== "");
    const spans = solid.map((c) => {
      const row = perBreakpoint(c.row, positionSpan, this.rows);
      const column = perBreakpoint(c.column, positionSpan, this.columns);
      return Object.fromEntries(BREAKPOINTS.map((bp) => [bp, { row: row[bp], column: column[bp] }])) as Record<Breakpoint, Span>;
    });
    return Object.fromEntries(BREAKPOINTS.map((bp) => [bp, spans.map((s) => s[bp])])) as Record<Breakpoint, Span[]>;
  }

  /** One layer of guides: a cell per track, its right and bottom borders clipped at the last track, by `hide-guides`, or under a solid cell. */
  private guides(rows: number, columns: number, clip: Span[], bp?: Breakpoint) {
    const all = this.hideGuides === true;
    const hideColumns = all || this.hideGuides === "column";
    const hideRows = all || this.hideGuides === "row";
    if (all) return nothing;
    const cls = bp ? `guide ${bp}` : "guide";
    const items = Array.from({ length: rows * columns }, (_, i) => {
      const d = i % columns;
      const m = Math.floor(i / columns);
      const right = d === columns - 1 || hideColumns || clip.some((s) => s.column[0] <= d + 1 && s.column[1] > d + 2 && s.row[0] <= m + 1 && s.row[1] > m + 1);
      const bottom = m === rows - 1 || hideRows || clip.some((s) => s.column[0] <= d + 1 && s.column[1] > d + 1 && s.row[0] <= m + 1 && s.row[1] > m + 2);
      const style = `--x:${d + 1};--y:${m + 1}${right ? ";border-right:none" : ""}${bottom ? ";border-bottom:none" : ""}`;
      return html`<div class=${cls} aria-hidden="true" style=${style}></div>`;
    });
    return html`<div class="guides" aria-hidden="true" data-grid-guides="true">${items}</div>`;
  }

  render() {
    const rows = restrict(this.rows);
    const columns = restrict(this.columns);
    const heights = restrict(this.height);
    const clip = this.clipSpans();
    const vars = {
      ...breakpointVars("grid-rows", this.rows),
      ...breakpointVars("grid-columns", this.columns),
      ...breakpointVars("height", Object.fromEntries(BREAKPOINTS.map((bp) => [bp, heightValue(heights[bp])]))),
    };
    const style = [...Object.entries(vars).map(([k, v]) => `${k}:${v}`), ...(this.noSystemBorder ? ["border-bottom:none"] : [])].join(";");
    const uniform =
      rows.xs === rows.sm &&
      rows.sm === rows.smd &&
      rows.smd === rows.md &&
      rows.lg === rows.md &&
      columns.xs === columns.sm &&
      columns.sm === columns.smd &&
      columns.smd === columns.md &&
      columns.lg === columns.md &&
      sameSpans([clip.xs, clip.sm, clip.smd, clip.md], [clip.sm, clip.smd, clip.md, clip.lg]);
    const guides = uniform ? this.guides(rows.sm, columns.sm, clip.sm) : BREAKPOINTS.map((bp) => this.guides(rows[bp], columns[bp], clip[bp], bp));
    return html`<section
      class=${this.cls("grid", { contained: this.useContainer, dashed: this.dashedGuides })}
      style=${style}
      data-grid=""
      data-debug=${this.systemDebug ? "" : nothing}
      data-dashed=${this.systemDashed ? "" : nothing}
      part="grid"
    >
      <slot @slotchange=${this.readCells}></slot>${guides}
    </section>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-grid": AcmeGrid;
  }
}
