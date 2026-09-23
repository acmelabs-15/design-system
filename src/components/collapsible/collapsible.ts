import { ContextProvider } from "@lit/context";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { disclosureContext, DisclosureScope } from "../../shared/disclosure";
import { collapsibleCss } from "../../generated/components/collapsible/collapsible.styles";
/** One independently expandable section.
 * @slot - Collapsible Trigger and Collapsible Content.
 * @csspart root - The section wrapper.
 * @fires {CustomEvent<{expanded:boolean}>} acme-expanded-change - User expansion changes.
 */
export class AcmeCollapsible extends AcmeElement {
  static styles = [sharedCss, collapsibleCss];
  @atomState() @property({ noAccessor: true, type: Boolean, reflect: true }) expanded = false;
  @atomState() @property({ noAccessor: true, type: Boolean }) disabled = false;
  @atomState() @property({ noAccessor: true, type: Boolean, attribute: "lazy-mount" }) lazyMount = false;
  @atomState() @property({ noAccessor: true, type: Boolean, attribute: "unmount-on-exit" }) unmountOnExit = false;
  private readonly scope = new DisclosureScope(
    this,
    () => ({ expanded: this.expanded, disabled: this.disabled, canCollapse: true, lazyMount: this.lazyMount, unmountOnExit: this.unmountOnExit }),
    () => {
      this.expanded = !this.expanded;
      this.dispatchEvent(new CustomEvent("acme-expanded-change", { bubbles: true, composed: true, detail: Object.freeze({ expanded: this.expanded }) }));
    },
  );
  private readonly provider = new ContextProvider(this, { context: disclosureContext, initialValue: this.scope });
  render() {
    return html`<div part="root"><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-collapsible": AcmeCollapsible;
  }
}
