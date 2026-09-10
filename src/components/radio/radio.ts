import { css, html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { Interaction } from "../../shared/interaction";
import { radioCss } from "./radio.styles";

/**
 * One choice of a set: a visually hidden radio, a 16px circle that fills with an 8px dot when
 * checked, and the text (13px). The root is a label when the element has text of its own, and a
 * plain span otherwise, so an outer label can wrap it. The root carries the interaction states
 * (data-hover, data-focus, data-active) and the own states (data-checked, data-disabled).
 * Form-associated and labelable; inside acme-radio-group the group sets its name, checked
 * state and Tab stop.
 */
@customElement("acme-radio")
export class AcmeRadio extends AcmeElement {
  static formAssociated = true;
  static styles = [
    sharedCss,
    radioCss,
    css`
      /* An inline flex box, as the root is: the host sits on the line the root would, and the root fills it. */
      :host {
        display: inline-flex;
      }
    `,
  ];
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) required = false;
  @property() name = "";
  @property() value = "";
  /** Accessible name for a radio with no visible text. */
  @property({ attribute: "aria-label" }) label = "";
  /** Set by the group: disabled through the group. */
  @property({ attribute: false }) groupDisabled = false;
  /** Set by the group: off the Tab sequence (roving tabindex); arrow keys reach it. */
  @property({ attribute: false }) skipTab = false;
  @atomState() private hasText = false;
  @query("input") input!: HTMLInputElement;
  @query(".radio") private root!: HTMLElement;
  private internals?: ElementInternals;
  private interaction = new Interaction(this, { disabled: () => this.off });
  constructor() {
    super();
    try {
      this.internals = this.attachInternals();
    } catch {}
    // A click on the host (an outer label sends one) selects; clicks inside the root reach the radio themselves.
    this.addEventListener("click", (e) => {
      if (!e.composedPath().includes(this.root)) this.select();
    });
  }
  get off() {
    return this.disabled || this.groupDisabled;
  }
  connectedCallback() {
    super.connectedCallback();
    this.hasText = !!this.textContent?.trim() || this.childElementCount > 0;
  }
  firstUpdated() {
    this.hasText ||= !!this.textContent?.trim() || this.childElementCount > 0;
  }
  focus() {
    this.input?.focus();
  }
  /** Checks this radio, unchecks the others of the same name, and dispatches `acme-change`. */
  select() {
    if (this.off) return;
    const was = this.checked;
    this.checked = true;
    if (this.name) for (const r of (this.getRootNode() as Document | ShadowRoot).querySelectorAll<AcmeRadio>(`acme-radio[name="${this.name}"]`)) if (r !== this) r.checked = false;
    if (!was) this.dispatchEvent(new CustomEvent("acme-change", { detail: { value: this.value }, bubbles: true, composed: true }));
  }
  updated(ch: Map<string, unknown>) {
    this.interaction.attach(this.root);
    if (ch.has("checked") || ch.has("value")) this.internals?.setFormValue?.(this.checked ? this.value : null);
  }
  private onSlot = (e: Event) => {
    this.hasText = (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).some((n) => n.nodeType === 1 || (n.textContent ?? "").trim());
  };
  render() {
    const off = this.off;
    // With text beside it, the control keeps a zero-width space so its line box matches the text's.
    const inner = html`<span class="control"
        >${this.hasText ? "\u200B" : nothing}<input
          type="radio"
          .checked=${this.checked}
          ?disabled=${off}
          ?required=${this.required}
          name=${this.name || nothing}
          value=${this.value}
          aria-label=${this.label || nothing}
          tabindex=${this.skipTab ? "-1" : nothing}
          @change=${() => this.select()}
        /><span class="dot" part="dot" aria-hidden="true"></span></span
      ><span class="text" ?hidden=${!this.hasText}><slot @slotchange=${this.onSlot}></slot></span>`;
    const attrs = { checked: this.checked ? "" : nothing, disabled: off ? "" : nothing };
    // Without text the root is a span, not a label, so a click on the dot selects through the handler.
    return this.hasText
      ? html`<label class="radio" data-checked=${attrs.checked} data-disabled=${attrs.disabled} part="radio">${inner}</label>`
      : html`<span class="radio" data-checked=${attrs.checked} data-disabled=${attrs.disabled} part="radio" @click=${() => !off && this.select()}>${inner}</span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-radio": AcmeRadio;
  }
}
