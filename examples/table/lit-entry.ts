import "./definitions";
import { DeliveryTableLit } from "./lit";

export function registerLitTableExample(): void {
  customElements.define("docs-table-lit", DeliveryTableLit);
}
