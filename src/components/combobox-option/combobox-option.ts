import { css, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { comboboxOptionCss } from "./combobox-option.styles";

export type ComboboxOptionSize = "small" | "medium" | "large";

let seq = 0;
/** A 16-box check mark, drawn in the current colour. */
const CHECK = svg`<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M13.53 4.53 6.5 11.56 2.47 7.53l1.06-1.06L6.5 9.44l5.97-5.97 1.06 1.06Z"></path>`;

/**
 * One row of a combobox list: a 36px `option` (its content's own height with
 * `ignore-default-height`) with the label in the default slot, an icon in the `prefix` slot
 * before it and one in the `suffix` slot after it. A plain-text label truncates on one line;
 * other content renders as given. `value` is what the field takes; `label` is the text the filter
 * reads and the field shows once chosen (the row's text, or its value when the content is not
 * plain text), and `display-value` shows the value instead. `menu` marks a row that opens further
 * choices: it is never filtered out and lists after the matches; `display-last` lists a row last;
 * `truncate-prefix` and `truncate-suffix` truncate those slots. `disabled` fades the row and takes
 * no pointer. The combobox sets `active` (the row under the keys or the pointer), `chosen` (the
 * row whose value the field holds, with a check mark at its end when it has no suffix) and
 * `size`. A pointer release on the row fires `acme-select` (cancelable: a handler that prevents
 * it takes the selection over).
 */
@customElement("acme-combobox-option")
export class AcmeComboboxOption extends AcmeElement {
  static styles = [
    sharedCss,
    comboboxOptionCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  @property() value = "";
  /** The text the filter reads and the field shows once chosen; unset, the row's text, or its value when the content is not plain text. */
  @property() label = "";
  /** The field shows the value, not the label, once the row is chosen. */
  @property({ type: Boolean, attribute: "display-value" }) displayValue = false;
  /** A row that opens further choices: never filtered out, listed after the matches. */
  @property({ type: Boolean }) menu = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  /** The row takes its content's height instead of the fixed row height. */
  @property({ type: Boolean, attribute: "ignore-default-height" }) ignoreDefaultHeight = false;
  @property({ type: Boolean, attribute: "truncate-prefix" }) truncatePrefix = false;
  @property({ type: Boolean, attribute: "truncate-suffix" }) truncateSuffix = false;
  /** Listed last, whatever the filter's order. */
  @property({ type: Boolean, attribute: "display-last" }) displayLast = false;
  /** The row under the keys or the pointer; the combobox sets it. */
  @property({ type: Boolean, reflect: true }) active = false;
  /** The row whose value the field holds while the list is open; the combobox sets it. */
  @property({ type: Boolean, reflect: true }) chosen = false;
  /** The combobox's size; the combobox sets it. */
  @property() size: ComboboxOptionSize = "medium";
  @state() private hasPrefix = false;
  @state() private hasSuffix = false;
  /** The default slot holds elements: the content renders as given, without the label span. */
  @state() private rich = false;
  /** The row's id: the field's `aria-activedescendant` while the row is active. */
  readonly rowId = `combobox-option-${(++seq).toString(36)}`;
  private watch?: MutationObserver;

  connectedCallback() {
    super.connectedCallback();
    this.readContent();
    if (typeof MutationObserver !== "undefined") {
      this.watch = new MutationObserver(() => this.readContent());
      this.watch.observe(this, { childList: true, characterData: true, subtree: true });
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.watch?.disconnect();
  }

  firstUpdated() {
    // A parser that connects the element before its children (happy-dom does) misses them at connect.
    this.readContent();
  }

  private readContent = () => {
    this.hasPrefix = !!this.querySelector(':scope > [slot="prefix"]');
    this.hasSuffix = !!this.querySelector(':scope > [slot="suffix"]');
    this.rich = Array.from(this.children).some((c) => !c.hasAttribute("slot"));
  };

  /** The text the filter reads and the field shows: `label`, else the plain-text content, else the value. */
  get text(): string {
    if (this.label) return this.label;
    if (this.rich) return this.value;
    return Array.from(this.childNodes)
      .filter((n) => !(n instanceof Element && n.hasAttribute("slot")))
      .map((n) => n.textContent ?? "")
      .join("")
      .replace(/\s+/g, " ")
      .trim();
  }

  /** The icon slotted before the label, if any. */
  get prefixNode(): Element | null {
    return this.querySelector(':scope > [slot="prefix"]');
  }

  /** The icon slotted after the label, if any. */
  get suffixNode(): Element | null {
    return this.querySelector(':scope > [slot="suffix"]');
  }

  /** Selects the row: fires `acme-select`; nothing on a disabled row. */
  select() {
    if (this.disabled) return;
    this.dispatchEvent(new CustomEvent("acme-select", { detail: { value: this.value, label: this.text }, bubbles: true, composed: true, cancelable: true }));
  }

  private onMouseUp = (e: Event) => {
    e.preventDefault();
    this.select();
  };

  render() {
    const cls = this.cls("option", {
      sm: this.size === "small",
      lg: this.size === "large",
      disabled: this.disabled,
      auto: this.ignoreDefaultHeight,
      "truncate-prefix": this.truncatePrefix,
      "truncate-suffix": this.truncateSuffix,
      active: this.active,
      chosen: this.chosen,
    });
    const prefixSlot = html`<slot name="prefix" @slotchange=${this.readContent}></slot>`;
    const suffixSlot = html`<slot name="suffix" @slotchange=${this.readContent}></slot>`;
    const content = html`<slot @slotchange=${this.readContent}></slot>`;
    return html`<li
      class=${cls}
      role="option"
      id=${this.rowId}
      aria-selected=${this.active ? "true" : "false"}
      data-highlighted=${this.chosen ? "true" : "false"}
      @mousedown=${(e: Event) => e.preventDefault()}
      @mouseup=${this.onMouseUp}
      part="option"
    >${this.hasPrefix ? html`<span class="prefix">${prefixSlot}</span>` : prefixSlot}${
      this.rich ? content : html`<span class="label" title=${this.text}>${content}</span>`
    }${this.hasSuffix ? html`<span class="suffix">${suffixSlot}</span>` : suffixSlot}${
      !this.hasSuffix && this.chosen ? html`<svg class="check" viewBox="0 0 16 16" width="16" height="16" fill="none" style="margin-left:auto" aria-hidden="true">${CHECK}</svg>` : nothing
    }</li>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-combobox-option": AcmeComboboxOption;
  }
}
