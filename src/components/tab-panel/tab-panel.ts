import { OwnedContent } from "../../shared/owned-content";
import { createAtom } from "@tanstack/lit-store";
import { html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { StoreSelector } from "../../shared/store-connection";
import { TabConnection, type TabPart } from "../../shared/tab-parts";
import { tabPanelStructureCss } from "../../generated/components/tab-panel/tab-panel-structure.styles";
/** Content labelled by its owning tab. Ordinary children stay mounted; an inert template or renderContent supports controlled mounting.
 * @slot - Content, or one inert template for lazy/unmount behavior.
 * @csspart panel - The content container.
 */
export class AcmeTabPanel extends AcmeElement {
  static styles = [sharedCss, tabPanelStructureCss];
  @atomState() private key = "";
  /** Required nonempty matching tab key. @default "" */
  @property({ noAccessor: true }) get value() {
    return this.key;
  }
  set value(value: string) {
    if (typeof value !== "string") {
      throw new TypeError("Panel value must be a string");
    }
    const old = this.key;
    this.key = value;
    this.connection?.notify();
    this.connection?.owner?.synchronize();
    this.requestUpdate("value", old);
  }
  @atomState() private contentRenderer?: () => TemplateResult | typeof nothing;
  /** A pure Lit renderer, used when the default slot has no ordinary content or template. */
  @property({ noAccessor: true, attribute: false }) get renderContent() {
    return this.contentRenderer;
  }
  set renderContent(value: (() => TemplateResult | typeof nothing) | undefined) {
    if (value !== undefined && typeof value !== "function") {
      throw new TypeError("Panel renderContent must be a function or undefined");
    }
    const old = this.contentRenderer;
    this.contentRenderer = value;
    this.requestUpdate("renderContent", old);
  }
  @atomState() private mounted = false;
  @atomState() private visited = false;
  private readonly owned = new OwnedContent(this, { marker: "data-acme-panel-content", diagnostic: "panel-mounting-needs-template" });
  private readonly internals = this.attachInternals();
  private readonly member: TabPart = {
    host: this,
    kind: "panel",
    value: () => this.value,
    disabled: () => false,
    target: () => this,
    indicatorTarget: () => undefined,
    owner: () => this.connection.owner,
    connect: (owner) => {
      const previous = this.connection.owner;
      this.connection.setOwner(owner);
      if (!owner && previous?.state.get().unmountOnExit) {
        this.mounted = false;
      }
      this.synchronize();
    },
    synchronize: () => this.synchronize(),
  };
  private readonly connection = new TabConnection(this, this.member);
  private readonly display = createAtom(() => ({ owner: this.connection.owner, state: this.connection.owner?.state.get(), selected: this.connection.owner?.selected(this.member) ?? false }));
  private readonly updates = new StoreSelector(this, () => this.display);
  private synchronize() {
    const owner = this.connection?.owner,
      active = owner?.selected(this.member) ?? false;
    if (this.hidden === active) {
      this.hidden = !active;
    }
    if (this.inert === active) {
      this.inert = !active;
    }
    this.internals.role = "tabpanel";
    this.internals.ariaLabelledByElements = owner?.counterpart(this.member) ? [owner.counterpart(this.member)!.host] : [];
    if (active && !this.visited) {
      this.visited = true;
    }
    if (owner) {
      const state = owner.state.get();
      const mounted = active || (!state.unmountOnExit && (!state.lazyMount || this.visited));
      if (this.mounted !== mounted) {
        this.mounted = mounted;
      }
    }
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute("tabindex")) {
      this.tabIndex = 0;
    }
    this.synchronize();
  }
  protected updated() {
    this.synchronize();
    this.renderOwnedContent();
  }
  private renderOwnedContent() {
    const state = this.connection.owner?.state.get();
    this.owned.render(this.mounted, this.renderContent, !!(state?.lazyMount || state?.unmountOnExit));
  }
  render() {
    return html`<div part="panel"><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-tab-panel": AcmeTabPanel;
  }
}
