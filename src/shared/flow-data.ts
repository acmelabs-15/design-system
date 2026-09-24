import { isPlainRecord } from "./plain-record";
export type FlowPort = Readonly<{ id: string; side?: "start" | "end" | "top" | "bottom" }>;
export type FlowNode = Readonly<{ id: string; label: string; ports?: readonly FlowPort[]; width?: number; height?: number }>;
export type FlowEdge = Readonly<{ id: string; source: string; target: string; sourcePort?: string; targetPort?: string; label?: string }>;
function data(value: unknown, fields: readonly string[]): Record<string, unknown> {
  if (!isPlainRecord(value)) throw new TypeError("Flow data requires plain records");
  for (const key of Reflect.ownKeys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key)!;
    if (typeof key !== "string" || !fields.includes(key) || !descriptor.enumerable || !("value" in descriptor)) throw new TypeError("Flow records require supported data properties");
  }
  return value;
}
const identity = (value: unknown): value is string => typeof value === "string" && !!value.trim();
function records(value: unknown): unknown[] {
  if (value == null) return [];
  if (!Array.isArray(value)) throw new TypeError("Flow data requires an array");
  return value;
}
export function flowNodes(value: unknown): readonly FlowNode[] {
  const ids = new Set<string>();
  return Object.freeze(
    records(value).map((item) => {
      const node = data(item, ["id", "label", "ports", "width", "height"]);
      if (!identity(node.id) || ids.has(node.id) || !identity(node.label)) throw new TypeError("Flow nodes require unique IDs and readable labels");
      ids.add(node.id);
      for (const field of ["width", "height"])
        if (node[field] !== undefined && (typeof node[field] !== "number" || !Number.isFinite(node[field]) || (node[field] as number) <= 0))
          throw new RangeError("Flow node dimensions must be positive and finite");
      const ports = new Set<string>();
      const owned =
        node.ports === undefined
          ? undefined
          : Object.freeze(
              records(node.ports).map((item) => {
                const port = data(item, ["id", "side"]);
                if (!identity(port.id) || ports.has(port.id) || (port.side !== undefined && !["start", "end", "top", "bottom"].includes(String(port.side))))
                  throw new TypeError("Flow ports require unique IDs and supported sides");
                ports.add(port.id);
                return Object.freeze({ id: port.id, side: port.side as FlowPort["side"] });
              }),
            );
      return Object.freeze({ id: node.id, label: node.label, ports: owned, width: node.width as number | undefined, height: node.height as number | undefined });
    }),
  );
}
export function flowEdges(value: unknown): readonly FlowEdge[] {
  const ids = new Set<string>();
  return Object.freeze(
    records(value).map((item) => {
      const edge = data(item, ["id", "source", "target", "sourcePort", "targetPort", "label"]);
      if (!identity(edge.id) || ids.has(edge.id) || !identity(edge.source) || !identity(edge.target)) throw new TypeError("Flow edges require unique IDs and endpoint IDs");
      ids.add(edge.id);
      for (const field of ["sourcePort", "targetPort"]) if (edge[field] !== undefined && !identity(edge[field])) throw new TypeError("Flow port references require IDs");
      if (edge.label !== undefined && typeof edge.label !== "string") throw new TypeError("Flow edge labels require text");
      return Object.freeze({ ...edge }) as FlowEdge;
    }),
  );
}
export function validateFlowGraph(nodes: readonly FlowNode[], edges: readonly FlowEdge[]): void {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  for (const edge of edges) {
    const source = byId.get(edge.source),
      target = byId.get(edge.target);
    if (!source || !target) throw new TypeError(`Unknown endpoint for edge ${edge.id}`);
    for (const [node, port] of [
      [source, edge.sourcePort],
      [target, edge.targetPort],
    ] as const)
      if (port !== undefined && !node.ports?.some((item) => item.id === port)) throw new TypeError(`Unknown port for edge ${edge.id}`);
  }
}
