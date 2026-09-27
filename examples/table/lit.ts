import type { AcmeTable } from "@acmelabs/design-system/components/table";
import { TableController } from "@tanstack/lit-table";
import { html, LitElement, nothing } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";
import { columnStyle, columns, type Delivery, type DeliveryCell, type DeliveryTable, data, features, headerRows, orderedCells, orderedColumns } from "./data";
import { gridKey, syncGridFocus } from "./grid-interaction";
/** The consuming application owns Table models and native table content. */
export class DeliveryTableLit extends LitElement {
  private readonly controller = new TableController<typeof features, Delivery>(this);
  model?: DeliveryTable;
  private readonly options = {
    features,
    columns,
    data,
    getRowId: (row: Delivery) => row.id,
    getSubRows: (row: Delivery) => row.subRows,
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
    autoResetPageIndex: false,
    autoResetCellSelection: false,
    columnResizeMode: "onChange" as const,
  };
  render() {
    const table = this.controller.table(this.options);
    this.model = table;
    const rows = [...table.getTopRows(), ...table.getCenterRows(), ...table.getBottomRows()];
    return html`<acme-table sticky-header aria-label="Delivery results" style="height:360px;max-width:800px"><table role="grid" @keydown=${(event: KeyboardEvent) => void gridKey(event, table, this.container!.getTableElement()!)} @focusin=${() => syncGridFocus(this.container!.getTableElement()!, table)} style=${styleMap({ width: `${table.getTotalSize()}px`, tableLayout: "fixed" })}><caption>Consumer-owned TanStack Table</caption><colgroup>${repeat(
      orderedColumns(table),
      (column) => column.id,
      (column) => html`<col style=${styleMap(columnStyle(column))}>`,
    )}</colgroup><thead>${repeat(
      headerRows(table),
      (group) => group.id,
      (group) =>
        html`<tr>${repeat(
          group.headers,
          (header) => header.id,
          (header) =>
            header.rowSpan === 0
              ? nothing
              : html`<th data-header data-leaf=${String(!header.subHeaders.length)} scope=${header.colSpan > 1 ? "colgroup" : "col"} colspan=${header.colSpan} rowspan=${header.rowSpan ?? 1} data-column=${header.column.id} data-pinned=${header.column.getIsPinned() || nothing} style=${styleMap(columnStyle(header.column))} aria-sort=${header.column.getIsSorted() === "asc" ? "ascending" : header.column.getIsSorted() === "desc" ? "descending" : nothing}>${header.isPlaceholder ? nothing : header.column.getCanSort() ? html`<acme-button size="small" variant="tertiary" @click=${header.column.getToggleSortingHandler()}>${String(header.column.columnDef.header ?? header.column.id)}</acme-button>` : String(header.column.columnDef.header ?? header.column.id)}${
                  header.column.getCanResize() && !header.subHeaders.length
                    ? html`<acme-button size="small" variant="tertiary" aria-label=${"Resize " + header.column.id} @mousedown=${header.getResizeHandler()} @touchstart=${header.getResizeHandler()} @keydown=${(
                        e: KeyboardEvent,
                      ) => {
                        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") {
                          return;
                        }
                        e.preventDefault();
                        table.setColumnSizing((old) => ({ ...old, [header.column.id]: Math.max(40, header.column.getSize() + (e.key === "ArrowRight" ? 10 : -10)) }));
                      }}>↔</acme-button>`
                    : nothing
                }</th>`,
        )}</tr>`,
    )}</thead><tbody>${repeat(
      rows,
      (row) => row.id,
      (row) =>
        html`<tr data-row=${row.id} aria-selected=${String(row.getIsSelected())} data-pinned=${row.getIsPinned() || nothing}>${repeat(
          orderedCells(row),
          (cell) => cell.id,
          (cell) => this.cell(cell),
        )}</tr>`,
    )}</tbody><tfoot><tr><th scope="row" colspan=${Math.max(1, orderedColumns(table).length - 1)}>Filtered amount</th><td>${table.getColumn("amount")?.getAggregationValue({ rows: table.getFilteredRowModel().rows })}</td></tr></tfoot></table></acme-table><acme-pagination .page=${table.state.pagination.pageIndex + 1} .pageSize=${table.state.pagination.pageSize} .count=${table.getRowCount()} @acme-request=${(
      event: CustomEvent,
    ) => {
      if (event.detail.action === "page") {
        event.stopPropagation();
        table.setPageIndex(event.detail.page - 1);
      }
      if (event.detail.action === "page-size") {
        event.stopPropagation();
        table.setPageSize(event.detail.pageSize);
      }
    }}><acme-pagination-position></acme-pagination-position><acme-pagination-previous></acme-pagination-previous><acme-pagination-next></acme-pagination-next><acme-pagination-page-size></acme-pagination-page-size></acme-pagination>`;
  }
  private cell(cell: DeliveryCell) {
    if (cell.getIsCovered()) {
      return nothing;
    }
    const edges = cell.getSelectionEdges();
    const row = cell.row,
      pin = cell.column.getIsPinned();
    return html`<td role="gridcell" ?data-range-start=${edges.left} ?data-range-end=${edges.right} ?data-range-top=${edges.top} ?data-range-bottom=${edges.bottom} data-cell=${cell.id} data-column=${cell.column.id} colspan=${cell.getColSpan()} rowspan=${cell.getRowSpan()} data-pinned=${pin || nothing} style=${styleMap(columnStyle(cell.column))} aria-selected=${String(cell.getIsSelected())} tabindex="-1" @mousedown=${(
      event: MouseEvent,
    ) => {
      if ((event.target as Element).closest("button,input,acme-button,acme-input,acme-checkbox")) {
        return;
      }
      cell.getSelectionStartHandler()(event);
      (event.currentTarget as HTMLElement).focus();
    }} @mouseenter=${cell.getSelectionExtendHandler()}>${cell.column.id === "select" ? html`<acme-checkbox aria-label=${"Select " + row.id} .checked=${row.getIsSelected()} @acme-change=${(event: CustomEvent<{ checked: boolean }>) => row.toggleSelected(event.detail.checked)}></acme-checkbox>` : cell.column.id === "name" ? html`${row.getCanExpand() ? html`<acme-button size="small" variant="tertiary" aria-label=${"Expand " + row.id} aria-expanded=${String(row.getIsExpanded())} @click=${row.getToggleExpandedHandler()}>${row.getIsExpanded() ? "−" : "+"}</acme-button>` : nothing}<span>${String(cell.getValue() ?? "")}</span><acme-input aria-label=${"Note " + row.id} placeholder="Note" size="small"></acme-input>` : String(cell.getValue() ?? "")}</td>`;
  }
  protected updated() {
    const root = this.container?.getTableElement();
    if (root && this.model) {
      syncGridFocus(root, this.model);
    }
  }
  get container() {
    return this.renderRoot.querySelector<AcmeTable>("acme-table");
  }
}
