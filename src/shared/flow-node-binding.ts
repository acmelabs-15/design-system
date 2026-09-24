import type { FlowNode } from "./flow-data";
import type { FlowBounds } from "./flow-geometry";
export interface FlowNodePart {
  host: HTMLElement;
  id(): string;
  update(node: FlowNode | undefined, bounds: FlowBounds | undefined, activate: ((id: string) => void) | undefined): void;
}
const parts = new WeakMap<Element, FlowNodePart>();
export const flowNodePartFor = (element: Element) => parts.get(element);
export const registerFlowNodePart = (part: FlowNodePart) => parts.set(part.host, part);
