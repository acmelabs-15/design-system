import { TanStackStoreAtom } from "@tanstack/lit-store";
import { TableController } from "@tanstack/lit-table";
import { html, LitElement } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { createWorkerSession, type WorkerRow } from "./worker-session";

export class WorkerDeliveryLit extends LitElement {
  readonly session = createWorkerSession();
  private readonly failure = new TanStackStoreAtom(this, () => this.session.failed);
  private readonly source = new TanStackStoreAtom(this, () => this.session.source);
  private readonly manual = new TanStackStoreAtom(this, () => this.session.manual);
  private readonly revision = new TanStackStoreAtom(this, () => this.session.revision);
  private readonly controller = new TableController<typeof this.session.features, WorkerRow>(this);
  model?: ReturnType<typeof this.controller.table>;
  render() {
    const table = this.controller.table(this.session.options());
    this.model = table;
    const rows = table.getRowModel().rows;
    return html`<p role="status">${this.session.failed.get() ? "Worker failed" : table.state.workerRowModels.isPending ? "Worker pending" : "Worker ready"}</p><output data-count>${rows.length}</output><acme-table .loading=${table.state.workerRowModels.isPending} aria-label="Worker results"><table><caption>Application-owned worker processing</caption><thead><tr><th scope="col">Name</th><th scope="col">Amount</th></tr></thead><tbody>${repeat(
      rows.slice(0, 20),
      (row) => row.id,
      (row) => html`<tr data-row=${row.id}><th scope="row">${row.getValue("name")}</th><td>${row.getValue("amount")}</td></tr>`,
    )}</tbody></table></acme-table><button type="button" @click=${() => this.session.retry()}>Retry worker</button>`;
  }
  disconnectedCallback() {
    this.session.dispose();
    super.disconnectedCallback();
  }
}
