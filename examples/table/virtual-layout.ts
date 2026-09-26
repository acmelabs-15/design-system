import type { VirtualItem } from "@tanstack/virtual-core";
import type { DeliveryCell, DeliveryRow, DeliveryTable } from "./data";
import { orderedCells, orderedColumns } from "./data";

export type VirtualMode = "vertical" | "horizontal" | "both";
export function columnWindow(table: DeliveryTable, rows: readonly DeliveryRow[], items: readonly VirtualItem[], enabled: boolean) {
  const columns = orderedColumns(table),
    center = table.getCenterVisibleLeafColumns();
  let start = enabled ? (items[0]?.index ?? 0) : 0,
    end = enabled ? (items.at(-1)?.index ?? Math.min(2, center.length - 1)) : center.length - 1;
  let changed = true;
  while (changed) {
    changed = false;
    for (const row of rows) {
      const cells = row.getCenterVisibleCells();
      for (let i = 0; i < cells.length; i++) {
        const span = cells[i].getColSpan();
        if (span < 2 || i > end || i + span - 1 < start) {
          continue;
        }
        const a = Math.min(start, i),
          b = Math.max(end, i + span - 1);
        if (a !== start || b !== end) {
          start = a;
          end = b;
          changed = true;
        }
      }
    }
  }
  const before = center.slice(0, start),
    after = center.slice(end + 1);
  return {
    columns,
    center: center.slice(start, end + 1),
    start: table.getStartVisibleLeafColumns(),
    end: table.getEndVisibleLeafColumns(),
    before,
    after,
    beforeWidth: before.reduce((sum, c) => sum + c.getSize(), 0),
    afterWidth: after.reduce((sum, c) => sum + c.getSize(), 0),
  };
}
export function windowCells(row: DeliveryRow, window: ReturnType<typeof columnWindow>): { start: DeliveryCell[]; center: DeliveryCell[]; end: DeliveryCell[] } {
  const current = new Set(window.center.map((column) => column.id));
  return { start: row.getStartVisibleCells(), center: row.getCenterVisibleCells().filter((cell) => current.has(cell.column.id)), end: row.getEndVisibleCells() };
}
export function columnSpanWidth(cell: DeliveryCell) {
  const columns = orderedColumns(cell.row.table),
    index = columns.findIndex((column) => column.id === cell.column.id);
  return columns.slice(index, index + cell.getColSpan()).reduce((sum, column) => sum + column.getSize(), 0);
}
export function visibleRows(rows: readonly DeliveryRow[], items: readonly VirtualItem[], enabled: boolean) {
  return enabled ? items.map((item) => ({ row: rows[item.index], index: item.index })).filter((item) => item.row) : rows.map((row, index) => ({ row, index }));
}
