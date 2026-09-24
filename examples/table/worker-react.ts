import { Table } from "@acmelabs/design-system-react/components/table";
import { useSelector } from "@tanstack/react-store";
import { useTable } from "@tanstack/react-table";
import type { Table as TanStackTable } from "@tanstack/table-core";
import { createElement as h, useLayoutEffect } from "react";
import type { WorkerRow, WorkerSession } from "./worker-session";
export function WorkerDeliveryReact({ session, ready }: { session: WorkerSession; ready: (table: TanStackTable<WorkerSession["features"], WorkerRow>) => void }) {
  const failed = useSelector(session.failed);
  useSelector(session.source);
  useSelector(session.manual);
  useSelector(session.revision);
  const table = useTable(session.options());
  useLayoutEffect(() => {
    ready(table);
  });
  const rows = table.getRowModel().rows;
  return h(
    "div",
    null,
    h("p", { role: "status" }, failed ? "Worker failed" : table.state.workerRowModels.isPending ? "Worker pending" : "Worker ready"),
    h("output", { "data-count": "" }, rows.length),
    h(
      Table,
      { loading: table.state.workerRowModels.isPending, "aria-label": "Worker results" },
      h(
        "table",
        null,
        h("caption", null, "Application-owned worker processing"),
        h("thead", null, h("tr", null, h("th", { scope: "col" }, "Name"), h("th", { scope: "col" }, "Amount"))),
        h(
          "tbody",
          null,
          ...rows.slice(0, 20).map((row) => h("tr", { key: row.id, "data-row": row.id }, h("th", { scope: "row" }, String(row.getValue("name"))), h("td", null, String(row.getValue("amount"))))),
        ),
      ),
    ),
    h("button", { type: "button", onClick: () => session.retry() }, "Retry worker"),
  );
}
