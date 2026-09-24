import { test, expect } from "bun:test";
import { createFlowGraph, flowScene } from "../flow-graph";
import { flowNodes, flowEdges } from "../flow-data";
const nodes = flowNodes([
  { id: "graph", label: "Root", ports: [{ id: "n1", side: "start" }] },
  { id: "e0", label: "Target" },
]);
const edges = flowEdges([{ id: "graph", source: "graph", target: "e0", sourcePort: "n1" }]);
const sizes = new Map(nodes.map((node) => [node.id, { width: 140, height: 60 }]));
test("graph identities are isolated from engine and port namespaces", () => {
  const graph = createFlowGraph(nodes, edges, sizes, new Map(), "right", true, { node: 40, layer: 60, edge: 14, padding: 20 });
  expect(graph.children?.map((node) => node.id)).toEqual(["n0", "n1"]);
  expect(graph.children?.[0].ports?.[0].layoutOptions?.["elk.port.side"]).toBe("EAST");
  expect(graph.edges?.[0].sources).toEqual(["p0_0"]);
  expect(graph.edges?.[0].targets).toEqual(["n1"]);
});
test("scene rejects missing nodes and nonorthogonal output instead of drawing corrupt geometry", () => {
  expect(() => flowScene({ id: "graph" }, nodes, edges)).toThrow();
  expect(() =>
    flowScene(
      {
        id: "graph",
        width: 300,
        height: 100,
        children: [
          { id: "n0", width: 140, height: 60 },
          { id: "n1", width: 140, height: 60 },
        ],
        edges: [{ id: "e0", sources: ["n0"], targets: ["n1"], sections: [{ id: "s", startPoint: { x: 0, y: 0 }, endPoint: { x: 10, y: 10 } }] }],
      },
      nodes,
      edges,
    ),
  ).toThrow("nonorthogonal");
});
