import "@acmelabs/design-system/define/table";
import { WorkerDeliveryLit } from "./worker-lit";

export function registerLitWorkerTableExample(): void {
  customElements.define("docs-table-worker-lit", WorkerDeliveryLit);
}
