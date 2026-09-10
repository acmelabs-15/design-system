import { css, html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { RovingTabindex } from "../../shared/roving-tabindex";
import type { AcmeChoiceboxItem } from "../choicebox-item/choicebox-item";
import { labelCss } from "../label/label.styles";
import { choiceboxCss } from "./choicebox.styles";

let uid = 0;

/**
 * A group of acme-choicebox-item tiles with one value: a larger form of a radio group
 * (`type="radio"`, single-select: arrow keys move the choice, one tile is the Tab stop) or of a
 * set of checkboxes (`type="checkbox"`, multi-select: Space toggles a tile, `value` is a list).
 * A radiogroup or group that names itself through `label`, read to screen readers, or shown
 * above the list with `show-label` (a 13px label, as written); `disabled` reaches every tile;
 * `required` reports through the form. The list is a flex row of equal tiles, 12px apart
 * (`part="list"` to lay it out otherwise); `control-position` puts every tile's control at its
 * start. Form-associated: the chosen value(s) submit under `name`. Fires `acme-change` with
 * `{ value }`. Slot: default (acme-choicebox-item elements).
 */
@customElement("acme-choicebox")
export class AcmeChoicebox extends AcmeElement {
  static formAssociated = true;
  static styles = [
    sharedCss,
    labelCss,
    choiceboxCss,
    css`
      /* A block box, as the root is: the group fills it. */
      :host {
        display: block;
      }
    `,
  ];
  /** radio (single-select) or checkbox (multi-select). */
  @property() type: "radio" | "checkbox" = "radio";
  /** The group's name for assistive technology; shown above the list with `show-label`. */
  @property() label = "";
  @property({ type: Boolean, attribute: "show-label" }) showLabel = false;
  /** The chosen value; for a checkbox group a comma-separated list (an array on the property). */
  @property() value: string | string[] = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) required = false;
  /** Shared input name; generated when unset. */
  @property() name = "";
  /** Where every tile puts its control: `end` (default) or `start`. */
  @property({ attribute: "control-position" }) controlPosition: "start" | "end" = "end";
  @query(".group") private group!: HTMLElement;
  private readonly uid = `choicebox-${++uid}`;
  private internals?: ElementInternals;
  private roving = new RovingTabindex(this, {
    items: () => this.items,
    current: () => Math.max(0, this.items.indexOf(this.stop)),
    onMove: (item) => this.choose(item as AcmeChoiceboxItem),
    orientation: "both",
    wrap: true,
    skipDisabled: true,
    disabled: (item) => (item as AcmeChoiceboxItem).off,
  });
  constructor() {
    super();
    try {
      this.internals = this.attachInternals();
    } catch {}
    this.addEventListener("acme-change", this.onChange);
    this.addEventListener("keydown", this.onKey);
  }
  /** The chosen values as an array. */
  get values(): string[] {
    if (Array.isArray(this.value)) return this.value;
    return this.value
      ? String(this.value)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
  }
  get items(): AcmeChoiceboxItem[] {
    return Array.from(this.querySelectorAll<AcmeChoiceboxItem>("acme-choicebox-item"));
  }
  /** The one Tab stop of a radio group: the chosen tile (by the group's value), else the first enabled one. */
  private get stop(): AcmeChoiceboxItem | undefined {
    const items = this.items;
    const vals = this.values;
    return items.find((i) => vals.includes(i.value) && !i.off) ?? items.find((i) => !i.off);
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.name) this.name = `${this.uid}-name`;
  }
  private emit() {
    this.dispatchEvent(new CustomEvent("acme-change", { detail: { value: this.value }, bubbles: true, composed: true }));
  }
  /** Selects a tile of a radio group. */
  private choose(item: AcmeChoiceboxItem) {
    if (this.type !== "radio" || item.off || this.value === item.value) return;
    this.value = item.value;
    this.emit();
  }
  private onChange = (e: Event) => {
    const it = e.target as AcmeChoiceboxItem;
    if (it === (this as unknown) || it.localName !== "acme-choicebox-item") return;
    e.stopImmediatePropagation();
    if (this.type === "radio") {
      if (this.value === it.value) return;
      this.value = it.value;
    } else {
      const s = new Set(this.values);
      if (it.checked) s.add(it.value);
      else s.delete(it.value);
      this.value = Array.from(s);
    }
    this.emit();
  };
  private onKey = (e: KeyboardEvent) => {
    if (this.type !== "radio" || this.disabled) return;
    this.roving.handleKey(e);
  };
  /** Pushes the group state to every tile: type, name, checked, disabled, control position, and the one Tab stop. */
  private sync() {
    const items = this.items;
    const vals = this.values;
    const stop = this.type === "radio" ? this.stop : undefined;
    for (const it of items) {
      it.type = this.type;
      it.name = this.name;
      it.checked = vals.includes(it.value);
      it.groupDisabled = this.disabled;
      it.controlPosition = this.controlPosition;
      it.skipTab = this.type === "radio" && it !== stop;
    }
    if (this.internals?.setFormValue) {
      if (this.type === "radio") this.internals.setFormValue(vals[0] ?? null);
      else {
        const data = new FormData();
        for (const v of vals) data.append(this.name, v);
        this.internals.setFormValue(vals.length ? data : null);
      }
    }
    if (this.internals?.setValidity) {
      if (this.required && !vals.length) this.internals.setValidity({ valueMissing: true }, "Please select an option.", this.group);
      else this.internals.setValidity({});
    }
  }
  formResetCallback() {
    this.value = this.getAttribute("value") ?? "";
  }
  updated() {
    this.sync();
  }
  render() {
    const multi = this.type === "checkbox";
    return html`<div
      class="group"
      role=${multi ? "group" : "radiogroup"}
      aria-label=${this.showLabel || !this.label ? nothing : this.label}
      aria-labelledby=${this.showLabel && this.label ? this.uid : nothing}
      aria-multiselectable=${multi ? "true" : "false"}
      aria-required=${this.required ? "true" : "false"}
      part="group"
    >
      ${this.showLabel && this.label ? html`<label class="label plain" id=${this.uid} part="label"><div class="text">${this.label}</div></label>` : nothing}
      <ul class="list" part="list"><slot @slotchange=${() => this.sync()}></slot></ul>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-choicebox": AcmeChoicebox;
  }
}
