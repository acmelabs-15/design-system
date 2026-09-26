import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { flowNodeCss } from "../../generated/components/flow-node/flow-node.styles";
import { atomState } from "../../shared/atom-state";
import type { FlowNode } from "../../shared/flow-data";
import type { FlowBounds } from "../../shared/flow-geometry";
import { registerFlowNodePart } from "../../shared/flow-node-binding";
/** Stable author-owned content in a diagram node.
 * @slot - Node content, including ordinary interactive controls.
 * @csspart node - Node surface.
 * @csspart label - Explicit node activation button.
 */
export class AcmeFlowNode extends AcmeElement {
  static styles = [sharedCss, flowNodeCss];
  @atomState() @property({ noAccessor: true, attribute: "node-id", reflect: true, useDefault: true }) nodeId = "";
  @atomState() private definition?: FlowNode;
  @atomState() private position?: FlowBounds;
  private activate?: (id: string) => void;
  constructor() {
    super();
    registerFlowNodePart({
      host: this,
      id: () => this.nodeId,
      update: (node, bounds, activate) => {
        this.definition = node;
        this.position = bounds;
        this.activate = activate;
      },
    });
  }
  protected updated() {
    const box = this.position,
      node = this.definition;
    this.toggleAttribute("data-flow-ready", !!box);
    this.toggleAttribute("data-flow-owned", !!node);
    for (const [name, value] of Object.entries({ x: box?.x, y: box?.y, width: node?.width, height: node?.height })) {
      if (value === undefined) {
        this.style.removeProperty("--_flow-" + name);
      } else {
        this.style.setProperty("--_flow-" + name, value + "px");
      }
    }
  }
  render() {
    return html`<article part="node"><button part="label" type="button" @click=${() => this.activate?.(this.nodeId)}>${this.definition?.label ?? this.nodeId}</button><slot></slot></article>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-flow-node": AcmeFlowNode;
  }
}
