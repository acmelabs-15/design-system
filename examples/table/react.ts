import { useTable } from "@tanstack/react-table";
import { createElement as h, useLayoutEffect, useRef } from "react";
import { columnStyle, columns, type Delivery, type DeliveryCell, type DeliveryTable, data, features, headerRows, orderedCells, orderedColumns } from "./data";
import { gridKey, syncGridFocus } from "./grid-interaction";

const button = (props: Record<string, unknown>, ...children: React.ReactNode[]) => h("acme-button", { size: "small", variant: "tertiary", ...props }, ...children);
const options = {
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
/** React owns and reconciles every native table row and cell. */
export function DeliveryTableReact({ ready }: { ready: (table: DeliveryTable) => void }) {
  const table = useTable(options);
  const native = useRef<HTMLTableElement>(null);
  useLayoutEffect(() => {
    ready(table);
    if (native.current) syncGridFocus(native.current, table);
  });
  const rows = [...table.getTopRows(), ...table.getCenterRows(), ...table.getBottomRows()];
  function cell(cell: DeliveryCell) {
    if (cell.getIsCovered()) return null;
    const row = cell.row;
    const edges = cell.getSelectionEdges();
    return h(
      "td",
      {
        key: cell.id,
        role: "gridcell",
        "data-range-start": edges.left ? "" : undefined,
        "data-range-end": edges.right ? "" : undefined,
        "data-range-top": edges.top ? "" : undefined,
        "data-range-bottom": edges.bottom ? "" : undefined,
        "data-cell": cell.id,
        "data-column": cell.column.id,
        colSpan: cell.getColSpan(),
        rowSpan: cell.getRowSpan(),
        "data-pinned": cell.column.getIsPinned() || undefined,
        style: columnStyle(cell.column),
        "aria-selected": cell.getIsSelected(),
        tabIndex: -1,
        onMouseDown: (event: React.MouseEvent<HTMLElement>) => {
          if ((event.target as Element).closest("button,input,acme-button,acme-input,acme-checkbox")) return;
          cell.getSelectionStartHandler()(event);
          event.currentTarget.focus();
        },
        onMouseEnter: cell.getSelectionExtendHandler(),
      },
      cell.column.id === "select"
        ? h("acme-checkbox", {
            "aria-label": "Select " + row.id,
            checked: row.getIsSelected(),
            "onacme-change": (event: CustomEvent<{ checked: boolean }>) => row.toggleSelected(event.detail.checked),
          })
        : cell.column.id === "name"
          ? h(
              "span",
              null,
              row.getCanExpand() ? button({ "aria-label": "Expand " + row.id, "aria-expanded": row.getIsExpanded(), onClick: row.getToggleExpandedHandler() }, row.getIsExpanded() ? "−" : "+") : null,
              String(cell.getValue() ?? ""),
              h("acme-input", { "aria-label": "Note " + row.id, placeholder: "Note", size: "small" }),
            )
          : String(cell.getValue() ?? ""),
    );
  }
  return h(
    "div",
    null,
    h(
      "acme-table",
      { "sticky-header": true, "aria-label": "Delivery results", style: { height: 360, maxWidth: 800 } },
      h(
        "table",
        {
          ref: native,
          role: "grid",
          onKeyDown: (event: React.KeyboardEvent) => void gridKey(event.nativeEvent, table, native.current!),
          onFocus: () => syncGridFocus(native.current!, table),
          style: { width: table.getTotalSize(), tableLayout: "fixed" },
        },
        h("caption", null, "Consumer-owned TanStack Table"),
        h("colgroup", null, ...orderedColumns(table).map((column) => h("col", { key: column.id, style: columnStyle(column) }))),
        h(
          "thead",
          null,
          ...headerRows(table).map((group) =>
            h(
              "tr",
              { key: group.id },
              ...group.headers.map((header) =>
                header.rowSpan === 0
                  ? null
                  : h(
                      "th",
                      {
                        key: header.id,
                        "data-header": "",
                        "data-leaf": String(!header.subHeaders.length),
                        scope: header.colSpan > 1 ? "colgroup" : "col",
                        colSpan: header.colSpan,
                        rowSpan: header.rowSpan ?? 1,
                        "data-column": header.column.id,
                        "data-pinned": header.column.getIsPinned() || undefined,
                        style: columnStyle(header.column),
                        "aria-sort": header.column.getIsSorted() === "asc" ? "ascending" : header.column.getIsSorted() === "desc" ? "descending" : undefined,
                      },
                      header.isPlaceholder
                        ? null
                        : header.column.getCanSort()
                          ? button({ onClick: header.column.getToggleSortingHandler() }, String(header.column.columnDef.header ?? header.column.id))
                          : String(header.column.columnDef.header ?? header.column.id),
                      header.column.getCanResize() && !header.subHeaders.length
                        ? button(
                            {
                              "aria-label": "Resize " + header.column.id,
                              onMouseDown: header.getResizeHandler(),
                              onTouchStart: header.getResizeHandler(),
                              onKeyDown: (event: React.KeyboardEvent) => {
                                if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
                                event.preventDefault();
                                table.setColumnSizing((old) => ({ ...old, [header.column.id]: Math.max(40, header.column.getSize() + (event.key === "ArrowRight" ? 10 : -10)) }));
                              },
                            },
                            "↔",
                          )
                        : null,
                    ),
              ),
            ),
          ),
        ),
        h(
          "tbody",
          null,
          ...rows.map((row) => h("tr", { key: row.id, "data-row": row.id, "aria-selected": row.getIsSelected(), "data-pinned": row.getIsPinned() || undefined }, ...orderedCells(row).map(cell))),
        ),
        h(
          "tfoot",
          null,
          h(
            "tr",
            null,
            h("th", { scope: "row", colSpan: Math.max(1, orderedColumns(table).length - 1) }, "Filtered amount"),
            h("td", null, String(table.getColumn("amount")?.getAggregationValue({ rows: table.getFilteredRowModel().rows }))),
          ),
        ),
      ),
    ),
    h(
      "acme-pagination",
      {
        page: table.state.pagination.pageIndex + 1,
        pageSize: table.state.pagination.pageSize,
        count: table.getRowCount(),
        "onacme-request": (event: CustomEvent) => {
          if (event.detail.action === "page") {
            event.stopPropagation();
            table.setPageIndex(event.detail.page - 1);
          }
          if (event.detail.action === "page-size") {
            event.stopPropagation();
            table.setPageSize(event.detail.pageSize);
          }
        },
      },
      h("acme-pagination-position"),
      h("acme-pagination-previous"),
      h("acme-pagination-next"),
      h("acme-pagination-page-size"),
    ),
  );
}
