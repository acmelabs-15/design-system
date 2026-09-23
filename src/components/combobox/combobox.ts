import { html } from "lit";
import { property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { matchSorter } from "match-sorter";
import { AcmeOptionControl } from "../../shared/option-control";
import { atomState } from "../../shared/atom-state";
import { optionalString } from "../../shared/attributes";
import { boolish } from "../../base";
import type { AcmeOption } from "../option/option";
import type { OptionPart } from "../../shared/option-context";

/** Returns a unique ordered subset of the supplied options. */
export type ComboboxFilter = (options: readonly AcmeOption[], query: string) => readonly AcmeOption[];
type Run = { key: HTMLElement; section: string; options: OptionPart[] };

/** An editable option-only selection with ranked results and retained author nodes.
 * @slot - Direct Option children. Use their section property for labelled groups.
 * @slot start - Leading field content.
 * @slot end - Trailing field content.
 * @slot empty - Empty result message.
 * @slot footer - Independent content below results.
 * @csspart root - Field surface.
 * @csspart input - Native editable combobox.
 * @csspart content - Popup surface.
 * @csspart list - Ranked listbox.
 * @csspart section - Labelled result group.
 * @fires {CustomEvent<{value:string}>} acme-input - A user edits search text.
 * @fires {CustomEvent<{value:string|undefined}>} acme-change - A user commits or clears a value.
 * @fires {CustomEvent<{open:boolean;reason:string}>} acme-open-change - A user changes popup visibility.
 */
export class AcmeCombobox extends AcmeOptionControl {
  protected get semanticDefaults() {
    return { ...super.semanticDefaults, ariaAutocomplete: "list" };
  }
  static shadowRootOptions = { ...AcmeOptionControl.shadowRootOptions, slotAssignment: "manual" as const };
  protected get editable(): boolean {
    return true;
  }
  @atomState() @property({ noAccessor: true, type: Boolean }) loading = false;
  @property({ noAccessor: true, converter: boolish }) declare clearable: boolean;
  @atomState() @property({ noAccessor: true, attribute: false }) filter?: ComboboxFilter;
  @atomState() private filtering = false;
  @property({ noAccessor: true, converter: optionalString }) get value(): string | undefined {
    return this.selectedValues[0];
  }
  set value(value: string | undefined) {
    this.selectedValues = value === undefined ? [] : [value];
  }
  @property({ noAccessor: true, attribute: false }) get defaultValue(): string | undefined {
    return this.resetValues[0];
  }
  set defaultValue(value: string | undefined) {
    this.resetValues = value === undefined ? [] : [value];
  }
  /** @default "" */
  @property({ noAccessor: true, attribute: "input-value" }) get inputValue(): string {
    return this.queryValue;
  }
  set inputValue(value: string) {
    if (typeof value !== "string") throw new TypeError("ComboBox inputValue must be a string");
    this.queryValue = value;
    this.filtering = true;
  }
  constructor() {
    super();
    this.clearable = true;
    this.control.setAttribute("autocomplete", "off");
    this.control.setAttribute("aria-autocomplete", "list");
  }
  protected valueChanged(): void {
    this.filtering = false;
    super.valueChanged();
  }
  protected dismissed(_reason: string): void {
    const previous = this.inputValue;
    this.valueChanged();
    this.notifyInput(previous);
  }
  protected choose(part: OptionPart, closed = false): void {
    const previous = this.inputValue;
    super.choose(part, closed);
    this.notifyInput(previous);
  }
  private notifyInput(previous: string): void {
    if (previous !== this.inputValue) this.dispatchEvent(new CustomEvent("acme-input", { bubbles: true, composed: true, detail: { value: this.inputValue } }));
  }
  clear(): void {
    if (this.nativeForm.effectiveDisabled) return;
    const previous = this.inputValue;
    super.clear();
    this.notifyInput(previous);
  }
  protected edit(_event: Event): void {
    if (this.composing || this.nativeForm.effectiveDisabled) return;
    const next = (this.control as HTMLInputElement).value;
    if (next === this.queryValue) return;
    this.queryValue = next;
    this.filtering = true;
    this.openFromUser();
    this.active = this.enabled[0];
    this.dispatchEvent(new CustomEvent("acme-input", { bubbles: true, composed: true, detail: { value: this.inputValue } }));
  }
  protected get visibleOptions(): readonly OptionPart[] {
    const available = super.visibleOptions.filter((part) => part.host.parentNode === this);
    if (!this.filtering) return available;
    const options = available.map((part) => part.host as AcmeOption);
    const ranked = this.filter
      ? this.filter(Object.freeze(options), this.queryValue)
      : this.queryValue
        ? matchSorter(options, this.queryValue.normalize("NFC"), { keys: [(option) => (option.value ?? "").normalize("NFC"), (option) => option.label.normalize("NFC")] })
        : options;
    if (!Array.isArray(ranked) || new Set(ranked).size !== ranked.length || ranked.some((option) => !options.includes(option)))
      throw new TypeError("ComboBox filter must return a unique subset of its supplied options");
    const parts = new Map(available.map((part) => [part.host, part]));
    return ranked.map((option) => parts.get(option)!);
  }
  private get runs(): Run[] {
    const runs: Run[] = [];
    for (const option of this.visibleOptions) {
      const section = option.section();
      const previous = runs.at(-1);
      if (previous && previous.section === section) previous.options.push(option);
      else runs.push({ key: option.host, section, options: [option] });
    }
    return runs;
  }
  protected renderEndContent() {
    return this.loading ? html`<acme-spinner size="small"></acme-spinner>` : super.renderEndContent();
  }
  protected willUpdate(changes: Map<string, unknown>) {
    if (!this.filtering && !this.composing) this.queryValue = this.displayValue;
    super.willUpdate(changes);
  }
  protected renderOptionContent() {
    return html`${repeat(
      this.runs,
      (run) => run.key,
      (run, index) =>
        run.section
          ? html`<div role="group" aria-label=${run.section} part="section"><div class="section-label" aria-hidden="true">${run.section}</div><slot data-run=${index}></slot></div>`
          : html`<slot data-run=${index}></slot>`,
    )}`;
  }
  protected updated(changes: Map<string, unknown>) {
    const runs = this.runs;
    for (const slot of this.renderRoot.querySelectorAll<HTMLSlotElement>("slot")) {
      const run = slot.getAttribute("data-run");
      const nodes = run !== null ? (runs[Number(run)]?.options.map((option) => option.host) ?? []) : [...this.children].filter((child) => child.getAttribute("slot") === slot.name);
      const previous = slot.assignedNodes();
      if (nodes.length !== previous.length || nodes.some((node, index) => node !== previous[index])) slot.assign(...nodes);
    }
    super.updated(changes);
    this.control.setAttribute("aria-busy", String(this.loading));
    this.renderRoot.querySelector("[part=list]")?.setAttribute("aria-busy", String(this.loading));
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-combobox": AcmeCombobox;
  }
}
