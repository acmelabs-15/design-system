import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import type { AcmeSwitchControl } from "../switch-control/switch-control";
import { switchCss } from "./switch.styles";
import "../switch-control/switch-control";

export type SwitchSize = "small" | "medium" | "large";

/**
 * Segmented selector for two or three mutually exclusive views, with radio semantics. Children:
 * acme-switch-control with `value` and `label`. The group owns the selection: it hands every
 * direct control its `name`, `size` and `checked-color` (a control wrapped in another element,
 * such as a tooltip, keeps its own size), keeps one control checked, moves the selection with
 * the arrow keys, and reports the value to its form. Sizes small 32 / medium 36 / large 40.
 */
@customElement("acme-switch")
export class AcmeSwitch extends AcmeElement {
  static formAssociated = true;
  static styles = [
    sharedCss,
    switchCss,
    css`
      /* A flex column: the group is its flex item, so it fills the host width and takes the flex-item minimum size. */
      :host {
        display: flex;
        flex-direction: column;
      }
    `,
  ];
  /** The checked control's value. */
  @property() value = "";
  /** Groups the radios; the form value is submitted under this name. */
  @property() name = "";
  @property() size: SwitchSize = "medium";
  /** Drops the hairline ring around the group. */
  @property({ type: Boolean, attribute: "hide-border" }) hideBorder = false;
  /** Background of the checked control (default gray-100), handed to every control. */
  @property({ attribute: "checked-color" }) checkedColor = "";
  private internals?: ElementInternals;
  private initial = "";
  constructor() {
    super();
    try {
      this.internals = this.attachInternals();
    } catch {}
    // On the host, so a control slotted through a wrapper (a tooltip) still reaches the group.
    this.addEventListener("acme-switch-select", (e) => {
      e.stopPropagation();
      this.select((e as CustomEvent).detail as AcmeSwitchControl);
    });
    this.addEventListener("keydown", this.onKey);
  }
  private get controls() {
    return Array.from(this.querySelectorAll("acme-switch-control")) as AcmeSwitchControl[];
  }
  private sync() {
    const cs = this.controls;
    if (!this.value) this.value = cs.find((c) => c.checked)?.value ?? "";
    for (const c of cs) {
      c.groupSize = this.size;
      c.groupName = this.name;
      c.groupCheckedColor = this.checkedColor;
      c.checked = !!this.value && c.value === this.value;
    }
    this.internals?.setFormValue?.(this.value || null);
  }
  connectedCallback() {
    super.connectedCallback();
    this.initial = this.value;
  }
  formResetCallback() {
    this.value = this.initial;
    for (const c of this.controls) c.checked = c.defaultChecked;
    if (!this.value) this.sync();
  }
  firstUpdated() {
    this.sync();
  }
  updated(ch: Map<string, unknown>) {
    if (ch.has("value") || ch.has("size") || ch.has("name") || ch.has("checkedColor")) this.sync();
  }
  private select(c?: AcmeSwitchControl) {
    if (!c || c.disabled) return;
    const changed = this.value !== c.value;
    this.value = c.value;
    this.sync();
    c.focus();
    if (changed) this.dispatchEvent(new CustomEvent("acme-change", { detail: { value: c.value }, bubbles: true, composed: true }));
  }
  private onKey = (e: KeyboardEvent) => {
    const list = this.controls.filter((c) => !c.disabled);
    if (!list.length) return;
    const i = list.findIndex((c) => c.value === this.value);
    if (e.key === "ArrowRight" || e.key === "ArrowDown") this.select(list[(i + 1) % list.length]);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") this.select(list[(i - 1 + list.length) % list.length]);
    else return;
    e.preventDefault();
  };
  render() {
    return html`<div class=${this.cls("switch", { sm: this.size === "small", lg: this.size === "large", "no-border": this.hideBorder })} part="switch"><slot @slotchange=${this.sync}></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-switch": AcmeSwitch;
  }
}
