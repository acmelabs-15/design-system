import {
  aggregationFns,
  type Cell,
  type Column,
  type ColumnDef,
  createExpandedRowModel,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  type Row,
  sortFns,
  stockFeatures,
  type Table,
  tableFeatures,
} from "@tanstack/table-core";
import { reviewFeature } from "./review-feature";
/** Comprehensive consumer fixture; production applications select only the features they use. */
export const features = tableFeatures({
  ...stockFeatures,
  reviewFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  groupedRowModel: createGroupedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  filterFns,
  sortFns,
  aggregationFns,
});
export type Delivery = { id: string; name: string; region: string; status: string; amount: number; details: string; subRows?: Delivery[] };
export const data: Delivery[] = Array.from({ length: 200 }, (_, i) => ({
  id: `delivery-${i}`,
  name: `Delivery ${String(i).padStart(3, "0")}`,
  region: i < 100 ? "West" : "East",
  status: i % 3 === 0 ? "Retry" : "Delivered",
  amount: i,
  details: "Delivery details ".repeat((i % 4) + 1),
  ...(i === 0 ? { subRows: [{ id: "child-0", name: "Child delivery", region: "West", status: "Delivered", amount: 5, details: "Nested details" }] } : {}),
}));
export const columns: Array<ColumnDef<typeof features, Delivery>> = [
  { id: "select", header: "Select", size: 64, enableSorting: false, enableColumnFilter: false, enableCellSelection: false },
  {
    id: "identity",
    header: "Identity",
    columns: [
      { accessorKey: "name", header: "Name", size: 220 },
      { accessorKey: "region", header: "Region", size: 120, spanRows: true },
    ],
  },
  {
    id: "delivery",
    header: "Delivery",
    columns: [
      { accessorKey: "status", header: "Status", size: 140, spanColumns: ({ row }) => (row.original.id === "delivery-2" ? 2 : 1) },
      { accessorKey: "amount", header: "Amount", size: 120, aggregationFn: "sum" },
      { accessorKey: "details", header: "Details", size: 340 },
    ],
  },
];
export type DeliveryTable = Table<typeof features, Delivery>;
export type DeliveryRow = Row<typeof features, Delivery>;
export type DeliveryCell = Cell<typeof features, Delivery>;
export function orderedColumns(table: DeliveryTable) {
  return [...table.getStartVisibleLeafColumns(), ...table.getCenterVisibleLeafColumns(), ...table.getEndVisibleLeafColumns()];
}
export function orderedCells(row: DeliveryRow) {
  return [...row.getStartVisibleCells(), ...row.getCenterVisibleCells(), ...row.getEndVisibleCells()];
}
export function headerRows(table: DeliveryTable) {
  const regions = [table.getStartHeaderGroups(), table.getCenterHeaderGroups(), table.getEndHeaderGroups()];
  const count = Math.max(...regions.map((groups) => groups.length));
  return Array.from({ length: count }, (_, i) => ({ id: String(i), headers: regions.flatMap((groups) => groups[i]?.headers ?? []) }));
}
export function columnStyle(column: Column<typeof features, Delivery>) {
  const pin = column.getIsPinned();
  return {
    "--acme-table-column-width": `${column.getSize()}px`,
    "--acme-table-sticky-inline-start": pin === "start" ? `${column.getStart("start")}px` : null,
    "--acme-table-sticky-inline-end": pin === "end" ? `${column.getAfter("end")}px` : null,
  };
}
