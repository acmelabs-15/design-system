import { ContextProvider } from "@lit/context";
import { createAtom } from "@tanstack/lit-store";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { StoreSelector } from "../../shared/store-connection";
import { ComposedParticipants } from "../../shared/composed-participants";
import { isFocusable } from "tabbable";
import { accordionContext, accordionMemberFor, isAccordionBoundary, registerAccordionBoundary, type AccordionMember, type AccordionOwner } from "../../shared/disclosure";
import { accordionCss } from "../../generated/components/accordion/accordion.styles";
/** Coordinates related disclosure items without choosing their heading level.
 * @slot - Accordion Items and author-owned layout.
 * @csspart root - The item collection.
 * @fires {CustomEvent<{expanded:readonly string[]}>} acme-expanded-change - User expansion changes.
 */
export class AcmeAccordion extends AcmeElement {
  static styles = [sharedCss, accordionCss];
  @atomState() private values: readonly string[] = Object.freeze([]);
  /** Current item keys. Programmatic assignments stay silent. @default [] */
  @property({ noAccessor: true, attribute: false }) get expanded(): readonly string[] {
    return this.values;
  }
  set expanded(value: readonly string[] | undefined) {
    if (value !== undefined && (!Array.isArray(value) || [...value].some((key) => typeof key !== "string" || !key.trim()))) throw new TypeError("expanded requires nonempty string keys");
    const previous = this.values;
    this.values = Object.freeze([...new Set(value ?? [])]);
    this.requestUpdate("expanded", previous);
  }
  @atomState() @property({ noAccessor: true, type: Boolean }) multiple = false;
  @atomState() @property({ noAccessor: true, type: Boolean }) collapsible = false;
  @atomState() @property({ noAccessor: true, type: Boolean }) disabled = false;
  @atomState() @property({ noAccessor: true, type: Boolean, attribute: "lazy-mount" }) lazyMount = false;
  @atomState() @property({ noAccessor: true, type: Boolean, attribute: "unmount-on-exit" }) unmountOnExit = false;
  private readonly members = createAtom<readonly AccordionMember[]>([]);
  private readonly state = createAtom(() => ({
    expanded: this.expanded,
    multiple: this.multiple,
    collapsible: this.collapsible,
    disabled: this.disabled,
    lazyMount: this.lazyMount,
    unmountOnExit: this.unmountOnExit,
  }));
  private readonly owner: AccordionOwner = {
    state: this.state,
    valid: (member) => !!member.value().trim() && this.members.get().filter((item) => item.value() === member.value()).length === 1,
    register: (member) => {
      this.members.set((items) => [...items, member]);
      return () => this.members.set((items) => items.filter((item) => item !== member));
    },
    toggle: (member) => this.toggle(member),
    navigate: (member, event) => this.navigate(member, event),
  };
  private readonly provider = new ContextProvider(this, { context: accordionContext, initialValue: this.owner });
  private readonly projection = createAtom(() => this.members.get().map((member) => ({ member, value: member.value(), disabled: member.disabled() })));
  private readonly updates = new StoreSelector(this, () => this.projection);
  private readonly participants = new ComposedParticipants(this, {
    owner: this.owner,
    parts: () => this.members.get(),
    find: accordionMemberFor,
    boundary: isAccordionBoundary,
    slots: () => [...this.renderRoot.querySelectorAll("slot")],
  });
  private warned?: string;
  constructor() {
    super();
    registerAccordionBoundary(this);
  }
  private ordered() {
    return [...this.members.get()].sort((a, b) => (a.host.compareDocumentPosition(b.host) & Node.DOCUMENT_POSITION_PRECEDING ? 1 : -1));
  }
  private toggle(member: AccordionMember) {
    if (this.disabled || member.disabled() || !this.owner.valid(member)) return;
    const key = member.value(),
      open = this.expanded.includes(key);
    if (open && !this.multiple && !this.collapsible) return;
    this.expanded = open ? this.expanded.filter((value) => value !== key) : this.multiple ? [...this.expanded, key] : [key];
    this.dispatchEvent(new CustomEvent("acme-expanded-change", { bubbles: true, composed: true, detail: Object.freeze({ expanded: this.expanded }) }));
  }
  private navigate(member: AccordionMember, event: KeyboardEvent) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.isComposing || this.disabled) return;
    const entries = this.ordered().filter((item) => {
      const target = item.scope.counterpart("trigger")?.target();
      return this.owner.valid(item) && !item.disabled() && target && isFocusable(target, { getShadowRoot: true });
    });
    const index = entries.indexOf(member);
    if (index < 0) return;
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? entries.length - 1
          : event.key === "ArrowDown"
            ? (index + 1) % entries.length
            : event.key === "ArrowUp"
              ? (index + entries.length - 1) % entries.length
              : undefined;
    if (next !== undefined) {
      event.preventDefault();
      entries[next].scope.counterpart("trigger")!.target()!.focus();
    }
  }
  protected willUpdate() {
    const keys = this.members.get().map((member) => member.value());
    const invalid = keys.some((key) => !key.trim()) || new Set(keys).size !== keys.length;
    const signature = JSON.stringify(keys);
    if (invalid && this.warned !== signature) {
      this.warned = signature;
      console.warn(this.localName, { code: "accordion-values-must-be-unique" });
    }
    if (!invalid) this.warned = undefined;
  }
  render() {
    return html`<div part="root"><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-accordion": AcmeAccordion;
  }
}
