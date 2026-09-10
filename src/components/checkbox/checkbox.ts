import { css, html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { Interaction } from "../../shared/interaction";
import { checkboxCss } from "./checkbox.styles";

/**
 * A control that switches between checked and unchecked. A label root wraps a visually hidden
 * checkbox, a 16px box that draws the check (or the dash while `indeterminate`), and the text
 * (13px). The root carries the interaction states (data-hover, data-focus, data-active) and the
 * own states (data-checked, data-disabled, data-indeterminate). Form-associated and labelable:
 * an outer label toggles it, and the form receives `value` while checked. `indeterminate` is
 * visual only and clears on the next change.
 */
@customElement("acme-checkbox")
export class AcmeCheckbox extends AcmeElement {
  static formAssociated = true;
  static styles = [
    sharedCss,
    checkboxCss,
    css`
      /* An inline flex box, as the root is: the host sits on the line the root would, and the root fills it. */
      :host {
        display: inline-flex;
      }
    `,
  ];
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) indeterminate = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property() name = "";
  @property() value = "on";
  /** Accessible name when there is no visible text. */
  @property({ attribute: "aria-label" }) label = "";
  @query(".checkbox") private root!: HTMLElement;
  @query("input") private input!: HTMLInputElement;
  /** Text beside the box: only then the control keeps a zero-width space and the text span renders. */
  @atomState() private hasText = false;
  /** A composer that handles the keyboard itself (a multi-select row) takes the box out of the tab order. */
  @property({ attribute: false }) skipTab = false;
  private internals?: ElementInternals;
  private interaction = new Interaction(this, { disabled: () => this.disabled });
  constructor() {
    super();
    try {
      this.internals = this.attachInternals();
    } catch {}
    // A click sent to the host itself (an outer label) toggles the checkbox; clicks inside the root already reach it.
    this.addEventListener("click", (e) => {
      if (!e.composedPath().includes(this.root) && !this.disabled) this.input?.click();
    });
  }
  focus() {
    this.input?.focus();
  }
  updated(ch: Map<string, unknown>) {
    this.interaction.attach(this.root);
    if (ch.has("checked") || ch.has("value")) this.internals?.setFormValue?.(this.checked ? this.value : null);
  }
  formResetCallback() {
    this.checked = this.hasAttribute("checked");
  }
  private onChange = (e: Event) => {
    this.checked = (e.target as HTMLInputElement).checked;
    this.indeterminate = false;
    this.dispatchEvent(new CustomEvent("acme-change", { detail: { checked: this.checked }, bubbles: true, composed: true }));
  };
  render() {
    return html`<label
      class="checkbox"
      data-checked=${this.checked ? "" : nothing}
      data-disabled=${this.disabled ? "" : nothing}
      data-indeterminate=${this.indeterminate ? "" : nothing}
      part="checkbox"
      ><span class="control"
        >${this.hasText ? "\u200B" : nothing}<input
          type="checkbox"
          .checked=${this.checked}
          .indeterminate=${this.indeterminate}
          ?disabled=${this.disabled}
          name=${this.name || nothing}
          value=${this.value}
          aria-label=${this.label || nothing}
          tabindex=${this.skipTab ? "-1" : nothing}
          @change=${this.onChange}
        /><span class="box" part="box" aria-hidden="true"
          ><svg fill="none" height="16" viewBox="0 0 20 20" width="16">
            <path d="M14 7L8.5 12.5L6 10" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
            <line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="5" x2="15" y1="10" y2="10"></line></svg
        ></span></span
      ><span class="text" ?hidden=${!this.hasText}><slot @slotchange=${this.onSlot}></slot></span></label
    >`;
  }
  connectedCallback() {
    super.connectedCallback();
    this.hasText = !!this.textContent?.trim() || this.childElementCount > 0;
  }
  firstUpdated() {
    this.hasText ||= !!this.textContent?.trim() || this.childElementCount > 0;
  }
  private onSlot = (e: Event) => {
    this.hasText = (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).some((n) => n.nodeType === 1 || (n.textContent ?? "").trim());
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-checkbox": AcmeCheckbox;
  }
}
