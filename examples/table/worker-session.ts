import { createAtom } from "@tanstack/store";
import { columnFilteringFeature, createSortedRowModel, filterFns, globalFilteringFeature, rowSortingFeature, sortFns, tableFeatures } from "@tanstack/table-core";
import { createTableWorker, createWorkerRowModel, workerRowModelsFeature } from "@tanstack/table-core/experimental-worker-plugin";

export type WorkerRow = { id: string; name: string; amount: number };
export const workerColumns = [
  { accessorKey: "name" as const, header: "Name" },
  { accessorKey: "amount" as const, header: "Amount" },
];
const initial: WorkerRow[] = Array.from({ length: 500 }, (_, i) => ({ id: "work-" + i, name: "Record " + String(i).padStart(3, "0"), amount: i }));
/** Application-owned experimental worker and recovery state. */
export function createWorkerSession() {
  const failed = createAtom(false),
    source = createAtom(initial),
    manual = createAtom(false),
    revision = createAtom(0);
  const workers = new Set<Worker>();
  const handle = createTableWorker({
    createWorker: () => {
      const worker = new Worker(new URL("./table-worker.js", import.meta.url), { type: "module" });
      workers.add(worker);
      const failure = (event: Event) => {
        workers.delete(worker);
        failed.set(true);
        event.preventDefault();
      };
      worker.addEventListener("error", failure);
      worker.addEventListener("messageerror", failure);
      return worker;
    },
  });
  const features = tableFeatures({
    columnFilteringFeature,
    globalFilteringFeature,
    rowSortingFeature,
    workerRowModelsFeature,
    filteredRowModel: createWorkerRowModel(handle, "filtered"),
    sortedRowModel: createSortedRowModel(),
    filterFns,
    sortFns,
  });
  const stop = () => {
    handle.terminate();
    workers.clear();
  };
  return {
    features,
    failed,
    source,
    manual,
    revision,
    get liveWorkers() {
      return workers.size;
    },
    options: () => ({ features, columns: workerColumns, data: source.get(), manualFiltering: manual.get(), manualSorting: manual.get(), getRowId: (row: WorkerRow) => row.id }),
    retry() {
      stop();
      failed.set(false);
      revision.set((value) => value + 1);
    },
    dispose: stop,
    simulateFailure() {
      for (const worker of workers) {
        worker.postMessage({ demoCommand: "fail" });
      }
    },
    useServerRows(rows: WorkerRow[]) {
      stop();
      failed.set(false);
      manual.set(true);
      source.set(rows);
      revision.set((value) => value + 1);
    },
  };
}
export type WorkerSession = ReturnType<typeof createWorkerSession>;
