import { css, html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { AcmeElement, boolish, sharedCss } from "../../base";
import { Interaction } from "../../shared/interaction";
import type { AcmeCheckbox } from "../checkbox/checkbox";
import "../checkbox/checkbox";
import { multiSelectRowCss } from "./multi-select-row.styles";

export type MultiSelectAction = "toggle" | "selectOnly" | "selectAll";
export type MultiSelectCheckboxPosition = "start" | "end";
/** The list a row belongs to: it keeps the hovered row and the active column across its rows. */
export type MultiSelectOwner = { hoverRow(row: AcmeMultiSelectRow | null): void; hoverCheckbox(on: boolean): void };

let seq = 0;

/**
 * One row of a multi select: a 28px box holding an `acme-checkbox` (after the button with
 * `checkbox-position="end"`) and a button that fills the rest with the name (`name`, or the
 * default slot's content) after the `leading` slot's content, and the action hint at its end. The
 * hint names what a press does and shows while the button is hovered or focused: `Check All` on a
 * checked row and `Only` on an unchecked one while the selection is mixed, `Only` while every row
 * is checked, `Check` while none is; with the pointer over the checkbox (or Left pressed on the
 * row), `Check` or `Uncheck`. A press on the button runs that action; a press on the checkbox, or
 * Enter or Space with the checkbox column active, toggles the row; `show-action-label="false"`
 * drops the hint and makes every press a toggle. A disabled row fades the button to 60% under a
 * not-allowed cursor and takes no press. The row fires `acme-select` (cancelable; `detail.action`
 * is `toggle`, `selectOnly` or `selectAll`, with `name`, `value` and `checked`) and leaves the
 * selection to its multi select: `checked`, `selected-count`, `total-count`, `hovered` and
 * `checkbox-hovered` are set from outside. `value` is what the form takes for a checked row (the
 * name when unset); `checkbox-name` names the checkbox itself (the name when unset).
 */
@customElement("acme-multi-select-row")
export class AcmeMultiSelectRow extends AcmeElement {
  static styles = [
    sharedCss,
    multiSelectRowCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  /** The row's name: the button's accessible name, the checkbox's label, and the text when the default slot is empty. */
  @property() name = "";
  /** The value the form takes while the row is checked; the name when unset. */
  @property() value = "";
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) indeterminate = false;
  /** The checkbox's own name; the row's name when unset. */
  @property({ attribute: "checkbox-name" }) checkboxName = "";
  /** Where the checkbox sits: before the button, or after it (32px wide). */
  @property({ attribute: "checkbox-position" }) checkboxPosition: MultiSelectCheckboxPosition = "start";
  /** The action hint at the button's end; `"false"` drops it and makes every press a toggle. */
  @property({ converter: boolish, attribute: "show-action-label" }) showActionLabel = true;
  /** Checked rows in the list; the multi select sets it. */
  @property({ type: Number, attribute: "selected-count" }) selectedCount = 0;
  /** Rows in the list; the multi select sets it. */
  @property({ type: Number, attribute: "total-count" }) totalCount = 0;
  /** The row under the pointer or the keys; the multi select sets it. */
  @property({ type: Boolean, reflect: true }) hovered = false;
  /** The checkbox column is the active one on the hovered row (the pointer over the checkbox, or Left pressed); the multi select sets it. */
  @property({ type: Boolean, reflect: true, attribute: "checkbox-hovered" }) checkboxHovered = false;
  @state() private hasLeading = false;
  @query(".action") private button?: HTMLButtonElement;
  @query("acme-checkbox") private checkbox?: AcmeCheckbox;
  /** The button's id: the checkbox is labelled by it. */
  readonly buttonId = `multi-select-row-${(++seq).toString(36)}`;
  // The button's pointer, press and keyboard focus states; the checkbox's pointer and press states on its host.
  private buttonState = new Interaction(this, { disabled: () => this.disabled });
  private checkboxState = new Interaction(this, { disabled: () => this.disabled });

  /** The value the form takes: `value`, or the name. */
  get formValue(): string {
    return this.value || this.name;
  }

  /** The list this row belongs to. */
  private get owner(): MultiSelectOwner | null {
    const el = this.closest("acme-multi-select") as (HTMLElement & Partial<MultiSelectOwner>) | null;
    return el && typeof el.hoverRow === "function" ? (el as HTMLElement & MultiSelectOwner) : null;
  }

  /** The deepest focused element, through shadow roots. */
  static activeElement(): Element | null {
    let a: Element | null = document.activeElement;
    while (a?.shadowRoot?.activeElement) a = a.shadowRoot.activeElement;
    return a;
  }

  /** The row's button has focus. */
  get focused(): boolean {
    return !!this.button && AcmeMultiSelectRow.activeElement() === this.button;
  }

  /** Focuses the row's button. */
  focus(options?: FocusOptions) {
    this.button?.focus(options);
  }

  /** The action hint for the row's state; empty when none applies. */
  get actionLabel(): string {
    if (!this.showActionLabel) return "";
    const mixed = this.selectedCount > 0 && this.selectedCount < this.totalCount;
    const all = this.totalCount > 0 && this.selectedCount === this.totalCount;
    if (this.checkboxHovered) return this.checked ? "Uncheck" : "Check";
    if (mixed) return this.checked ? "Check All" : "Only";
    if (all) return "Only";
    if (this.selectedCount === 0) return "Check";
    return "";
  }

  /** What a press on the button does for the row's state; nothing for a state no action fits. */
  private get pressAction(): MultiSelectAction | null {
    if (!this.showActionLabel) return "toggle";
    const mixed = this.selectedCount > 0 && this.selectedCount < this.totalCount;
    const all = this.totalCount > 0 && this.selectedCount === this.totalCount;
    if (all) return "selectOnly";
    if (this.checked) return "selectAll";
    if (mixed) return "selectOnly";
    if (this.selectedCount === 0) return "toggle";
    return null;
  }

  /** Asks for an action: fires `acme-select`; nothing on a disabled row. */
  act(action: MultiSelectAction) {
    if (this.disabled) return;
    this.dispatchEvent(new CustomEvent("acme-select", { detail: { action, name: this.name, value: this.formValue, checked: this.checked }, bubbles: true, composed: true, cancelable: true }));
  }

  /** Toggles the row. */
  toggle() {
    this.act("toggle");
  }

  /** Checks this row alone. */
  selectOnly() {
    this.act("selectOnly");
  }

  /** Checks every row. */
  selectAll() {
    this.act("selectAll");
  }

  private onPress = () => {
    const action = this.pressAction;
    if (action) this.act(action);
  };

  private onKey = (e: KeyboardEvent) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    if (this.checkboxHovered) this.act("toggle");
    else this.onPress();
  };

  /** A press on the hint runs the action it names, not the button's. */
  private onHint = (e: Event) => {
    e.stopPropagation();
    const label = this.actionLabel;
    const action: MultiSelectAction | null = label === "Only" ? "selectOnly" : label === "Check All" ? "selectAll" : label === "Check" || label === "Uncheck" ? "toggle" : null;
    if (action) this.act(action);
  };

  /** The checkbox's own change is a toggle request: the row's state follows the list's answer. */
  private onCheckbox = (e: Event) => {
    e.stopPropagation();
    this.act("toggle");
    if (this.checkbox) this.checkbox.checked = this.checked;
  };

  private onEnter = () => this.owner?.hoverRow(this);
  private onLeave = () => {
    this.owner?.hoverRow(null);
    this.owner?.hoverCheckbox(false);
  };
  private onBoxEnter = () => this.owner?.hoverCheckbox(true);
  private onBoxLeave = () => this.owner?.hoverCheckbox(false);

  private readLeading = () => {
    this.hasLeading = !!this.querySelector(':scope > [slot="leading"]');
  };

  connectedCallback() {
    super.connectedCallback();
    this.readLeading();
  }

  firstUpdated() {
    // A parser that connects the element before its children (happy-dom does) misses them at connect.
    this.readLeading();
  }

  updated() {
    this.buttonState.attach(this.button);
    this.checkboxState.attach(this.checkbox);
    if (this.checkbox && this.checkbox.checked !== this.checked) this.checkbox.checked = this.checked;
  }

  render() {
    const label = this.actionLabel;
    const cls = this.cls("row", {
      end: this.checkboxPosition === "end",
      disabled: this.disabled,
      hovered: this.hovered && !this.checkboxHovered,
      "checkbox-hovered": this.hovered && this.checkboxHovered,
    });
    const leadingSlot = html`<slot name="leading" @slotchange=${this.readLeading}></slot>`;
    return html`<div class=${cls} @mouseenter=${this.onEnter} @mouseleave=${this.onLeave} part="row">
      <div class="box" @mouseenter=${this.onBoxEnter} @mouseleave=${this.onBoxLeave} part="box">
        <acme-checkbox
          ?checked=${this.checked}
          ?disabled=${this.disabled}
          ?indeterminate=${this.indeterminate}
          name=${this.checkboxName || this.name}
          value=${this.formValue}
          aria-label=${this.name}
          @acme-change=${this.onCheckbox}
          part="checkbox"
        ></acme-checkbox>
      </div>
      <button class="action" id=${this.buttonId} type="button" tabindex="-1" ?disabled=${this.disabled} aria-label=${`${this.name}${label ? `. ${label}` : ""}`} @click=${this.onPress} @keydown=${this.onKey} part="action">
        <div class="body">${this.hasLeading ? html`<span class="leading">${leadingSlot}</span>` : leadingSlot}<span class="name"><slot>${this.name}</slot></span></div>
        <div class="tail">${label ? html`<span class="hint" aria-hidden="true" @click=${this.onHint}>${label}</span>` : nothing}</div>
      </button>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-multi-select-row": AcmeMultiSelectRow;
  }
}
