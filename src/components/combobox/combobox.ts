import { autoUpdate, computePosition, flip, hide, offset, shift } from "@floating-ui/dom";
import { css, html, LitElement, nothing, svg } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, boolish, sharedCss } from "../../base";
import { Interaction } from "../../shared/interaction";
import { matchSorter } from "../../shared/match-sorter";
import type { AcmeComboboxOption } from "../combobox-option/combobox-option";
import "../spinner/spinner";
import { atomState } from "../../shared/atom-state";
import { comboboxCss } from "./combobox.styles";
import { comboboxListCss } from "./combobox-list.styles";

export type ComboboxSize = "small" | "medium" | "large";
export type ComboboxSide = "top" | "right" | "bottom" | "left";
export type ComboboxAlign = "start" | "center" | "end";
/** Narrows the rows to the ones a query matches, best first. */
export type ComboboxFilter = (rows: AcmeComboboxOption[], query: string) => AcmeComboboxOption[];

/** Space between the field and the list. */
const GAP = 8;
/** The chosen label replaces typed text, and a clear empties an open list, after this long. */
const SETTLE_MS = 150;
/** The footer's control the keys reach from the list's ends. */
const FOCUSABLE = "input:not([type=hidden]), select, button, textarea, a, acme-button";
/** Rows shown before the list scrolls. */
const VISIBLE_ROWS = 5;
let seq = 0;

/** 16-box icons in the current colour: the glass, the cross, the chevron. */
const GLASS = svg`<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M1.5 6.5a5 5 0 1 1 10 0 5 5 0 0 1-10 0M6.5 0a6.5 6.5 0 1 0 4.03 11.6l3.74 3.73 1.06-1.06-3.74-3.74A6.5 6.5 0 0 0 6.5 0"></path>`;
const CROSS = svg`<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12.53 4.53 9.06 8l3.47 3.47-1.06 1.06L8 9.06l-3.47 3.47-1.06-1.06L6.94 8 3.47 4.53l1.06-1.06L8 6.94l3.47-3.47 1.06 1.06Z"></path>`;
const CHEVRON = svg`<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M8 10.94 3.53 6.47l1.06-1.06L8 8.82l3.41-3.41 1.06 1.06L8 10.94Z"></path>`;

/** How focus last arrived: the keys (Tab, Escape) or a pointer. A field focused from the keys shows the focus ring. */
let modality: "keyboard" | "pointer" = "pointer";
if (typeof document !== "undefined") {
  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Tab" || e.key === "Escape") modality = "keyboard";
    },
    true,
  );
  document.addEventListener(
    "pointerdown",
    () => {
      modality = "pointer";
    },
    true,
  );
}

/** Ranks the rows by their value and label. */
const defaultFilter: ComboboxFilter = (rows, query) => matchSorter(rows, query, { keys: [(r) => r.value, (r) => r.text] });

/**
 * A field that filters a list of rows (`acme-combobox-option` children) by what the user types
 * and takes the chosen row's value. The shell (`role="combobox"`) holds the field: a start box
 * with the glass (a spinner while `loading`, an icon in the `start-icon` slot, or the chosen
 * row's start content), the searchbox input, the clear button once the field holds text (`clearable`,
 * on unless `"false"`), and the menu button with its chevron (`show-menu-button="false"` drops
 * it); `no-input-start` drops the start box, `display-selected-end` shows the chosen row's
 * end content beside the field. `size` small / medium / large; `errored` reads red; `width` fixes the
 * field's width in px. The list floats 8px under the field in the top layer at the field's width
 * (`list-width` sets it, `list-max-width` lets it grow to that), five and a half rows tall at most
 * (`max-visible-options`), placed at `side` and `align` (`align-offset`, `collision-padding`,
 * `avoid-collisions="false"`, `hide-when-detached`); `empty-message` is its text when no row
 * matches (`hide-on-empty` hides it then), and the `footer` slot renders under the rows. The
 * field opens on focus, a click or Arrow Down; typing filters (match-sorter by value and label;
 * `filter` replaces it) and highlights the first row; the arrows move the highlight (past the
 * ends into the footer's control, or around), Home and End jump, Enter takes the highlighted row
 * (Tab too with `allow-tab`), Escape closes, a press outside or a blur closes. A chosen row's
 * label fills the field (`no-raw-selected-value` leaves an unknown value out); `should-continue`
 * keeps the list open after a choice, `no-negative-index` keeps the highlight on a row while the
 * footer has focus, `no-text-selection` leaves the text unselected on open, `trim-value` trims
 * typed text. Fires `acme-input` (typed text), `acme-change` (`detail.value`, null on clear),
 * `acme-clear`, `acme-open` and `acme-close`. Form-associated and labelable.
 */
