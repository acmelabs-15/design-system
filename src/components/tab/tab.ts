import { createAtom } from "@tanstack/lit-store";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { atomState } from "../../shared/atom-state";
import { StoreSelector } from "../../shared/store-connection";
import { TabConnection, type TabPart } from "../../shared/tab-parts";
import { GroupMemberController, groupMemberStyles } from "../../shared/group-member";
import { tabStructureCss } from "../../generated/components/tab/tab-structure.styles";
/** A native tab button owned by Tabs.
 * @slot - The visible text or icon content.
 * @slot start - Optional leading content.
 * @slot end - Optional trailing content.
 * @csspart root - The native button.
 * @csspart tab - The native button.
 * @csspart label - The indicator's content region.
 */
export class AcmeTab extends AcmeSemanticElement {
  static styles = [sharedCss, groupMemberStyles, tabStructureCss];
  static shadowRootOptions = { ...AcmeSemanticElement.shadowRootOptions, delegatesFocus: true };
  @atomState() private key = "";
  /** Required nonempty tab key. @default "" */
  @property({ noAccessor: true }) get value() {
    return this.key;
  }
  set value(value: string) {
    if (typeof value !== "string") throw new TypeError("Tab value must be a string");
    const old = this.key;
    this.key = value;
    this.connection?.notify();
    this.connection?.owner?.synchronize();
    this.requestUpdate("value", old);
  }
  @atomState() private unavailable = false;
  /** @default false */
  @property({ noAccessor: true, type: Boolean }) get disabled() {
    return this.unavailable;
  }
  set disabled(value: boolean) {
    const old = this.unavailable;
    this.unavailable = Boolean(value);
    this.connection?.owner?.synchronize();
    this.requestUpdate("disabled", old);
  }
  private get button() {
    return this.renderRoot?.querySelector<HTMLButtonElement>("button") ?? undefined;
  }
  private readonly member: TabPart = {
    host: this,
    kind: "tab",
    value: () => this.value,
    disabled: () => this.disabled,
    target: () => this.button,
    indicatorTarget: () => this.button?.querySelector("[part=label]") ?? undefined,
    owner: () => this.connection.owner,
    connect: (owner) => {
      this.connection.setOwner(owner);
      this.synchronize();
    },
    synchronize: () => this.synchronize(),
  };
  private readonly connection = new TabConnection(this, this.member);
  private readonly display = createAtom(() => ({ owner: this.connection.owner, state: this.connection.owner?.state.get(), selected: this.connection.owner?.selected(this.member) ?? false }));
  private readonly updates = new StoreSelector(this, () => this.display);
  private readonly group = new GroupMemberController(this, { surface: () => this.button });
  protected get semanticTarget() {
    return this.button;
  }
  protected get semanticDefaults() {
    const panel = this.connection.owner?.counterpart(this.member);
    return { role: "tab", controlsElements: panel ? [panel.host] : [] };
  }
  private get inactive() {
    return this.disabled || !this.value || !this.connection.owner || this.connection.owner.state.get().disabled;
  }
  private synchronize() {
    const button = this.button;
    if (!button) return;
    const owner = this.connection.owner;
    button.disabled = this.inactive;
    button.tabIndex = owner?.tabindex(this.member) ?? -1;
    button.setAttribute("aria-selected", String(owner?.selected(this.member) ?? false));
    button.setAttribute("data-variant", owner?.state.get().variant ?? "primary");
    button.toggleAttribute("data-selected", owner?.selected(this.member) ?? false);
    button.setAttribute("data-orientation", owner?.state.get().orientation ?? "horizontal");
    if (this.ariaControlsElements === null && this.getAttribute("aria-controls") === null) button.ariaControlsElements = owner?.counterpart(this.member) ? [owner.counterpart(this.member)!.host] : [];
  }
  private focused = () => this.connection.owner?.focus(this.member);
  private clicked = (event: MouseEvent) => {
    const owner = this.connection.owner;
    queueMicrotask(() => {
      if (!event.defaultPrevented && this.isConnected && owner === this.connection.owner && !this.inactive) owner?.select(this.member);
    });
  };
  constructor() {
    super();
    this.addEventListener("click", (event) => {
      if (event.composedPath()[0] === this) this.click();
    });
  }
  click() {
    if (!this.inactive) this.button?.click();
  }
  focus(options?: FocusOptions) {
    this.button?.focus(options);
  }
  protected updated() {
    this.synchronize();
  }
  render() {
    const owner = this.connection.owner,
      state = owner?.state.get(),
      selected = owner?.selected(this.member) ?? false;
    return html`<button type="button" class="tab" part="root tab" ?disabled=${this.inactive} tabindex=${owner?.tabindex(this.member) ?? -1} aria-selected=${String(selected)} ?data-selected=${selected} data-variant=${state?.variant ?? "primary"} data-orientation=${state?.orientation ?? "horizontal"} @focus=${this.focused} @click=${this.clicked}><span part="label"><slot name="start"></slot><slot></slot><slot name="end"></slot></span></button>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-tab": AcmeTab;
  }
}
