import { columnFilteringFeature, createFilteredRowModel, createSortedRowModel, filterFns, globalFilteringFeature, rowSortingFeature, sortFns, tableFeatures } from "@tanstack/table-core";
import { initTableWorker } from "@tanstack/table-core/experimental-worker-plugin";

// This application fixture deliberately exposes one reproducible failure for its recovery example.
self.addEventListener("message", (event) => {
  if (event.data?.demoCommand === "fail") throw new Error("Simulated table worker failure");
});
initTableWorker({
  features: tableFeatures({
    columnFilteringFeature,
    globalFilteringFeature,
    rowSortingFeature,
    filteredRowModel: createFilteredRowModel(),
    sortedRowModel: createSortedRowModel(),
    filterFns,
    sortFns,
  }),
  columns: [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "amount", header: "Amount" },
  ],
  getRowId: (row: { id: string }) => row.id,
});
