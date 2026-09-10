import { WindowVirtualizerController } from "@tanstack/lit-virtual";
import { css, html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { tableCss } from "./table.styles";
import "../checkbox/checkbox";

/** A column: `key` reads the row, `label` heads it, `width` sizes its col (e.g. "44%"), `numeric` gives its digits tabular figures, `render` draws the cell from the row. */
export type Column = { key: string; label: string; numeric?: boolean; width?: string; render?: (row: Record<string, unknown>) => unknown };
/** A footer cell: its text, and the columns it spans. */
export type FooterCell = { text: string; colspan?: number };
/** Row height: 40px rows, or 30px for `compact`. */
export type TableDensity = "default" | "compact";
type Row = Record<string, unknown>;

const ROW_PX: Record<TableDensity, number> = { default: 40, compact: 30 };

/**
 * A semantic HTML table. The root is a horizontal scroll box around a native table of 14px
 * gray-900 text: a header row of 36px medium cells, a 12px spacer body, the body and an
 * optional footer. `striped` shades every odd row, `bordered` draws a hairline under every row
 * but the last, `interactive` highlights the row under the pointer (mouse and pen, not touch;
 * the row carries data-hover) and reports a click on it as `acme-row`. `density="compact"`
 * shortens the rows to 30px; `remove-spacing` drops the spacer body. `virtualize` renders only
 * the rows in the window (plus `overscan` pixels above and below): the body keeps its full
 * height and hidden spacer rows hold the place of the rows left out, so the page scrolls as it
 * would with every row. `selectable` composes a checkbox column: the header checkbox selects
 * every row (indeterminate while only some are), each row's toggles its index in `selected`,
 * and a change is reported as `acme-select`. A cell with no value shows an em dash.
 */
@customElement("acme-table")
export class AcmeTable extends AcmeElement {
  static styles = [
    sharedCss,
    tableCss,
    css`
      :host {
        display: block;
      }
      .num {
        font-variant-numeric: tabular-nums;
      }
    `,
  ];
  /** `[{ key, label, width?, numeric?, render? }]`. */
  @property({ type: Array }) columns: Column[] = [];
  @property({ type: Array }) rows: Row[] = [];
  /** Footer cells: `[{ text, colspan? }]`. */
  @property({ type: Array }) footer: FooterCell[] = [];
  /** Shades every odd row. */
  @property({ type: Boolean }) striped = false;
  /** A hairline under every row but the last. */
  @property({ type: Boolean }) bordered = false;
  /** Highlights the row under the pointer and reports a click on it as `acme-row`. */
  @property({ type: Boolean }) interactive = false;
  /** Renders only the rows in the window; the body keeps its full height. */
  @property({ type: Boolean }) virtualize = false;
  /** Pixels rendered beyond the window above and below while virtualized. */
  @property({ type: Number }) overscan = 150;
  /** Row height: `default` (40px) or `compact` (30px). */
  @property() density: TableDensity = "default";
  /** Drops the 12px spacer between the header and the body. */
  @property({ type: Boolean, attribute: "remove-spacing" }) removeSpacing = false;
  /** A leading checkbox column; the selection is `selected`, a change is `acme-select`. */
  @property({ type: Boolean }) selectable = false;
  /** Indices of the selected rows. */
  @property({ type: Array }) selected: number[] = [];
  @query(".body") private body!: HTMLTableSectionElement;
  private hovered?: HTMLTableRowElement;
  private virt = new WindowVirtualizerController<HTMLTableRowElement>(this, {
    count: 0,
    estimateSize: () => ROW_PX[this.density],
    overscan: 4,
    scrollMargin: 0,
    initialRect: typeof window === "undefined" ? undefined : { width: window.innerWidth, height: window.innerHeight },
  });
  private get rowPx() {
    return ROW_PX[this.density] ?? ROW_PX.default;
  }

  willUpdate() {
    if (!this.virtualize) return;
    const v = this.virt.getVirtualizer();
    const overscan = Math.ceil(this.overscan / this.rowPx);
    if (v.options.count !== this.rows.length || v.options.overscan !== overscan) v.setOptions({ ...v.options, count: this.rows.length, overscan });
  }

  updated() {
    if (!this.virtualize || !this.body) return;
    // The body's offset from the top of the document is the virtualizer's scroll margin; a layout change above the table moves it.
    const v = this.virt.getVirtualizer();
    const margin = Math.round(this.body.getBoundingClientRect().top + window.scrollY);
    if (margin !== v.options.scrollMargin) {
      v.setOptions({ ...v.options, scrollMargin: margin });
      this.requestUpdate();
    }
  }

  private cell(c: Column, r: Row) {
    const v = c.render ? c.render(r) : r[c.key];
    return v === undefined || v === null || v === "" ? "—" : v;
  }

  private rowClick(r: Row, index: number) {
    if (this.interactive) this.dispatchEvent(new CustomEvent("acme-row", { detail: { row: r, index }, bubbles: true }));
  }

  /** The row under a mouse or pen pointer carries data-hover; touch never hovers. */
  private hover = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    const row = (e.target as Element).closest("tr");
    const next = row && !row.hasAttribute("aria-hidden") && this.body.contains(row) ? row : undefined;
    if (next === this.hovered) return;
    this.hovered?.removeAttribute("data-hover");
    next?.setAttribute("data-hover", "true");
    this.hovered = next;
  };
  private unhover = () => {
    this.hovered?.removeAttribute("data-hover");
    this.hovered = undefined;
  };

  private select(next: number[]) {
    this.selected = next;
    this.dispatchEvent(new CustomEvent("acme-select", { detail: { selected: next }, bubbles: true }));
  }
  private toggleAll = (e: Event) => {
    e.stopPropagation();
    const checked = (e as CustomEvent<{ checked: boolean }>).detail.checked;
    this.select(checked ? this.rows.map((_, i) => i) : []);
  };
  private toggleRow = (index: number) => (e: Event) => {
    e.stopPropagation();
    const checked = (e as CustomEvent<{ checked: boolean }>).detail.checked;
    const rest = this.selected.filter((i) => i !== index);
    this.select(checked ? [...rest, index].sort((a, b) => a - b) : rest);
  };

  private row(r: Row, index: number) {
    return html`<tr @click=${() => this.rowClick(r, index)}>
      ${this.selectable ? html`<td><acme-checkbox aria-label=${`Select row ${index + 1}`} .checked=${this.selected.includes(index)} @acme-change=${this.toggleRow(index)}></acme-checkbox></td>` : nothing}${this.columns.map(
        (c) => html`<td class=${c.numeric ? "num" : nothing}>${this.cell(c, r)}</td>`,
      )}
    </tr>`;
  }

  private rowsInWindow() {
    const v = this.virt.getVirtualizer();
    const items = v.getVirtualItems();
    const px = this.rowPx;
    const start = items[0]?.index ?? 0;
    const end = items.length ? items[items.length - 1].index : -1;
    // Spacer rows hold the place of the rows left out; a zero-height row keeps the stripes' parity when the first rendered row is odd.
    return html`${start % 2 ? html`<tr aria-hidden="true" style="height:0"></tr>` : nothing}<tr aria-hidden="true" style=${`height:${start * px}px`}></tr>${items.map((it) => this.row(this.rows[it.index], it.index))}<tr
        aria-hidden="true"
        style=${`height:${(this.rows.length - end - 1) * px}px`}
      ></tr>`;
  }

  render() {
    const cls = this.cls("root", { striped: this.striped, bordered: this.bordered, interactive: this.interactive, compact: this.density === "compact" });
    const all = this.rows.length > 0 && this.selected.length === this.rows.length;
    const some = this.selected.length > 0 && !all;
    const head = this.selectable
      ? html`<th scope="col"><acme-checkbox aria-label="Select all rows" .checked=${all} .indeterminate=${some} @acme-change=${this.toggleAll}></acme-checkbox></th>`
      : nothing;
    return html`<div class=${cls}>
      <table>
        ${this.columns.some((c) => c.width) ? html`<colgroup>${this.selectable ? html`<col>` : nothing}${this.columns.map((c) => html`<col style=${c.width ? `width:${c.width}` : nothing}>`)}</colgroup>` : nothing}
        <thead>
          <tr>
            ${head}${this.columns.map((c) => html`<th scope="col" class=${c.numeric ? "num" : nothing}>${c.label}</th>`)}
          </tr>
        </thead>
        ${this.removeSpacing ? nothing : html`<tbody class="spacer" aria-hidden="true"></tbody>`}
        <tbody class="body" style=${this.virtualize ? `height:${this.rows.length * this.rowPx}px` : nothing} @pointerover=${this.hover} @pointerleave=${this.unhover}>
          ${this.virtualize ? this.rowsInWindow() : this.rows.map((r, i) => this.row(r, i))}
        </tbody>
        ${this.footer.length ? html`<tfoot><tr>${this.footer.map((f) => html`<td colspan=${f.colspan ?? nothing}>${f.text}</td>`)}</tr></tfoot>` : nothing}
      </table>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-table": AcmeTable;
  }
}
