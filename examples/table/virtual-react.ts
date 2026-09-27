import { Table } from "@acmelabs/design-system-react/components/table";
import type { AcmeTable } from "@acmelabs/design-system/components/table";
import { useAtom, useCreateAtom } from "@tanstack/react-store";
import { useTable } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { createElement as h, useCallback, useLayoutEffect, useRef } from "react";
import { columnStyle, columns, type Delivery, type DeliveryCell, type DeliveryRow, type DeliveryTable, data, features, orderedColumns } from "./data";
import { gridKey, syncGridFocus } from "./grid-interaction";
import { columnWindow, type VirtualMode, visibleRows, windowCells } from "./virtual-layout";

const options = {
  features,
  columns,
  data,
  getRowId: (row: Delivery) => row.id,
  getSubRows: (row: Delivery) => row.subRows,
  initialState: { pagination: { pageIndex: 0, pageSize: 200 } },
  autoResetPageIndex: false,
  autoResetCellSelection: false,
};
export function VirtualDeliveryReact({
  ready,
}: {
  ready: (value: { model: DeliveryTable; setMode: (mode: VirtualMode) => void; updateDetails: (id: string, details: string) => void; setRows: (rows: Delivery[]) => void }) => void;
}) {
  const source = useCreateAtom(data),
    [currentData, setData] = useAtom(source);
  const updateDetails = (id: string, details: string) => setData((rows) => rows.map((row) => (row.id === id ? { ...row, details } : row)));
  const modeAtom = useCreateAtom<VirtualMode>("both"),
    [mode, setMode] = useAtom(modeAtom),
    vertical = mode !== "horizontal",
    horizontal = mode !== "vertical";
  const table = useTable({ ...options, data: currentData, enableCellSpanning: !vertical }),
    rows = table.getCenterRows();
  const container = useRef<AcmeTable>(null),
    native = useRef<HTMLTableElement>(null),
    body = useRef<HTMLTableSectionElement>(null);
  const margin = useRef(0);
  const rowKey = useCallback((index: number) => rows[index].id, [rows]);
  const rowVirtual = useVirtualizer<HTMLElement, HTMLTableRowElement>({
    count: rows.length,
    enabled: vertical,
    getScrollElement: () => container.current?.getScrollElement() ?? null,
    estimateSize: () => 64,
    getItemKey: rowKey,
    overscan: 3,
    useAnimationFrameWithResizeObserver: true,
    scrollMargin: margin.current,
  });
  const center = table.getCenterVisibleLeafColumns();
  const columnKey = useCallback((index: number) => center[index].id, [center]);
  const columnVirtual = useVirtualizer<HTMLElement, HTMLElement>({
    count: center.length,
    enabled: horizontal,
    horizontal: true,
    getScrollElement: () => container.current?.getScrollElement() ?? null,
    estimateSize: (index) => center[index].getSize(),
    getItemKey: columnKey,
    overscan: 0,
    isRtl: document.documentElement.dir === "rtl",
  });
  const geometry = horizontal ? center.map((column) => column.id + ":" + column.getSize()).join("|") : "";
  useLayoutEffect(() => {
    if (geometry) {
      columnVirtual.measure();
    }
  }, [geometry]);
  const items = rowVirtual.getVirtualItems(),
    shown = visibleRows(rows, items, vertical),
    window = columnWindow(table, rows, columnVirtual.getVirtualItems(), horizontal),
    before = vertical && items.length ? Math.max(0, items[0].start - margin.current) : 0,
    after = vertical && items.length ? Math.max(0, rowVirtual.getTotalSize() - (items.at(-1)!.end - margin.current)) : 0;
  useLayoutEffect(() => {
    ready({ model: table, setMode, updateDetails, setRows: setData });
    const scroll = container.current?.getScrollElement();
    if (vertical && body.current && scroll) {
      const next = body.current.getBoundingClientRect().top - scroll.getBoundingClientRect().top + scroll.scrollTop;
      if (Math.abs(margin.current - next) > 0.1) {
        margin.current = next;
        rowVirtual.setOptions({ ...rowVirtual.options, scrollMargin: next });
        rowVirtual.measure();
      }
    }
    if (native.current) {
      syncGridFocus(native.current, table);
    }
  });
  async function reveal(rowId: string, columnId: string) {
    const row = rows.findIndex((row) => row.id === rowId),
      column = center.findIndex((column) => column.id === columnId);
    if (row >= 0 && vertical) {
      rowVirtual.scrollToIndex(row, { align: "auto" });
    }
    if (column >= 0 && horizontal) {
      columnVirtual.scrollToIndex(column, { align: "auto" });
    }
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
  }
  const spacer = (width: number, count: number, key: string) => (count ? h("td", { key, "aria-hidden": true, colSpan: count, style: { width, padding: 0, border: 0 } }) : null);
  function cell(cell: DeliveryCell) {
    if (cell.getIsCovered()) {
      return null;
    }
    return h(
      "td",
      {
        key: cell.id,
        role: "gridcell",
        "data-cell": cell.id,
        "data-column": cell.column.id,
        "aria-colindex": orderedColumns(table).findIndex((column) => column.id === cell.column.id) + 1,
        colSpan: cell.getColSpan(),
        rowSpan: cell.getRowSpan(),
        "data-pinned": cell.column.getIsPinned() || undefined,
        style: columnStyle(cell.column),
        tabIndex: -1,
      },
      cell.column.id === "name"
        ? h(
            "span",
            null,
            cell.row.getCanExpand() ? h("button", { type: "button", onClick: cell.row.getToggleExpandedHandler(), "aria-label": "Expand " + cell.row.id }, "Expand") : null,
            String(cell.getValue() ?? ""),
          )
        : String(cell.getValue() ?? ""),
    );
  }
  function row(row: DeliveryRow, index?: number) {
    const cells = windowCells(row, window);
    return h(
      "tr",
      {
        key: row.id,
        "data-row": row.id,
        "data-index": index,
        "aria-rowindex": index === undefined ? undefined : index + 2,
        "data-pinned": row.getIsPinned() || undefined,
        ref:
          index === undefined || !vertical
            ? undefined
            : (element: HTMLTableRowElement | null) => {
                if (element) {
                  rowVirtual.measureElement(element);
                }
              },
      },
      ...cells.start.map(cell),
      spacer(window.beforeWidth, window.before.length, "before"),
      ...cells.center.map(cell),
      spacer(window.afterWidth, window.after.length, "after"),
      ...cells.end.map(cell),
    );
  }
  const header = (column: ReturnType<DeliveryTable["getAllLeafColumns"]>[number]) =>
    h(
      "th",
      { key: column.id, "data-header": "", "data-leaf": "true", "data-column": column.id, "data-pinned": column.getIsPinned() || undefined, style: columnStyle(column) },
      String(column.columnDef.header ?? column.id),
    );
  const rowSpacer = (height: number, key: string) =>
    height ? h("tr", { key, "aria-hidden": true, "data-acme-table-part": "spacer", style: { "--acme-table-spacer-height": height + "px" } }, h("td", { colSpan: window.columns.length })) : null;
  return h(
    Table,
    { ref: container, stickyHeader: true, "aria-label": "Virtual delivery results", style: { height: 320, width: 480, maxWidth: "100%" } },
    h(
      "table",
      {
        ref: native,
        role: "grid",
        "aria-rowcount": rows.length + 1,
        "aria-colcount": window.columns.length,
        onKeyDown: (event: React.KeyboardEvent) => void gridKey(event.nativeEvent, table, native.current!, reveal),
        onFocus: () => syncGridFocus(native.current!, table),
        style: { width: table.getTotalSize(), tableLayout: "fixed" },
      },
      h("caption", null, "Virtualized consumer data"),
      h("colgroup", null, ...window.columns.map((column) => h("col", { key: column.id, style: columnStyle(column) }))),
      h(
        "thead",
        null,
        h(
          "tr",
          null,
          ...window.start.map(header),
          spacer(window.beforeWidth, window.before.length, "before"),
          ...window.center.map(header),
          spacer(window.afterWidth, window.after.length, "after"),
          ...window.end.map(header),
        ),
      ),
      h("tbody", null, ...table.getTopRows().map((item) => row(item))),
      h("tbody", { ref: body, "data-virtual-body": "" }, rowSpacer(before, "before"), ...shown.map((item) => row(item.row, item.index)), rowSpacer(after, "after")),
      h("tbody", null, ...table.getBottomRows().map((item) => row(item))),
    ),
  );
}
