import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { treeItemCss } from "../../generated/components/tree-item/tree-item.styles";
import { atomState } from "../../shared/atom-state";
import { Places } from "../../shared/places";
import { TreeBinding } from "../../shared/tree-context";
/** Optional rich content for a data node, keyed by its identifier.
 * @slot - Visible label content; omission uses the node label.
 * @slot start - Decorative leading content.
 * @slot end - Supporting content.
 * @slot description - Supporting description.
 * @csspart root - Content layout.
 * @csspart start - Leading content.
 * @csspart label - Visible label.
 * @csspart description - Supporting description.
 * @csspart end - Trailing content.
 */
export class AcmeTreeItem extends AcmeElement {
  static styles = [sharedCss, treeItemCss];
  @atomState() @property({ useDefault: true, noAccessor: true }) value = "";
  @atomState() @property({ noAccessor: true, type: Boolean }) disabled = false;
  private readonly places = new Places(this, { places: ["start", "end", "description"] });
  private readonly binding = new TreeBinding(this, { value: () => this.value, disabled: () => this.disabled });
  get expanded(): boolean {
    return !!this.binding.current?.state.get().expanded.includes(this.value);
  }
  get selected(): boolean {
    const state = this.binding.current?.state.get();
    return state?.selection === "single" && state.value === this.value;
  }
  render() {
    const node = this.binding.current?.state.get().entries.find((entry) => entry.node.id === this.value)?.node;
    return html`<span part="root"><span part="start" aria-hidden="true" ?hidden=${!this.places.has("start")}><slot name="start"></slot></span><span class="text"><span part="label"><slot>${node?.label}</slot></span><span part="description" ?hidden=${!this.places.has("description")}><slot name="description"></slot></span></span><span part="end" ?hidden=${!this.places.has("end")}><slot name="end"></slot></span></span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-tree-item": AcmeTreeItem;
  }
}
