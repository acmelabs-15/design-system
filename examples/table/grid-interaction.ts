import type { DeliveryTable } from "./data";

function active(document: Document): Element | null {
  let element = document.activeElement;
  while (element?.shadowRoot?.activeElement) element = element.shadowRoot.activeElement;
  return element;
}
const target = (root: HTMLTableElement, id: string) => root.querySelector<HTMLElement>(`[data-cell="${CSS.escape(id)}"]`);
/** Application-owned grid focus. Native editors retain their editing keys. */
export function syncGridFocus(root: HTMLTableElement, table: DeliveryTable) {
  const current = active(root.ownerDocument);
  let node: Node | null = current,
    currentCell: HTMLElement | undefined;
  while (node && node !== root) {
    if (node instanceof HTMLElement && (node.hasAttribute("data-cell") || node.hasAttribute("data-header"))) {
      currentCell = node;
      break;
    }
    node = (node as HTMLElement).assignedSlot ?? node.parentNode ?? (node.getRootNode() as ShadowRoot).host ?? null;
  }
  const focused = currentCell && root.contains(currentCell) ? currentCell : table.getFocusedCell() ? target(root, table.getFocusedCell()!.id) : undefined;
  const entry = focused ?? root.querySelector<HTMLElement>("tbody [data-cell]");
  for (const cell of root.querySelectorAll<HTMLElement>("[data-cell],[data-header]")) cell.tabIndex = cell === entry ? 0 : -1;
  for (const control of root.querySelectorAll<HTMLElement>("button,input,select,textarea,a[href],acme-button,acme-input,acme-checkbox")) control.tabIndex = -1;
}
export async function gridKey(event: KeyboardEvent, table: DeliveryTable, root: HTMLTableElement, reveal?: (rowId: string, columnId: string) => Promise<void>) {
  if (event.defaultPrevented) return;
  const origin = event.composedPath()[0] as HTMLElement,
    cell = event.composedPath().find((node) => node instanceof HTMLElement && (node.hasAttribute("data-cell") || node.hasAttribute("data-header"))) as HTMLElement | undefined;
  if (!cell) return;
  if (origin !== cell) {
    if (event.key === "Escape") {
      event.preventDefault();
      cell.focus();
      syncGridFocus(root, table);
    }
    return;
  }
  if (event.key === "Enter" || event.key === "F2") {
    const control = cell.querySelector<HTMLElement>(
      event.key === "F2" ? 'input,textarea,acme-input,button[aria-label^="Resize"],acme-button[aria-label^="Resize"]' : "button,input,acme-button,acme-input,acme-checkbox",
    );
    if (control) {
      event.preventDefault();
      control.focus();
    }
    return;
  }
  const directions: Record<string, "up" | "down" | "left" | "right"> = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: getComputedStyle(root).direction === "rtl" ? "right" : "left",
    ArrowRight: getComputedStyle(root).direction === "rtl" ? "left" : "right",
  };
  const direction = directions[event.key];
  if (!direction) return;
  event.preventDefault();
  const columnId = cell.dataset.column!;
  if (cell.dataset.header !== undefined) {
    if (direction === "down") {
      const row = table.getRowModel().rows[0];
      if (row) {
        await reveal?.(row.id, columnId);
        const first = row.getAllCells().find((cell) => cell.column.id === columnId);
        if (first) target(root, first.id)?.focus();
      }
    } else if (direction === "left" || direction === "right") {
      const headers = [...root.querySelectorAll<HTMLElement>('thead [data-header][data-leaf="true"]')],
        index = headers.indexOf(cell);
      headers[index + (direction === "left" ? -1 : 1)]?.focus();
    }
    syncGridFocus(root, table);
    return;
  }
  const rowId = cell.closest<HTMLElement>("[data-row]")!.dataset.row!,
    row = table.getRow(rowId),
    modelCell = row.getAllCells().find((item) => item.column.id === columnId)!;
  if (direction === "up" && table.getRowModel().rows[0]?.id === rowId) {
    root.querySelector<HTMLElement>(`thead [data-column="${CSS.escape(columnId)}"][data-leaf="true"]`)?.focus();
    syncGridFocus(root, table);
    return;
  }
  if (!modelCell.getCanSelect()) {
    const siblings = [...cell.parentElement!.querySelectorAll<HTMLElement>("[data-cell]")];
    siblings[siblings.indexOf(cell) + (direction === "left" ? -1 : 1)]?.focus();
    syncGridFocus(root, table);
    return;
  }
  if (table.getFocusedCell()?.id !== modelCell.id) table.setFocusedCell(rowId, columnId);
  if (event.shiftKey) table.extendCellSelection(direction);
  else table.moveCellSelection(direction);
  const next = table.getFocusedCell();
  if (next) {
    await reveal?.(next.row.id, next.column.id);
    target(root, next.id)?.focus();
  }
  syncGridFocus(root, table);
}
