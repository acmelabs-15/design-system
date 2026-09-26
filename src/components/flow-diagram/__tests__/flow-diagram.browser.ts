const fixture = window as typeof window & { flow: AcmeFlowDiagram; configureFlowDiagram: typeof configureFlowDiagram; changes: unknown[]; requests: unknown[]; failures: unknown[]; inside: number };
import { AcmeFlowDiagram } from "../../../components/flow-diagram/flow-diagram";
import { AcmeFlowNode } from "../../../components/flow-node/flow-node";
import { AcmeButton } from "../../../components/button/button";
import { AcmeSpinner } from "../../../components/spinner/spinner";
import { AcmeCollapsible } from "../../../components/collapsible/collapsible";
import { AcmeCollapsibleTrigger } from "../../../components/collapsible-trigger/collapsible-trigger";
import { AcmeCollapsibleContent } from "../../../components/collapsible-content/collapsible-content";
import { AcmeChevronRightIcon } from "../../../generated/icons/classes/chevron-right-icon";
import { configureFlowDiagram } from "../../../shared/flow-configuration";

customElements.define("acme-flow-diagram", AcmeFlowDiagram);
customElements.define("acme-flow-node", AcmeFlowNode);
customElements.define("acme-button", AcmeButton);
customElements.define("acme-spinner", AcmeSpinner);
customElements.define("acme-collapsible", AcmeCollapsible);
customElements.define("acme-collapsible-trigger", AcmeCollapsibleTrigger);
customElements.define("acme-collapsible-content", AcmeCollapsibleContent);
customElements.define("acme-chevron-right-icon", AcmeChevronRightIcon);
configureFlowDiagram({ workerUrl: "/elk-worker.js" });
fixture.configureFlowDiagram = configureFlowDiagram;
document.body.innerHTML =
  '<acme-flow-diagram id="flow"><acme-flow-node node-id="n1"><label>Draft <input id="draft" value="Keep me"></label><button id="inside">Inside action</button></acme-flow-node></acme-flow-diagram>';
const flow = document.querySelector<AcmeFlowDiagram>("#flow")!;
fixture.flow = flow;
flow.nodes = Array.from({ length: 6 }, (_, i) => ({
  id: "n" + i,
  label: "Step " + i,
  ports: [
    { id: "in", side: "start" },
    { id: "out", side: "end" },
    { id: "return", side: "top" },
  ],
}));
flow.edges = flow.nodes.slice(1).map((node, i) => ({ id: "e" + i, source: "n" + i, target: node.id, sourcePort: "out", targetPort: "in", label: "Next" }));
flow.edges = [...flow.edges, { id: "return", source: "n3", target: "n1", sourcePort: "return", targetPort: "return", label: "Refine and return" }];
fixture.changes = [];
fixture.requests = [];
fixture.failures = [];
flow.addEventListener("acme-change", (e) => fixture.changes.push((e as CustomEvent<unknown>).detail));
flow.addEventListener("acme-request", (e) => fixture.requests.push((e as CustomEvent<unknown>).detail));
flow.addEventListener("acme-error", (e) => fixture.failures.push((e as CustomEvent<unknown>).detail));
fixture.inside = 0;
document.querySelector<HTMLButtonElement>("#inside")!.addEventListener("click", () => fixture.inside++);
