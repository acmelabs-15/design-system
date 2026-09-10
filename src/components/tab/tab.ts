import { css, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { Interaction } from "../../shared/interaction";
import { tabCss } from "./tab.styles";
import "../tooltip/tooltip";

/**
 * One tab of an `acme-tabs`: a 14px gray-900 button with a transparent 2px bottom border that
 * turns gray-1000 when selected (a 32px rounded pill with a gray-200 fill in a secondary row).
 * `value` names it; an `icon` slot goes before the title; `disabled` with a `tooltip` explains
 * the constraint (shown below). The selected tab is the tabbable one.
 */
@customElement("acme-tab")
export class AcmeTab extends AcmeElement {
  static styles = [
    sharedCss,
    tabCss,
    css`
      :host {
        display: inline-flex;
      }
      /* The shadow reset's svg rule, for the slotted icon (the reference's page reset blocks every svg). */
      .icon ::slotted(svg) {
        display: block;
        vertical-align: middle;
      }
    `,
  ];
  @property() value = "";
  @property({ type: Boolean, reflect: true }) selected = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  /** Shown below on hover; pairs with a disabled tab to say why. */
  @property() tooltip = "";
  /** Set by the row: every tab is disabled. */
  @property({ attribute: false }) groupDisabled = false;
  /** Set by the row: the secondary (pill) look. */
  @property({ attribute: false }) secondary = false;
  /** Set by the row: whether keyboard focus shows the ring (hidden after an arrow-key move). */
  @property({ attribute: false }) showFocusRing = true;
  @state() private hasIcon = false;
  @query(".tab") private button?: HTMLButtonElement;
  private uid = `tab-${Math.random().toString(36).slice(2, 8)}`;
  private interaction = new Interaction(this, { disabled: () => this.off });

  get off() {
    return this.disabled || this.groupDisabled;
  }

  connectedCallback() {
    super.connectedCallback();
    this.hasIcon = !!this.querySelector('[slot="icon"]');
  }

  firstUpdated() {
    this.hasIcon ||= !!this.querySelector('[slot="icon"]');
  }

  updated() {
    this.interaction.attach(this.button);
  }

  focus(options?: FocusOptions) {
    this.button?.focus(options);
  }

  private onIcon = (e: Event) => {
    this.hasIcon = (e.target as HTMLSlotElement).assignedElements().length > 0;
  };

  private pick = () => {
    if (!this.off) this.dispatchEvent(new CustomEvent("acme-tab-select", { detail: this, bubbles: true, composed: true }));
  };

  render() {
    const iconSlot = html`<slot name="icon" @slotchange=${this.onIcon}></slot>`;
    const btn = html`<button
      class=${this.cls("tab", { secondary: this.secondary })}
      role="tab"
      type="button"
      id=${this.uid}
      aria-selected=${this.selected ? "true" : "false"}
      tabindex=${this.selected ? 0 : -1}
      ?disabled=${this.off}
      data-show-focus-ring=${String(this.showFocusRing)}
      @focus=${this.pick}
      @click=${this.pick}
      part="tab"
    >${this.hasIcon ? html`<div class="icon">${iconSlot}</div>` : iconSlot}<slot></slot></button>`;
    return this.tooltip ? html`<acme-tooltip text=${this.tooltip} position="bottom">${btn}</acme-tooltip>` : btn;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-tab": AcmeTab;
  }
}
