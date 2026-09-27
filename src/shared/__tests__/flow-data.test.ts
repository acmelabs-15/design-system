import { expect, test } from "bun:test";
import { flowNodes, flowEdges, validateFlowGraph } from "../flow-data";

test("flow snapshots own nested ports and reject ambiguous identities", () => {
  const input = [{ id: "a", label: "First", ports: [{ id: "out", side: "end" }] }];
  const nodes = flowNodes(input);
  input[0].ports[0].id = "changed";
  expect(nodes[0].ports?.[0].id).toBe("out");
  expect(() =>
    flowNodes([
      { id: "a", label: "One" },
      { id: "a", label: "Two" },
    ]),
  ).toThrow();
  expect(() => flowNodes([{ id: "a", label: "One", width: Infinity }])).toThrow();
});
test("edge references and declared ports are checked together at layout", () => {
  const nodes = flowNodes([
    { id: "a", label: "One", ports: [{ id: "out" }] },
    { id: "b", label: "Two" },
  ]);
  expect(() => validateFlowGraph(nodes, flowEdges([{ id: "e", source: "a", target: "b", sourcePort: "out" }]))).not.toThrow();
  expect(() => validateFlowGraph(nodes, flowEdges([{ id: "e", source: "a", target: "missing" }]))).toThrow();
  expect(() => validateFlowGraph(nodes, flowEdges([{ id: "e", source: "a", target: "b", sourcePort: "missing" }]))).toThrow();
});
