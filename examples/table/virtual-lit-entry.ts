import "@acmelabs/design-system/define/table";
import "@acmelabs/design-system/define/button";
import "@acmelabs/design-system/define/h-stack";
import { VirtualDeliveryLit } from "./virtual-lit";

export function registerLitVirtualTableExample(): void {
  customElements.define("docs-table-virtual", VirtualDeliveryLit);
}
