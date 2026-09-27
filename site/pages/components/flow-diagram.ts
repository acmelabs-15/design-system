import type { Doc } from "../../site";

const nodes = JSON.stringify([
  { id: "idea", label: "Idea", width: 150 },
  {
    id: "review",
    label: "Review",
    width: 250,
    ports: [
      { id: "in", side: "start" },
      { id: "out", side: "end" },
      { id: "back", side: "top" },
    ],
  },
  {
    id: "draft",
    label: "Write specification",
    width: 250,
    ports: [
      { id: "in", side: "start" },
      { id: "out", side: "end" },
      { id: "back", side: "top" },
    ],
  },
  { id: "plan", label: "Plan", width: 150 },
]);
const edges = JSON.stringify([
  { id: "start", source: "idea", target: "review", targetPort: "in" },
  { id: "draft", source: "review", target: "draft", sourcePort: "out", targetPort: "in", label: "Confirmed intent" },
  { id: "back", source: "draft", target: "review", sourcePort: "back", targetPort: "back", label: "Refine and return" },
  { id: "done", source: "draft", target: "plan", sourcePort: "out", label: "Approved" },
]);
export const doc: Doc = {
  id: "flow-diagram",
  title: "Flow Diagram",
  lede: "A read-only diagram with automatic node placement, routed arrows and stable interactive node content.",
  tags: ["acme-flow-diagram", "acme-flow-node"],
  examples: [
    {
      h: "Workflow",
      p: "Drag the background to pan. Use the controls to fit or zoom. Ctrl or Command plus the wheel zooms around the pointer.",
      html: `<acme-flow-diagram nodes='${nodes}' edges='${edges}'><acme-flow-node node-id="review"><acme-text>Confirm the purpose and required outcome.</acme-text><acme-switch>Needs refinement</acme-switch></acme-flow-node><acme-flow-node node-id="draft"><acme-field><span slot="label">Specification title</span><acme-input value="Delivery dashboard"></acme-input></acme-field><acme-switch checked>Several capabilities</acme-switch></acme-flow-node></acme-flow-diagram><output aria-live="polite"></output>`,
      script:
        'root.querySelector("acme-flow-diagram").addEventListener("acme-request",event=>{if(event.detail.action==="node")root.querySelector("output").textContent="Requested node: "+event.detail.id;});',
    },
    { h: "Vertical layout", html: `<acme-flow-diagram direction="down" nodes='${nodes}' edges='${edges}'></acme-flow-diagram>` },
    {
      h: "Application data",
      p: "Replace the arrays when data changes. Label text is rendered as text. Flow Node content stays owned by its author.",
      html: "<acme-button>Add step</acme-button><acme-flow-diagram></acme-flow-diagram>",
      script:
        'const flow=root.querySelector("acme-flow-diagram");flow.nodes=[{id:"start",label:"Start"}];root.querySelector("acme-button").addEventListener("click",()=>{const id="step-"+flow.nodes.length,previous=flow.nodes.at(-1).id;flow.nodes=[...flow.nodes,{id,label:"Step "+flow.nodes.length}];flow.edges=[...flow.edges,{id,source:previous,target:id}];flow.layout().then(()=>flow.fit()).catch(()=>{});});',
    },
    { h: "Empty", html: "<acme-flow-diagram></acme-flow-diagram>" },
  ],
  practices: {
    Data: [
      "Nodes and edges require unique IDs. Every edge endpoint and optional port must exist. Port start and end sides follow text direction.",
      "Optional node width and height are positive diagram units. Without them, the viewer measures the rendered content. Fixed heights scroll overflowing node content.",
      "Layout can move other nodes when content changes. This viewer does not edit graphs, drag nodes, reconnect edges or run a workflow.",
    ],
    Accessibility: [
      "Node headings are explicit activation buttons. Other controls inside a node retain their own actions.",
      "Focus the canvas to pan with arrow keys, zoom with plus or minus, and fit with Home. View relationships provides the same node and connection information as a list.",
      "Provide visible context for the graph. Keep important information in node labels and relationship labels as well as custom content.",
    ],
    Delivery: [
      "ELK loads lazily in a separate worker. The normal browser distributions include its worker asset and license notices.",
      "If your application bundler does not copy the worker URL asset, serve the flow-worker.js package export and call configureFlowDiagram({workerUrl: ...}) before mounting diagrams.",
      "Cross-origin worker assets require CORS and a policy that permits blob workers. Same-origin delivery uses the worker URL directly. Failed worker loads emit acme-error and expose Retry.",
    ],
    Appearance: [
      "Use --acme-flow-height to set the canvas height. Nodes, connections and controls follow the active theme.",
      "Fit and zoom use the shared motion springs and respect reduced motion. Dragging follows the pointer immediately. Layout positions and their routes update together.",
    ],
  },
};
