import { html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, boolish, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { Interaction } from "../../shared/interaction";
import { commandMenuItemCss } from "../command-menu/command-menu-item.styles";

/** A keybind's keys as the row shows them: the platform modifiers render as glyphs. */
const glyphOf = (key: string) => (key === "Meta" ? "⌘" : key === "Shift" ? "⇧" : key);

export type CommandItemSelectDetail = { value: string; label: string; item: AcmeCommandItem; closeOnCallback: boolean };

/**
 * One row of a command menu: the label as content (a Title Case verb phrase), an optional icon in
 * the `prefix` slot (a 20px box), an optional `keybind` (keys separated by spaces, `Meta K`; kbd
 * chips at the end of the row) and optional content in the `suffix` slot at the end. `value` is
 * what the query is scored against and what a selection reports (the label, lowercased, when
 * unset); `disabled` keeps the row out of the keys and the pointer; `page` keeps the row to one
 * page of the menu. The menu highlights the row under the keys or the pointer (`selected`); a
 * click or Enter selects it: `acme-select` fires (cancelable; `detail.value`), and the menu closes
 * unless `close-on-callback="false"`.
 */
@customElement("acme-command-item")
export class AcmeCommandItem extends AcmeElement {
  static styles = [sharedCss, commandMenuItemCss];
  /** The value the query is scored against and a selection reports; the label, lowercased, when empty. */
  @property() value = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  /** Keys separated by spaces (`Meta K`), shown as kbd chips at the end of the row. */
  @property() keybind = "";
  /** The menu closes on a selection; `"false"` keeps it open. */
  @property({ converter: boolish, attribute: "close-on-callback" }) closeOnCallback = true;
  /** The page of the menu the row belongs to; unset, the root page. */
  @property() page = "";
  /** The highlighted row; the menu sets it. */
  @property({ type: Boolean, reflect: true }) selected = false;
  @atomState() private hasPrefix = false;
  @atomState() private hasSuffix = false;
  @query(".item") private row?: HTMLElement;
  @query(".keys") private keys?: HTMLElement;
  private rowState = new Interaction(this, { anyFocus: true, disabled: () => this.disabled });
  private keysState = new Interaction(this, { disabled: () => false });
  private watch?: MutationObserver;

  /** The visible text (the slotted prefix and suffix left out). */
  get label() {
    return Array.from(this.childNodes)
      .filter((n) => !(n instanceof Element && n.hasAttribute("slot")))
      .map((n) => n.textContent ?? "")
      .join("")
      .replace(/\s+/g, " ")
      .trim();
  }

  /** The value as the query sees it: `value`, or the label, trimmed and lowercased. */
  get searchValue() {
    return (this.value || this.label).trim().toLowerCase();
  }

  connectedCallback() {
    super.connectedCallback();
    this.readSlots();
    if (typeof MutationObserver !== "undefined") {
      this.watch = new MutationObserver(this.readSlots);
      this.watch.observe(this, { childList: true, attributes: true, attributeFilter: ["slot"], subtree: true });
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.watch?.disconnect();
  }

  private readSlots = () => {
    this.hasPrefix = !!this.querySelector(':scope > [slot="prefix"]');
    this.hasSuffix = !!this.querySelector(':scope > [slot="suffix"]');
  };

  /** Selects the row: `acme-select` (cancelable) with the value, the label and whether the menu closes. */
  select() {
    if (this.disabled) return;
    this.dispatchEvent(
      new CustomEvent<CommandItemSelectDetail>("acme-select", {
        detail: { value: this.searchValue, label: this.label, item: this, closeOnCallback: this.closeOnCallback },
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
  }

  updated() {
    this.rowState.attach(this.row);
    this.keysState.attach(this.keys);
  }

  render() {
    const keys = this.keybind.trim() ? this.keybind.trim().split(/[\s+]+/) : [];
    return html`<div
      class="item"
      role="option"
      data-value=${this.searchValue}
      aria-selected=${this.selected ? "true" : nothing}
      aria-disabled=${this.disabled ? "true" : nothing}
      data-selected=${this.selected ? "true" : nothing}
      @click=${() => this.select()}
      part="item"
    >
      ${this.hasPrefix ? html`<div class="prefix" part="prefix"><slot name="prefix"></slot></div>` : html`<slot name="prefix"></slot>`}<slot></slot>${
        keys.length ? html`<div class="keys" part="keys">${keys.map((k) => html`<kbd class="key">${glyphOf(k)}</kbd>`)}</div>` : nothing
      }${this.hasSuffix ? html`<div class="suffix" part="suffix"><slot name="suffix"></slot></div>` : html`<slot name="suffix"></slot>`}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-command-item": AcmeCommandItem;
  }
}
