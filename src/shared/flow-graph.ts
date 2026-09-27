import type { ElkNode } from "elkjs/lib/elk-api.js";
import { validateFlowGraph, type FlowNode, type FlowEdge } from "./flow-data";
import type { FlowBounds, FlowPoint } from "./flow-geometry";

export type FlowSize = Readonly<{ width: number; height: number }>;
export type FlowScene = Readonly<{
  width: number;
  height: number;
  nodes: ReadonlyMap<string, FlowBounds>;
  edges: readonly Readonly<{ id: string; source: string; target: string; sections: readonly (readonly FlowPoint[])[]; labels: readonly (FlowBounds & { text: string })[] }>[];
}>;
export function createFlowGraph(
  nodes: readonly FlowNode[],
  edges: readonly FlowEdge[],
  sizes: ReadonlyMap<string, FlowSize>,
  labels: ReadonlyMap<string, FlowSize>,
  direction: "right" | "down",
  rtl: boolean,
  spacing: { node: number; layer: number; edge: number; padding: number },
): ElkNode {
  validateFlowGraph(nodes, edges);
  const byId = new Map(nodes.map((node, index) => [node.id, index]));
  const endpoint = (nodeId: string, portId?: string) => {
    const index = byId.get(nodeId)!;
    return portId === undefined ? `n${index}` : `p${index}_${nodes[index].ports!.findIndex((port) => port.id === portId)}`;
  };
  return {
    id: "graph",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": direction === "right" ? "RIGHT" : "DOWN",
      "elk.edgeRouting": "ORTHOGONAL",
      "elk.layered.feedbackEdges": "true",
      "elk.spacing.nodeNode": String(spacing.node),
      "elk.layered.spacing.nodeNodeBetweenLayers": String(spacing.layer),
      "elk.spacing.edgeNode": String(spacing.edge),
      "elk.padding": `[top=${spacing.padding},left=${spacing.padding},bottom=${spacing.padding},right=${spacing.padding}]`,
    },
    children: nodes.map((node, index) => {
      const size = sizes.get(node.id);
      if (!size || !Number.isFinite(size.width) || !Number.isFinite(size.height) || size.width <= 0 || size.height <= 0) {
        throw new RangeError("Flow layout requires positive measured dimensions");
      }
      return {
        id: `n${index}`,
        width: size.width,
        height: size.height,
        layoutOptions: { "elk.portConstraints": "FIXED_SIDE", "elk.spacing.portsSurrounding": "[top=8,left=8,bottom=8,right=8]" },
        ports: node.ports?.map((port, portIndex) => {
          const incoming = edges.some((edge) => edge.target === node.id && edge.targetPort === port.id),
            outgoing = edges.some((edge) => edge.source === node.id && edge.sourcePort === port.id);
          const side =
            port.side === "top"
              ? "NORTH"
              : port.side === "bottom"
                ? "SOUTH"
                : port.side === "start"
                  ? rtl
                    ? "EAST"
                    : "WEST"
                  : port.side === "end"
                    ? rtl
                      ? "WEST"
                      : "EAST"
                    : direction === "down"
                      ? incoming && !outgoing
                        ? "NORTH"
                        : "SOUTH"
                      : incoming && !outgoing
                        ? "WEST"
                        : "EAST";
          return { id: `p${index}_${portIndex}`, width: 0, height: 0, layoutOptions: { "elk.port.side": side } };
        }),
      };
    }),
    edges: edges.map((edge, index) => {
      const size = labels.get(edge.id);
      return {
        id: `e${index}`,
        sources: [endpoint(edge.source, edge.sourcePort)],
        targets: [endpoint(edge.target, edge.targetPort)],
        labels: edge.label && size ? [{ text: edge.label, width: size.width, height: size.height }] : undefined,
      };
    }),
  };
}
function bounds(value: { x?: number; y?: number; width?: number; height?: number }): FlowBounds {
  const { x = 0, y = 0, width = 0, height = 0 } = value;
  if (![x, y, width, height].every(Number.isFinite) || width < 0 || height < 0) {
    throw new RangeError("ELK returned invalid bounds");
  }
  return Object.freeze({ x, y, width, height });
}
export function flowScene(graph: ElkNode, nodes: readonly FlowNode[], edges: readonly FlowEdge[]): FlowScene {
  const boxes = new Map<string, FlowBounds>();
  const children = new Map(graph.children?.map((child) => [child.id, child]));
  const routed = new Map(graph.edges?.map((edge) => [edge.id, edge]));
  for (const [index, node] of nodes.entries()) {
    const result = children.get(`n${index}`);
    if (!result || !result.width || !result.height) {
      throw new Error("ELK omitted valid node dimensions");
    }
    boxes.set(node.id, bounds(result));
  }
  const routes = edges.map((edge, index) => {
    const result = routed.get(`e${index}`);
    if (!result?.sections?.length) {
      throw new Error("ELK omitted an edge route");
    }
    const sections = result.sections.map((section) =>
      Object.freeze(
        [section.startPoint, ...(section.bendPoints ?? []), section.endPoint].map((point) => {
          if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
            throw new RangeError("ELK returned an invalid route");
          }
          return Object.freeze({ x: point.x, y: point.y });
        }),
      ),
    );
    for (const points of sections) {
      for (let i = 1; i < points.length; i++) {
        if (Math.abs(points[i].x - points[i - 1].x) > 1e-6 && Math.abs(points[i].y - points[i - 1].y) > 1e-6) {
          throw new Error("ELK returned a nonorthogonal route");
        }
      }
    }
    return Object.freeze({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sections: Object.freeze(sections),
      labels: Object.freeze((result.labels ?? []).map((label) => Object.freeze({ ...bounds(label), text: label.text ?? "" }))),
    });
  });
  const size = bounds(graph);
  return Object.freeze({ width: size.width, height: size.height, nodes: boxes, edges: Object.freeze(routes) });
}
