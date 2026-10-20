import { createAtom } from "@tanstack/lit-store";
import { isPlainRecord } from "./plain-record";

export type FlowDiagramConfiguration = Readonly<{ workerUrl?: string | URL }>;
const configuration = createAtom<Readonly<{ workerUrl?: string }>>(Object.freeze({}));
export const flowDiagramConfiguration = createAtom(() => configuration.get());
/** Supplies the deployed worker asset when an application bundler uses a custom asset location. */
export function configureFlowDiagram(value: FlowDiagramConfiguration): void {
  if (!isPlainRecord(value) || Object.keys(value).some((key) => key !== "workerUrl")) {
    throw new TypeError("Invalid Flow Diagram configuration");
  }
  const url = value.workerUrl;
  if (url !== undefined && !(typeof url === "string" && url.trim()) && !(url instanceof URL)) {
    throw new TypeError("Flow worker URL requires a URL or nonempty string");
  }
  configuration.set(Object.freeze(url === undefined ? {} : { workerUrl: String(url) }));
}
