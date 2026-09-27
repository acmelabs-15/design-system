import type { AcmeTable } from "@acmelabs/design-system/components/table";
import { createAtom, TanStackStoreAtom } from "@tanstack/lit-store";
import { TableController } from "@tanstack/lit-table";
import { VirtualizerController } from "@tanstack/lit-virtual";
import { html, LitElement, nothing } from "lit";
import "lit/directives/ref.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";
import { columnStyle, columns, type Delivery, type DeliveryCell, type DeliveryRow, type DeliveryTable, data, features, orderedColumns } from "./data";
import { gridKey, syncGridFocus } from "./grid-interaction";
import { columnWindow, type VirtualMode, visibleRows, windowCells } from "./virtual-layout";

export class VirtualDeliveryLit extends LitElement {
  private readonly source = createAtom(data);
  private readonly sourceUpdates = new TanStackStoreAtom(this, () => this.source);
  setRows(rows: Delivery[]) {
    this.source.set(rows);
  }
  updateDetails(id: string, details: string) {
    this.source.set((rows) => rows.map((row) => (row.id === id ? { ...row, details } : row)));
  }
  private readonly mode = createAtom<VirtualMode>("both");
  private readonly modeUpdates = new TanStackStoreAtom(this, () => this.mode);
  private readonly controller = new TableController<typeof features, Delivery>(this);
  model?: DeliveryTable;
  private currentRows: DeliveryRow[] = [];
  private readonly rowVirtual = new VirtualizerController<HTMLElement, HTMLTableRowElement>(this, {
    count: 0,
    getScrollElement: () => this.container?.getScrollElement() ?? null,
    estimateSize: () => 64,
    getItemKey: (index) => this.currentRows[index]?.id ?? index,
    overscan: 3,
    useAnimationFrameWithResizeObserver: true,
  });
  private readonly columnVirtual = new VirtualizerController<HTMLElement, HTMLElement>(this, {
    count: 0,
    horizontal: true,
    getScrollElement: () => this.container?.getScrollElement() ?? null,
    estimateSize: (index) => this.model?.getCenterVisibleLeafColumns()[index]?.getSize() ?? 150,
    getItemKey: (index) => this.model?.getCenterVisibleLeafColumns()[index]?.id ?? index,
    overscan: 0,
  });
  private readonly options = {
    features,
    columns,
    data,
    getRowId: (row: Delivery) => row.id,
    getSubRows: (row: Delivery) => row.subRows,
    initialState: { pagination: { pageIndex: 0, pageSize: 200 } },
    autoResetPageIndex: false,
    autoResetCellSelection: false,
  };
  setMode(mode: VirtualMode) {
    this.mode.set(mode);
  }
  get container() {
    return this.renderRoot.querySelector<AcmeTable>("acme-table");
  }
  private async reveal(rowId: string, columnId: string) {
    const row = this.currentRows.findIndex((row) => row.id === rowId),
      column = this.model?.getCenterVisibleLeafColumns().findIndex((column) => column.id === columnId) ?? -1;
    if (row >= 0 && this.mode.get() !== "horizontal") {
      this.rowVirtual.getVirtualizer().scrollToIndex(row, { align: "auto" });
    }
    if (column >= 0 && this.mode.get() !== "vertical") {
      this.columnVirtual.getVirtualizer().scrollToIndex(column, { align: "auto" });
    }
    await this.updateComplete;
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
  }
  private columnGeometry = "";
  protected updated() {
    const geometry =
      this.mode.get() !== "vertical"
        ? this.model
            ?.getCenterVisibleLeafColumns()
            .map((column) => column.id + ":" + column.getSize())
            .join("|")
        : "";
    if (geometry !== this.columnGeometry) {
      this.columnGeometry = geometry ?? "";
      if (geometry) {
        this.columnVirtual.getVirtualizer().measure();
      }
    }
    const body = this.renderRoot.querySelector<HTMLElement>("[data-virtual-body]"),
      scroll = this.container?.getScrollElement();
    if (this.mode.get() !== "horizontal" && body && scroll) {
      const row = this.rowVirtual.getVirtualizer(),
        margin = body.getBoundingClientRect().top - scroll.getBoundingClientRect().top + scroll.scrollTop;
      if (Math.abs((row.options.scrollMargin ?? 0) - margin) > 0.1) {
        row.setOptions({ ...row.options, scrollMargin: margin });
        this.requestUpdate();
      }
    }
    if (this.mode.get() !== "horizontal") {
      for (const row of this.renderRoot.querySelectorAll<HTMLTableRowElement>("[data-index]")) {
        this.rowVirtual.getVirtualizer().measureElement(row);
      }
    }
    if (this.model && this.container?.getTableElement()) {
      syncGridFocus(this.container.getTableElement()!, this.model);
    }
  }
  render() {
    const mode = this.mode.get(),
      vertical = mode !== "horizontal",
      horizontal = mode !== "vertical";
    const table = this.controller.table({ ...this.options, data: this.source.get(), enableCellSpanning: !vertical });
    this.model = table;
    const rows = table.getCenterRows();
    this.currentRows = rows;
    const rowVirtual = this.rowVirtual.getVirtualizer(),
      columnVirtual = this.columnVirtual.getVirtualizer();
    rowVirtual.setOptions({ ...rowVirtual.options, count: rows.length, enabled: vertical });
    columnVirtual.setOptions({
      ...columnVirtual.options,
      count: table.getCenterVisibleLeafColumns().length,
      enabled: horizontal,
      isRtl: this.ownerDocument.defaultView!.getComputedStyle(this).direction === "rtl",
    });
    const items = rowVirtual.getVirtualItems(),
      shown = visibleRows(rows, items, vertical),
      window = columnWindow(table, rows, columnVirtual.getVirtualItems(), horizontal);
    const before = vertical && items.length ? Math.max(0, items[0].start - (rowVirtual.options.scrollMargin ?? 0)) : 0,
      after = vertical && items.length ? Math.max(0, rowVirtual.getTotalSize() - (items.at(-1)!.end - (rowVirtual.options.scrollMargin ?? 0))) : 0;
    const spacer = (width: number, count: number) => (count ? html`<td aria-hidden="true" colspan=${count} style=${styleMap({ width: `${width}px`, padding: "0", border: "0" })}></td>` : nothing);
    const row = (row: DeliveryRow, index?: number) => {
      const cells = windowCells(row, window);
      return html`<tr data-row=${row.id} data-index=${index ?? nothing} aria-rowindex=${index === undefined ? nothing : index + 2} data-pinned=${row.getIsPinned() || nothing}>${cells.start.map((cell) => this.cell(cell))}${spacer(window.beforeWidth, window.before.length)}${cells.center.map((cell) => this.cell(cell))}${spacer(window.afterWidth, window.after.length)}${cells.end.map((cell) => this.cell(cell))}</tr>`;
    };
    return html`<acme-table sticky-header aria-label="Virtual delivery results" style="height:320px;width:480px;max-width:100%"><table role="grid" aria-rowcount=${rows.length + 1} aria-colcount=${window.columns.length} @keydown=${(event: KeyboardEvent) => void gridKey(event, table, this.container!.getTableElement()!, this.reveal.bind(this))} @focusin=${() => syncGridFocus(this.container!.getTableElement()!, table)} style=${styleMap({ width: `${table.getTotalSize()}px`, tableLayout: "fixed" })}><caption>Virtualized consumer data</caption><colgroup>${window.columns.map((column) => html`<col style=${styleMap(columnStyle(column))}>`)}</colgroup><thead><tr>${window.start.map((column) => this.header(column))}${spacer(window.beforeWidth, window.before.length)}${window.center.map((column) => this.header(column))}${spacer(window.afterWidth, window.after.length)}${window.end.map((column) => this.header(column))}</tr></thead><tbody>${table.getTopRows().map((item) => row(item))}</tbody><tbody data-virtual-body>${before ? html`<tr aria-hidden="true" data-acme-table-part="spacer" style=${styleMap({ "--acme-table-spacer-height": `${before}px` })}><td colspan=${window.columns.length}></td></tr>` : nothing}${repeat(
      shown,
      (item) => item.row.id,
      (item) => row(item.row, item.index),
    )}${after ? html`<tr aria-hidden="true" data-acme-table-part="spacer" style=${styleMap({ "--acme-table-spacer-height": `${after}px` })}><td colspan=${window.columns.length}></td></tr>` : nothing}</tbody><tbody>${table.getBottomRows().map((item) => row(item))}</tbody></table></acme-table>`;
  }
  private header(column: ReturnType<DeliveryTable["getAllLeafColumns"]>[number]) {
    return html`<th data-header data-leaf="true" data-column=${column.id} data-pinned=${column.getIsPinned() || nothing} style=${styleMap(columnStyle(column))}>${String(column.columnDef.header ?? column.id)}</th>`;
  }
  private cell(cell: DeliveryCell) {
    if (cell.getIsCovered()) {
      return nothing;
    }
    return html`<td role="gridcell" data-cell=${cell.id} data-column=${cell.column.id} aria-colindex=${orderedColumns(this.model!).findIndex((column) => column.id === cell.column.id) + 1} colspan=${cell.getColSpan()} rowspan=${cell.getRowSpan()} data-pinned=${cell.column.getIsPinned() || nothing} style=${styleMap(columnStyle(cell.column))} tabindex="-1">${cell.column.id === "name" ? html`${cell.row.getCanExpand() ? html`<button type="button" @click=${cell.row.getToggleExpandedHandler()} aria-label=${"Expand " + cell.row.id}>Expand</button>` : nothing}${String(cell.getValue() ?? "")}` : String(cell.getValue() ?? "")}</td>`;
  }
}
