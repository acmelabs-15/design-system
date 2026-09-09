import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import "@lit-labs/virtualizer";
import { tableCss } from "./table.styles.js";

export type Column = { key: string; label: string; numeric?: boolean; sortable?: boolean; render?: (row: Record<string, unknown>) => unknown };

/** Geist Table: 36px header, 40px rows, gray-900 cells; striped, bordered, interactive; `virtualize` past a few hundred rows. */
@customElement("acme-table")
export class AcmeTable extends AcmeElement {
  static styles = [
    sharedCss,
    tableCss,
    css`:host{display:block} .table-wrap{overflow-x:auto} lit-virtualizer{display:block;max-height:var(--table-max,400px);overflow:auto} .vrow{display:grid;grid-template-columns:var(--grid);align-items:center;min-height:40px;font-size:14px;line-height:20px;color:var(--text-2)} .vrow > div{padding:10px 8px} .vrow.head{min-height:36px;font-weight:500;border-bottom:1px solid var(--border)} .vrow.head > div{padding:0 8px;height:36px;display:flex;align-items:center} .vrow.striped:nth-child(even){background:var(--surface-2)} .n{text-align:right;font-family:var(--mono);font-variant-numeric:tabular-nums}`,
  ];
  @property({ type: Array }) columns: Column[] = [];
  @property({ type: Array }) rows: Record<string, unknown>[] = [];
  @property({ type: Boolean }) striped = false;
  @property({ type: Boolean }) bordered = false;
  @property({ type: Boolean }) interactive = false;
  @property({ type: Boolean }) framed = false;
  @property({ type: Boolean }) virtualize = false;
  @property() sort = "";
  @property() dir: "ascending" | "descending" = "ascending";
  private get sorted() {
    if (!this.sort) return this.rows;
    const k = this.sort,
      d = this.dir === "ascending" ? 1 : -1;
    return [...this.rows].sort((a, b) => ((a[k] as any) > (b[k] as any) ? d : (a[k] as any) < (b[k] as any) ? -d : 0));
  }
  private toggleSort(c: Column) {
    if (!c.sortable) return;
    if (this.sort === c.key) this.dir = this.dir === "ascending" ? "descending" : "ascending";
    else {
      this.sort = c.key;
      this.dir = "ascending";
    }
    this.dispatchEvent(new CustomEvent("acme-sort", { detail: { key: this.sort, dir: this.dir }, bubbles: true }));
  }
  private cell(c: Column, r: Record<string, unknown>) {
    const v = c.render ? c.render(r) : r[c.key];
    return v === undefined || v === null || v === "" ? "—" : v;
  }
  private rowClick(r: Record<string, unknown>) {
    if (this.interactive) this.dispatchEvent(new CustomEvent("acme-row", { detail: r, bubbles: true }));
  }
  render() {
    if (!this.columns.length) return html`<div class="table-wrap"><slot></slot></div>`;
    const cls = this.cls("table", { striped: this.striped, bordered: this.bordered, interactive: this.interactive, framed: this.framed });
    const head = this.columns.map((c) => this.sortable(c));
    if (this.virtualize) {
      const grid = this.columns.map((c) => (c.numeric ? "minmax(80px,1fr)" : "minmax(120px,2fr)")).join(" ");
      return html`<div class=${cls} style=${`--grid:${grid}`} part="table"><div class="vrow head">${this.columns.map((c) => html`<div class=${c.numeric ? "n" : ""} aria-sort=${this.sort === c.key ? this.dir : nothing} @click=${() => this.toggleSort(c)} style=${c.sortable ? "cursor:pointer" : nothing}>${c.label}${this.arrow(c)}</div>`)}</div>
        <lit-virtualizer .items=${this.sorted} .renderItem=${(r: Record<string, unknown>, _i: number) => html`<div class=${this.cls("vrow", { striped: this.striped })} style=${this.bordered ? "border-bottom:1px solid var(--border)" : nothing} @click=${() => this.rowClick(r)}>${this.columns.map((c) => html`<div class=${c.numeric ? "n" : ""}>${this.cell(c, r)}</div>`)}</div>`}></lit-virtualizer></div>`;
    }
    return html`<div class="table-wrap"><table class=${cls} part="table"><thead><tr>${head}</tr></thead><tbody>${this.sorted.map((r) => html`<tr @click=${() => this.rowClick(r)}>${this.columns.map((c) => html`<td class=${c.numeric ? "n" : ""}>${this.cell(c, r)}</td>`)}</tr>`)}${this.rows.length ? nothing : html`<tr class="empty"><td colspan=${this.columns.length}><slot name="empty">—</slot></td></tr>`}</tbody><slot name="foot"></slot></table></div>`;
  }
  private arrow(c: Column) {
    return this.sort === c.key ? html` ${this.dir === "ascending" ? "↑" : "↓"}` : nothing;
  }
  private sortable(c: Column) {
    return html`<th class=${c.numeric ? "n" : ""} aria-sort=${c.sortable ? (this.sort === c.key ? this.dir : "none") : nothing} scope="col">${c.sortable ? html`<button style="all:unset;cursor:pointer;font:inherit;color:inherit" aria-label=${`Sort by ${c.label}`} @click=${() => this.toggleSort(c)}>${c.label}${this.arrow(c)}</button>` : c.label}</th>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-table": AcmeTable;
  }
}