@customElement("acme-combobox")
export class AcmeCombobox extends AcmeElement {
  static formAssociated = true;
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };
  static styles = [
    sharedCss,
    comboboxCss,
    comboboxListCss,
    css`
      :host {
        display: block;
      }
      /* The host is the item of the parent's layout (a stretched row): the shell takes the height the host is given. */
      .combobox {
        height: 100%;
      }
      /* The list rises to the top layer as a manual popover: the browser's popover box (fixed, inset, bordered, padded, scrolling, on a canvas fill) gives way to a bare wrapper the script places. */
      .floating {
        position: fixed;
        inset: auto;
        margin: 0;
        border: 0;
        padding: 0;
        width: max-content;
        height: auto;
        overflow: visible;
        background: transparent;
        color: inherit;
      }
    `,
  ];
  @property() placeholder = "";
  /** The chosen row's value; empty for none. */
  @property() value = "";
  @property({ reflect: true }) name = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  /** The field reads red and marks itself invalid. */
  @property({ type: Boolean, reflect: true }) errored = false;
  /** The clear button once the field holds text; `"false"` drops it. */
  @property({ converter: boolish }) clearable = true;
  @property() size: ComboboxSize = "medium";
  /** The field's width in px. */
  @property({ type: Number }) width = 0;
  /** No start box: the text starts at the field's edge. */
  @property({ type: Boolean, attribute: "no-input-start" }) noInputStart = false;
  /** The menu button with the chevron; `"false"` drops it. */
  @property({ converter: boolish, attribute: "show-menu-button" }) showMenuButton = true;
  /** The chosen row's end content shown beside the field. */
  @property({ type: Boolean, attribute: "display-selected-end" }) displaySelectedEnd = false;
  /** The highlight stays on a row while the footer's control has focus. */
  @property({ type: Boolean, attribute: "no-negative-index" }) noNegativeIndex = false;
  /** The text stays unselected when the field opens. */
  @property({ type: Boolean, attribute: "no-text-selection" }) noTextSelection = false;
  /** Tab takes the highlighted row like Enter. */
  @property({ type: Boolean, attribute: "allow-tab" }) allowTab = false;
  /** The list stays open after a choice. */
  @property({ type: Boolean, attribute: "should-continue" }) shouldContinue = false;
  /** A value no row carries is left out of the field. */
  @property({ type: Boolean, attribute: "no-raw-selected-value" }) noRawSelectedValue = false;
  /** A spinner replaces the glass. */
  @property({ type: Boolean, reflect: true }) loading = false;
  /** Typed text is trimmed. */
  @property({ type: Boolean, attribute: "trim-value" }) trimValue = false;
  @property() autocomplete = "off";
  @property({ attribute: "aria-label" }) ariaLabelText = "";
  /** The list's text when no row matches. */
  @property({ attribute: "empty-message" }) emptyMessage = "No results";
  /** The list's width in px; unset, the field's. */
  @property({ type: Number, attribute: "list-width" }) listWidth = 0;
  /** The list may grow wider than the field, to this many px. */
  @property({ type: Number, attribute: "list-max-width" }) listMaxWidth = 0;
  @property() side: ComboboxSide = "bottom";
  @property() align: ComboboxAlign = "center";
  /** Offset along the aligned edge, in px. */
  @property({ type: Number, attribute: "align-offset" }) alignOffset = 0;
  /** The list flips and shifts to stay in the window; `"false"` pins it. */
  @property({ converter: boolish, attribute: "avoid-collisions" }) avoidCollisions = true;
  /** Space kept from the window's edges when the list moves, in px. */
  @property({ type: Number, attribute: "collision-padding" }) collisionPadding = 0;
  /** The list hides when no row matches. */
  @property({ type: Boolean, attribute: "hide-on-empty" }) hideOnEmpty = false;
  /** The list hides while the field is scrolled out of view. */
  @property({ type: Boolean, attribute: "hide-when-detached" }) hideWhenDetached = false;
  /** Rows shown before the list scrolls. */
  @property({ type: Number, attribute: "max-visible-options" }) maxVisibleOptions = VISIBLE_ROWS;
  /** Narrows the rows to the ones the typed text matches, best first. */
  @property({ attribute: false }) filter: ComboboxFilter = defaultFilter;
  @property({ type: Boolean, reflect: true }) open = false;
  /** The field's text. */
  @atomState() private inputValue = "";
  /** The highlighted row's index among the shown rows; -1 while the footer's control has focus. */
  @atomState() private selectedIndex = 0;
  /** Every row shows, whatever the text (a list just opened). */
  @atomState() private showAllResults = true;
  /** No text typed since the list opened. */
  @atomState() private pristine = true;
  /** The field's focus came from the keys: the focus ring shows. */
  @atomState() private keyboard = false;
  @atomState() private hasFooter = false;
  @query(".combobox") private shell?: HTMLElement;
  @query(".input") private input?: HTMLInputElement;
  @query(".clear") private clearButton?: HTMLButtonElement;
  @query(".end") private endBox?: HTMLElement;
  @query(".floating") private floating?: HTMLElement;
  @query(".list") private listBox?: HTMLElement;
  private listId = `combobox-list-${(++seq).toString(36)}`;
  private inputId = `combobox-input-${seq.toString(36)}`;
  private internals?: ElementInternals;
  /** What set `open`: the reducer step the change stands for; unset for a change from outside (an open). */
  private act?: "open" | "change" | "select" | "continue" | "close";
  /** The rows changed since the last update. */
  private rowsChanged = false;
  private inputWidth = 0;
  private settleTimer?: ReturnType<typeof setTimeout>;
  private stopAutoUpdate?: () => void;
  private watch?: MutationObserver;
  private resize?: ResizeObserver;
  // The shell's group hover and its own focus ring; any focus of the field is its focus state; the clear button's keyboard focus ring.
  private shellState = new Interaction(this, { anyFocus: true, ownFocus: true, disabled: () => false });
  private inputState = new Interaction(this, { anyFocus: true, disabled: () => false });
  private clearState = new Interaction(this);

  constructor() {
    super();
    try {
      this.internals = this.attachInternals();
    } catch {}
  }

  connectedCallback() {
    super.connectedCallback();
    this.readChildren();
    if (typeof MutationObserver !== "undefined") {
      this.watch = new MutationObserver(() => this.readChildren());
      this.watch.observe(this, { childList: true, subtree: true, attributes: true, attributeFilter: ["value", "label", "slot", "menu", "display-last", "disabled"] });
    }
    document.addEventListener("pointerdown", this.onOutside, true);
    this.addEventListener("acme-select", this.onRowSelect);
    this.addEventListener("mousemove", this.onRowMove);
    // The footer's slotted control: its keys and presses reach the host through the light DOM.
    this.addEventListener("keydown", this.onFooterKey);
    this.addEventListener("click", this.onFooterClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.watch?.disconnect();
    this.resize?.disconnect();
    this.stopAutoUpdate?.();
    clearTimeout(this.settleTimer);
    document.removeEventListener("pointerdown", this.onOutside, true);
    this.removeEventListener("acme-select", this.onRowSelect);
    this.removeEventListener("mousemove", this.onRowMove);
    this.removeEventListener("keydown", this.onFooterKey);
    this.removeEventListener("click", this.onFooterClick);
  }

  private readChildren = () => {
    this.hasFooter = !!this.querySelector(':scope > [slot="footer"]');
    this.rowsChanged = true;
    this.requestUpdate();
  };

  /** Every row, in document order. */
  get options(): AcmeComboboxOption[] {
    return Array.from(this.querySelectorAll<AcmeComboboxOption>("acme-combobox-option")).filter((o) => !o.closest('[slot="footer"]'));
  }

  /** The row whose value the field holds. */
  get selectedOption(): AcmeComboboxOption | undefined {
    return this.value ? this.options.find((o) => o.value === this.value) : undefined;
  }

  /** The rows shown: every row, or the ones the text matches, then the menu rows; a row set to display last goes to the end. */
  get rows(): AcmeComboboxOption[] {
    const all = this.options;
    const plain = all.filter((o) => !o.menu);
    const menus = all.filter((o) => o.menu);
    const matched = this.showAllResults ? plain : this.filter(plain, this.inputValue);
    const shown = this.showAllResults || matched.length ? [...matched, ...menus] : [];
    return [...shown.filter((o) => !o.displayLast), ...shown.filter((o) => o.displayLast)];
  }

  /** The footer's first control, the one the keys reach from the list's ends. */
  private get footerControl(): HTMLElement | null {
    for (const f of this.querySelectorAll<HTMLElement>(':scope > [slot="footer"]')) {
      if (f.matches(FOCUSABLE)) return f;
      const inner = f.querySelector<HTMLElement>(FOCUSABLE);
      if (inner) return inner;
    }
    return null;
  }

  private inFooter(node: EventTarget | null) {
    return node instanceof Node && Array.from(this.querySelectorAll(':scope > [slot="footer"]')).some((f) => f === node || f.contains(node));
  }

  /** Opens the list on every row with the first highlighted. */
  show() {
    if (this.open || this.disabled) return;
    this.act = "open";
    this.open = true;
  }

  /** Opens the list, selecting the field's text first unless `no-text-selection`. */
  private openWithSelection() {
    if (this.open) return;
    setTimeout(() => {
      if (!this.noTextSelection) this.input?.select();
    }, 10);
    this.show();
  }

  /** Closes the list. */
  close() {
    if (!this.open) return;
    this.act = "close";
    this.open = false;
  }

  /** Empties the field and the value. */
  clear() {
    this.setValue("");
    this.takeValue("");
  }

  /** Sets the field's text without choosing a row. */
  setValue(text: string) {
    clearTimeout(this.settleTimer);
    this.inputValue = text;
  }

  /** Chooses a value and keeps the list open. */
  setSelectedValue(v: string) {
    this.takeValue(v);
    this.act = "continue";
    this.open = true;
  }

  /** Highlights the row at `i` among the shown rows. */
  setSelectedIndex(i: number) {
    this.selectedIndex = i;
  }

  getSelectedIndex() {
    return this.selectedIndex;
  }

  focus(options?: FocusOptions) {
    this.input?.focus(options);
  }

  /** Takes a value as the field's: the form value and `acme-change`. */
  private takeValue(v: string) {
    this.value = v;
    this.internals?.setFormValue?.(v);
    this.dispatchEvent(new CustomEvent("acme-change", { detail: { value: v || null }, bubbles: true, composed: true }));
  }

  private choose(v: string) {
    this.takeValue(v);
    this.act = this.shouldContinue ? "continue" : "select";
    this.open = this.shouldContinue;
  }

  private navigate(i: number) {
    this.selectedIndex = i;
  }

  /** The next enabled row's index after `i`, around the ends. */
  private step(i: number, dir: 1 | -1) {
    const rows = this.rows;
    if (!rows.length) return i;
    const wrap = (k: number) => (k + rows.length) % rows.length;
    let j = wrap(i + dir);
    while (j !== i && rows[j].disabled) j = wrap(j + dir);
    return j;
  }

  private onInput = (e: Event) => {
    const raw = (e.target as HTMLInputElement).value;
    clearTimeout(this.settleTimer);
    this.inputValue = this.trimValue ? raw.trim() : raw;
    this.selectedIndex = 0;
    this.showAllResults = false;
    this.pristine = false;
    this.act = "change";
    this.open = true;
    this.dispatchEvent(new CustomEvent("acme-input", { detail: { value: this.inputValue }, bubbles: true, composed: true }));
  };

  private onFocus = () => {
    this.keyboard = modality === "keyboard";
    this.openWithSelection();
  };

  private onBlur = (e: FocusEvent) => {
    this.keyboard = false;
    if (!this.inFooter(e.relatedTarget)) this.close();
  };

  private onPointerDown = () => {
    this.keyboard = false;
  };

  private onInputKey = (e: KeyboardEvent) => {
    const rows = this.rows;
    if (e.key === "Tab" || e.key === "Escape") this.keyboard = true;
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        if (this.open) this.close();
        return;
      case "Home":
        e.preventDefault();
        this.navigate(0);
        return;
      case "End":
        e.preventDefault();
        this.navigate(rows.length - 1);
        return;
      case "ArrowDown": {
        e.preventDefault();
        if (!this.open) {
          this.show();
          if (!this.noTextSelection) this.input?.select();
          return;
        }
        const control = this.footerControl;
        if (this.selectedIndex === rows.length - 1 && control) {
          control.focus();
          this.navigate(-1);
          return;
        }
        if (rows.length) this.navigate(this.step(this.selectedIndex, 1));
        return;
      }
      case "ArrowUp": {
        e.preventDefault();
        if (!this.open) {
          this.show();
          this.input?.select();
          return;
        }
        const control = this.footerControl;
        if (this.selectedIndex === 0 && control) {
          control.focus();
          this.navigate(-1);
          return;
        }
        if (rows.length) this.navigate(this.step(this.selectedIndex, -1));
        return;
      }
      case "Tab":
      case "Enter": {
        if (e.key === "Tab" && !this.allowTab) return;
        e.preventDefault();
        const row = rows[this.selectedIndex];
        if (!row) {
          this.close();
          return;
        }
        row.select();
      }
    }
  };

  /** The footer's control: Escape closes, the arrows return to the list's ends, Tab returns to the field. */
  private onFooterKey = (e: KeyboardEvent) => {
    if (!this.open || !this.inFooter(e.target)) return;
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        this.input?.focus();
        this.close();
        return;
      case "Home":
      case "ArrowDown":
        e.preventDefault();
        this.input?.focus();
        this.navigate(0);
        return;
      case "End":
      case "ArrowUp":
        e.preventDefault();
        this.input?.focus();
        this.navigate(this.rows.length - 1);
        return;
      case "Tab":
        e.preventDefault();
        this.input?.focus();
    }
  };

  /** A press on the footer's control returns focus to the field once the control has acted, the last row highlighted. */
  private onFooterClick = (e: Event) => {
    if (!this.open || !this.inFooter(e.target) || !(e.target instanceof Element) || !e.target.closest("button, acme-button")) return;
    setTimeout(() => this.input?.focus(), 0);
    this.navigate(this.rows.length - 1);
  };

  private onClear = (e: Event) => {
    e.preventDefault();
    this.dispatchEvent(new CustomEvent("acme-clear", { bubbles: true, composed: true }));
    const wasOpen = this.open;
    this.takeValue("");
    this.input?.focus();
    this.close();
    const empty = () => {
      clearTimeout(this.settleTimer);
      this.inputValue = "";
    };
    if (wasOpen) this.settleTimer = setTimeout(empty, SETTLE_MS);
    else empty();
  };

  private onToggle = (e: Event) => {
    e.preventDefault();
    if (this.open) this.close();
    else {
      this.show();
      this.input?.focus();
    }
  };

  private onRowSelect = (e: Event) => {
    const row = e.target as AcmeComboboxOption;
    if (row.localName !== "acme-combobox-option" || !this.options.includes(row)) return;
    e.stopPropagation();
    if (e.defaultPrevented) return;
    this.choose(row.value);
  };

  private onRowMove = (e: Event) => {
    if (!this.open) return;
    const path = e.composedPath();
    const i = this.rows.findIndex((r) => path.includes(r));
    if (i >= 0 && i !== this.selectedIndex) this.navigate(i);
  };

  private onOutside = (e: Event) => {
    if (this.open && !e.composedPath().includes(this)) this.close();
  };

  /** Anchors the list under the field at `side` and `align`, moved into the window unless pinned. */
  private place = async () => {
    const input = this.input;
    const floating = this.floating;
    if (!input || !floating) return;
    const padding = this.collisionPadding;
    // The wrapper is in the top layer, whose containing block is the viewport: viewport coordinates place it.
    const { x, y, middlewareData } = await computePosition(input, floating, {
      placement: this.align === "center" ? this.side : `${this.side}-${this.align}`,
      strategy: "fixed",
      middleware: [offset({ mainAxis: GAP, crossAxis: this.alignOffset }), ...(this.avoidCollisions ? [flip({ padding }), shift({ padding })] : []), ...(this.hideWhenDetached ? [hide()] : [])],
    });
    Object.assign(floating.style, { left: `${x}px`, top: `${y}px`, visibility: middlewareData.hide?.referenceHidden ? "hidden" : "" });
  };

  /** The list's box: the field's width (or its own), the height of the rows it holds, scrolling past five and a half rows. */
  private sizeList(rows: AcmeComboboxOption[]) {
    const list = this.listBox;
    if (!list) return;
    const z = rows[0]?.offsetHeight || 36;
    const most = z * this.maxVisibleOptions + 10 + 2 + z / 2;
    const height = rows.length === 0 ? z + 10 + 2 : rows.length * z + 10 + 2;
    const s = list.style;
    s.outline = "0";
    s.overflowY = height > most ? "auto" : "hidden";
    s.height = `${height}px`;
    s.maxHeight = `${most}px`;
    s.display = this.hideOnEmpty && rows.length === 0 ? "none" : "";
    if (this.listWidth) {
      s.width = `${this.listWidth}px`;
      s.maxWidth = "";
      s.minWidth = "";
    } else if (this.listMaxWidth) {
      s.width = "";
      s.maxWidth = `${this.listMaxWidth}px`;
      s.minWidth = `${Math.min(this.listMaxWidth, this.inputWidth)}px`;
    } else {
      s.width = `${this.inputWidth}px`;
      s.maxWidth = "";
      s.minWidth = "";
    }
  }

  /** The rows render in the filter's order: a shown row that sits before the one ranked above it moves after it. */
  private orderRows(rows: AcmeComboboxOption[]) {
    for (let i = 1; i < rows.length; i++) {
      const a = rows[i - 1];
      const b = rows[i];
      if (a.parentNode === b.parentNode && a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_PRECEDING) a.after(b);
    }
  }

  /** The field's text follows the value while the list is closed: the chosen row's label (after a beat when the text was typed), or the raw value. */
  private syncText(ch: Map<string, unknown>) {
    // The first update stands for the mount, closed: a field opened before it renders still takes its label.
    if (this.open && this.hasUpdated) return;
    if (!(ch.has("value") || ch.has("open") || this.rowsChanged)) return;
    clearTimeout(this.settleTimer);
    if (this.value) {
      const row = this.selectedOption;
      if (row) {
        if (row.displayValue) this.inputValue = this.value;
        else if (this.inputValue) {
          this.settleTimer = setTimeout(() => {
            this.inputValue = row.text;
          }, SETTLE_MS);
        } else this.inputValue = row.text;
      } else if (!this.noRawSelectedValue) this.inputValue = this.value;
    } else if (ch.has("value") && ch.get("value") !== undefined) this.inputValue = "";
  }

  formResetCallback() {
    this.value = this.getAttribute("value") ?? "";
  }

  willUpdate(ch: Map<string, unknown>) {
    if (ch.has("open")) {
      const act = this.act;
      this.act = undefined;
      if (this.open) {
        if (act !== "change" && act !== "continue") {
          this.showAllResults = true;
          this.selectedIndex = 0;
        }
      } else this.pristine = true;
    }
    this.syncText(ch);
  }

  updated(ch: Map<string, unknown>) {
    this.shellState.attach(this.shell);
    this.inputState.attach(this.input);
    this.clearState.attach(this.clearButton);
    if (ch.has("value")) this.internals?.setFormValue?.(this.value);
    if (!this.resize && this.input && typeof ResizeObserver !== "undefined") {
      this.resize = new ResizeObserver(() => {
        this.inputWidth = this.input?.getBoundingClientRect().width ?? 0;
        if (this.open) this.sizeList(this.rows);
      });
      this.resize.observe(this.input);
    }
    this.inputWidth = this.input?.getBoundingClientRect().width ?? this.inputWidth;
    // The chosen row's end content beside the field pushes the text away from it.
    const end = this.endBox;
    if (this.input) this.input.style.paddingRight = end ? `calc(var(--acme-gap) + 16px + ${end.clientWidth}px)` : "";
    const rows = this.rows;
    const shown = new Set(rows);
    for (const o of this.options) {
      o.hidden = this.open && !shown.has(o);
      o.active = this.open && ((rows.indexOf(o) === this.selectedIndex && this.selectedIndex >= 0) || (rows[0] === o && this.selectedIndex === -1 && !this.noNegativeIndex));
      o.chosen = this.open && o.value === this.value;
      o.size = this.size;
    }
    this.rowsChanged = false;
    if (this.open) {
      this.orderRows(rows);
      this.sizeList(rows);
      const floating = this.floating;
      if (ch.has("open") && floating) {
        // The popover is shown once, on mount; it goes with the box.
        if (typeof floating.showPopover === "function" && !floating.matches(":popover-open")) floating.showPopover();
        this.stopAutoUpdate?.();
        if (this.input) this.stopAutoUpdate = autoUpdate(this.input, floating, this.place);
      }
      if (ch.has("open") || ch.has("selectedIndex")) rows[this.selectedIndex]?.scrollIntoView?.({ block: "nearest" });
    } else if (ch.has("open")) {
      this.stopAutoUpdate?.();
      this.stopAutoUpdate = undefined;
    }
    if (ch.has("open") && (this.open || ch.get("open") === true)) this.dispatchEvent(new CustomEvent(this.open ? "acme-open" : "acme-close", { bubbles: true, composed: true }));
  }

  render() {
    const rows = this.rows;
    const n = rows.length;
    const chosen = this.selectedOption;
    const cls = this.cls("combobox", {
      sm: this.size === "small",
      lg: this.size === "large",
      errored: this.errored,
      loading: this.loading,
      "no-start": this.noInputStart,
      "no-menu": !this.showMenuButton,
      "with-end": this.displaySelectedEnd && !!chosen?.endNode,
      open: this.open,
      keyboard: this.keyboard,
    });
    const icon = (path: unknown) => html`<svg class="icon" viewBox="0 0 16 16" width="16" height="16" fill="none" style="color:currentColor" aria-hidden="true">${path}</svg>`;
    const start = this.noInputStart
      ? nothing
      : html`<div class="start" aria-hidden="true">${
          this.loading ? html`<acme-spinner size="md"></acme-spinner>` : html`<slot name="start-icon" @slotchange=${this.readChildren}>${chosen?.startNode?.cloneNode(true) ?? icon(GLASS)}</slot>`
        }</div>`;
    const endNode = this.displaySelectedEnd ? chosen?.endNode?.cloneNode(true) : undefined;
    const end = endNode ? html`<div class="end">${endNode}</div>` : nothing;
    const clear = this.clearable
      ? html`<button class="clear" type="button" aria-label="Clear selected value" data-open=${String(this.open)} ?disabled=${this.disabled} style=${this.inputValue ? nothing : "display:none"} tabindex="0" @click=${this.onClear}>${icon(CROSS)}</button>`
      : nothing;
    const toggle =
      this.showMenuButton && !(this.clearable && this.inputValue)
        ? html`<button class="toggle" type="button" aria-label=${this.open ? "Close menu" : "Open menu"} data-open=${String(this.open)} ?disabled=${this.disabled} tabindex="-1" @mousedown=${this.onToggle}>${icon(CHEVRON)}</button>`
        : nothing;
    const active = this.open ? rows[this.selectedIndex]?.rowId : undefined;
    const list = this.open
      ? html`<div class="floating" popover="manual" part="floating">
          <div class="list" role="dialog" tabindex="-1" data-pristine=${String(this.pristine)} @mousedown=${(e: Event) => e.preventDefault()} part="list">
            <ul class="options" role="listbox" id=${this.listId} part="options">
              ${n === 0 ? html`<p class="empty" style="line-height:initial">${this.emptyMessage}</p>` : nothing}
              <slot @slotchange=${this.readChildren}></slot>
            </ul>
            ${this.hasFooter ? html`<footer class="footer"><slot name="footer" @slotchange=${this.readChildren}></slot></footer>` : nothing}
          </div>
        </div>`
      : nothing;
    const status = this.open ? html`<div class="status" role="status" aria-live="polite">${n > 0 ? `${n} result${n > 1 ? "s" : ""} available` : this.emptyMessage}</div>` : nothing;
    return html`<div
      class=${cls}
      role="combobox"
      tabindex="-1"
      aria-controls=${this.listId}
      aria-expanded=${String(this.open)}
      aria-haspopup="listbox"
      aria-owns=${this.listId}
      style=${this.width ? `width:${this.width}px` : nothing}
      part="combobox"
    >
      <div class="field">
        ${start}<input
          class="input"
          id=${this.inputId}
          type="text"
          role="searchbox"
          aria-autocomplete="list"
          aria-controls=${this.listId}
          aria-activedescendant=${active ?? nothing}
          aria-invalid=${this.errored ? "true" : "false"}
          aria-label=${this.ariaLabelText || this.placeholder || nothing}
          autocomplete=${this.autocomplete}
          spellcheck="false"
          placeholder=${this.placeholder || nothing}
          ?disabled=${this.disabled}
          .value=${this.inputValue}
          @input=${this.onInput}
          @focus=${this.onFocus}
          @blur=${this.onBlur}
          @pointerdown=${this.onPointerDown}
          @mousedown=${this.openWithSelection}
          @keydown=${this.onInputKey}
          part="input"
        />${end}${clear}${toggle}
      </div>
      ${list}${status}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-combobox": AcmeCombobox;
  }
}
