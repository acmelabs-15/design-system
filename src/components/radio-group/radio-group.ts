import { css, html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import type { AcmeRadio } from "../radio/radio";
import { radioGroupCss } from "./radio-group.styles";

/**
 * A group of acme-radio items with one value: a radiogroup that names itself through `label`
 * (read to screen readers, not shown) or `aria-label`. Arrow keys move the selection and skip
 * disabled items, Tab leaves the group; `disabled` reaches every item; `required` reports
 * through the form. Slot: default.
 */
@customElement("acme-radio-group")
export class AcmeRadioGroup extends AcmeElement {
  static formAssociated = true;
  static styles = [
    sharedCss,
    radioGroupCss,
    css`
      /* A block box, as the root is: the group fills it. */
      :host {
        display: block;
      }
    `,
  ];
  /** The group's name for assistive technology; not shown. */
  @property() label = "";
  /** Accessible name when there is no label. */
  @property({ attribute: "aria-label" }) hiddenLabel = "";
  /** The selected radio's value. */
  @property() value = "";
  /** Shared input name; generated when unset. */
  @property() name = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) required = false;
  @query(".radio-group") group!: HTMLElement;
  private internals?: ElementInternals;
  private uid = `radio-${Math.random().toString(36).slice(2, 8)}`;
  constructor() {
    super();
    try {
      this.internals = this.attachInternals();
    } catch {}
    this.addEventListener("acme-change", this.onChange);
    this.addEventListener("keydown", this.onKey);
  }
  get radios(): AcmeRadio[] {
    return Array.from(this.querySelectorAll<AcmeRadio>("acme-radio"));
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.name) this.name = `rg-${Math.random().toString(36).slice(2, 8)}`;
  }
  private onChange = (e: Event) => {
    const r = e.target as AcmeRadio;
    if (r === (this as unknown) || r.localName !== "acme-radio") return;
    e.stopImmediatePropagation();
    this.value = r.value;
    this.dispatchEvent(new CustomEvent("acme-change", { detail: { value: this.value }, bubbles: true, composed: true }));
  };
  private onKey = (e: KeyboardEvent) => {
    const d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    const live = this.radios.filter((r) => !r.off);
    const cur = live.indexOf(e.target as AcmeRadio);
    if (cur < 0 || live.length < 2) return;
    e.preventDefault();
    const next = live[(cur + d + live.length) % live.length];
    next.select();
    next.focus();
  };
  /** Pushes the group state to every radio: name, checked, disabled, required, and the one Tab stop. */
  private sync() {
    const rs = this.radios;
    if (!this.value) this.value = rs.find((r) => r.checked)?.value ?? "";
    const stop = rs.find((r) => r.value === this.value && !r.off) ?? rs.find((r) => !r.off);
    for (const r of rs) {
      r.name = this.name;
      r.groupDisabled = this.disabled;
      r.required = this.required;
      r.checked = !!this.value && r.value === this.value;
      r.skipTab = r !== stop;
    }
    this.internals?.setFormValue?.(this.value || null);
    if (this.internals?.setValidity) {
      if (this.required && !this.value) this.internals.setValidity({ valueMissing: true }, "Please select an option.", this.group);
      else this.internals.setValidity({});
    }
  }
  updated() {
    this.sync();
  }
  render() {
    return html`<div class="radio-group" role="radiogroup" aria-labelledby=${this.label ? this.uid : nothing} aria-label=${this.hiddenLabel || nothing} part="group">${this.label ? html`<span class="sr" id=${this.uid}>${this.label}</span>` : nothing}<slot @slotchange=${() => this.sync()}></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-radio-group": AcmeRadioGroup;
  }
}
