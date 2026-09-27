import { registerLitTableExample } from "./lit-entry";
import { registerReactTableExample } from "./react-entry";
import { registerLitVirtualTableExample } from "./virtual-lit-entry";
import { registerLitWorkerTableExample } from "./worker-lit-entry";
import { registerReactWorkerTableExample } from "./worker-react-entry";

export function registerTableExamples(): void {
  registerLitTableExample();
  registerReactTableExample();
  registerLitVirtualTableExample();
  registerLitWorkerTableExample();
  registerReactWorkerTableExample();
}
