import { ContextConsumer, ContextProvider } from "@lit/context";
import { createAtom } from "@tanstack/lit-store";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { StoreSelector } from "../../shared/store-connection";
import { accordionContext, disclosureContext, DisclosureScope, registerAccordionMember, type AccordionOwner, type AccordionMember } from "../../shared/disclosure";
import { accordionItemCss } from "../../generated/components/accordion-item/accordion-item.styles";
/** One keyed section, with an author-chosen heading around its trigger.
 * @slot - Heading, Accordion Trigger and Accordion Content.
 * @csspart item - The section wrapper.
 */
export class AcmeAccordionItem extends AcmeElement {
  static styles = [sharedCss, accordionItemCss];
  @atomState() private key = "";
  @property({ noAccessor: true, useDefault: true }) get value(): string {
    return this.key;
  }
  set value(value: string) {
    if (typeof value !== "string") throw new TypeError("value must be a string");
    const previous = this.key;
    this.key = value;
    this.requestUpdate("value", previous);
  }
  @atomState() @property({ noAccessor: true, type: Boolean }) disabled = false;
  private readonly parent = createAtom<{ owner?: AccordionOwner }>({});
  private release?: () => void;
  private readonly scope = new DisclosureScope(
    this,
    () => {
      const owner = this.parent.get().owner;
      const state = owner?.state.get();
      const valid = !!owner?.valid(this.member);
      return {
        expanded: valid && !!state?.expanded.includes(this.value),
        disabled: !valid || !state || state.disabled || this.disabled,
        canCollapse: !!state && (state.multiple || state.collapsible),
        lazyMount: !!state?.lazyMount,
        unmountOnExit: !!state?.unmountOnExit,
      };
    },
    () => this.parent.get().owner?.toggle(this.member),
    (_part, event) => this.parent.get().owner?.navigate(this.member, event),
  );
  private readonly member: AccordionMember = {
    host: this,
    value: () => this.value,
    disabled: () => this.disabled,
    scope: this.scope,
    currentOwner: () => this.parent.get().owner,
    reconnect: () => this.reconnect(),
  };
  private readonly consumer = new ContextConsumer(this, {
    context: accordionContext,
    subscribe: true,
    callback: (owner) => {
      if (this.parent.get().owner === owner) return;
      this.release?.();
      this.parent.set({ owner });
      this.release = owner.register(this.member);
    },
  });
  private readonly provider = new ContextProvider(this, { context: disclosureContext, initialValue: this.scope });
  private readonly updates = new StoreSelector(this, () => this.scope.state);
  constructor() {
    super();
    registerAccordionMember(this.member);
  }
  private reconnect() {
    this.release?.();
    this.release = undefined;
    this.parent.set({});
    this.consumer.hostDisconnected();
    this.consumer.value = undefined;
    if (this.isConnected) this.consumer.hostConnected();
  }
  disconnectedCallback() {
    this.release?.();
    this.release = undefined;
    this.parent.set({});
    this.consumer.value = undefined;
    super.disconnectedCallback();
  }
  render() {
    return html`<div part="item" ?data-expanded=${this.scope.state.get().expanded}><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-accordion-item": AcmeAccordionItem;
  }
}
