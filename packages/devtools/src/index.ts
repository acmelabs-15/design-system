import { metadata } from "./generated/metadata";
import { createInspector } from "./inspector";
import type { DiagnosticOptions } from "./diagnostics";
export type { DesignSystemInspector } from "./inspector";
export type { DiagnosticOptions as DesignSystemInspectorOptions } from "./diagnostics";
export function createDesignSystemInspector(options: DiagnosticOptions) {
  return createInspector(metadata, options);
}
