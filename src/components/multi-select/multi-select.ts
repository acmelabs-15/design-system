import { autoUpdate, computePosition, flip, offset, shift, size } from "@floating-ui/dom";
import { css, html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { AcmeElement, boolish, sharedCss } from "../../base";
import { Interaction } from "../../shared/interaction";
import type { AcmeMultiSelectRow, MultiSelectAction, MultiSelectOwner } from "../multi-select-row/multi-select-row";
import "../multi-select-row/multi-select-row";
import { multiSelectCss } from "./multi-select.styles";
import { multiSelectContentCss } from "./multi-select-content.styles";

export type MultiSelectSide = "top" | "right" | "bottom" | "left";
export type MultiSelectAlign = "start" | "center" | "end";

/** Space between the trigger and the list. */
const GAP = 8;
/** The list keeps its box for this long after it starts to fade out. */
const EXIT_MS = 200;
let seq = 0;

/** The 16-box chevron in the trigger's suffix, drawn 14 wide in the current colour. */
const CHEVRON = "m14.06 5.5-.53.53-4.82 4.82a1 1 0 0 1-1.42 0L2.47 6.03l-.53-.53L3 4.44l.53.53L8 9.44l4.47-4.47.53-.53z";

/**
 * A trigger that opens a list of rows to check several of them: `acme-multi-select-row` children,
 * the trigger's content in the `trigger` slot (the count, `3 regions selected`), and a chevron that
 * turns while the list is open. The list floats 8px under the trigger's end in the top layer, at
 * least the trigger's width and no taller than the room below it or 384px, and fades out over
 * 200ms; `side` and `align` place it (`align-offset`, `collision-padding`, `avoid-collisions="false"`).
 * A click on the trigger toggles it; Arrow Down opens it. In the list Arrow Down and Arrow Up move
 * focus between the rows' buttons (around the ends) and keep the active column, Left makes the
 * checkbox column active and Right the button, Enter or Space act on the focused row (a toggle in
 * the checkbox column, the row's smart action otherwise), Escape closes and returns focus to the
 * trigger, Tab leaves, and a press or a focus outside closes. A row's `acme-select` (unless a
 * listener cancels it) toggles the row, checks it alone or checks every row; the list then fires
 * `acme-change` (`detail.value`, the checked rows' values, with `action` and `row`) and hands each
 * row its `selected-count` and `total-count`. `value` reads and sets the checked rows' values.
 * Fires `acme-open` and `acme-close`. Form-associated (an entry per checked row under `name`) and
 * labelable; `disabled` disables the trigger.
 */
@customElement("acme-multi-select")
export class AcmeMultiSelect extends AcmeElement implements MultiSelectOwner {
  static formAssociated = true;
  static styles = [
    sharedCss,
    multiSelectCss,
    multiSelectContentCss,
    css`
      :host {
        display: block;
      }
      /* The list rises to the top layer as a manual popover: the browser's popover box (fixed, inset, bordered, padded, scrolling, on a canvas fill) gives way to a bare wrapper the script places, as wide as its content. */
      .floating {
        position: fixed;
        inset: auto;
        margin: 0;
        border: 0;
        padding: 0;
        width: auto;
        min-width: max-content;
        height: auto;
        overflow: visible;
        background: transparent;
        color: inherit;
      }
    `,
  ];
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ reflect: true }) name = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property() side: MultiSelectSide = "bottom";
  @property() align: MultiSelectAlign = "end";
  /** Offset along the aligned edge, in px. */
  @property({ type: Number, attribute: "align-offset" }) alignOffset = 0;
  /** The list flips and shifts to stay in the window; `"false"` pins it. */
  @property({ converter: boolish, attribute: "avoid-collisions" }) avoidCollisions = true;
  /** Space kept from the window's edges when the list moves, in px. */
  @property({ type: Number, attribute: "collision-padding" }) collisionPadding = 0;
  /** The list's presence: shown, fading out, or gone. */
  @state() private phase: "entered" | "exiting" | null = null;
  /** The row under the pointer or the keys. */
  @state() private hoveredRow: AcmeMultiSelectRow | null = null;
  /** The checkbox column is the active one (the pointer over a checkbox, or Left pressed). */
  @state() private hoveringCheckbox = false;
  @state() private placed: { side: string; align: string } = { side: "bottom", align: "end" };
  @query(".trigger") private trigger?: HTMLButtonElement;
  @query(".floating") private floating?: HTMLElement;
  @query(".content") private content?: HTMLElement;
  private contentId = `multi-select-content-${(++seq).toString(36)}`;
  private internals?: ElementInternals;
  /** Values set before the rows were there, applied once they are. */
  private pendingValue?: string[];
  /** The values at first read, restored by a form reset. */
  private defaultValue?: string[];
  /** The last close came from a press or a focus outside: focus stays there. */
  private interactedOutside = false;
  private exitTimer?: ReturnType<typeof setTimeout>;
  private stopAutoUpdate?: () => void;
  private watch?: MutationObserver;
  // The trigger's pointer, press and keyboard focus states.
  private triggerState = new Interaction(this, { disabled: () => this.disabled });

  constructor() {
    super();
    try {
      this.internals = this.attachInternals();
    } catch {}
  }

  connectedCallback() {
    super.connectedCallback();
    this.readRows();
    if (typeof MutationObserver !== "undefined") {
      this.watch = new MutationObserver(() => this.readRows());
      this.watch.observe(this, { childList: true, subtree: true, attributes: true, attributeFilter: ["checked", "disabled", "value", "name", "slot"] });
    }
    document.addEventListener("pointerdown", this.onOutside, true);
    this.addEventListener("acme-select", this.onRowSelect);
    this.addEventListener("focusout", this.onFocusOut);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.watch?.disconnect();
    this.stopAutoUpdate?.();
    clearTimeout(this.exitTimer);
    document.removeEventListener("pointerdown", this.onOutside, true);
    this.removeEventListener("acme-select", this.onRowSelect);
    this.removeEventListener("focusout", this.onFocusOut);
  }

  /** Every row, in document order. */
  get rows(): AcmeMultiSelectRow[] {
    return Array.from(this.querySelectorAll<AcmeMultiSelectRow>("acme-multi-select-row")).filter((r) => !r.closest('[slot="trigger"]'));
  }

  /** The checked rows' values; setting it checks those rows and no other. */
  @property({ type: Array })
  get value(): string[] {
    return this.rows.filter((r) => r.checked).map((r) => r.formValue);
  }
  set value(v: string[]) {
    const rows = this.rows;
    if (!rows.length) {
      this.pendingValue = v;
      return;
    }
    this.pendingValue = undefined;
    for (const r of rows) r.checked = v.includes(r.formValue);
    this.requestUpdate();
  }

  private readRows = () => {
    const rows = this.rows;
    if (rows.length && this.pendingValue) this.value = this.pendingValue;
    if (rows.length && !this.defaultValue) this.defaultValue = this.value;
    this.requestUpdate();
  };

  /** Opens the list, focus on it. */
  show() {
    if (this.open || this.disabled) return;
    this.open = true;
  }

  /** Closes the list; focus returns to the trigger unless the close came from outside. */
  close() {
    if (!this.open) return;
    this.open = false;
  }

  hoverRow(row: AcmeMultiSelectRow | null) {
    this.hoveredRow = row;
  }

  hoverCheckbox(on: boolean) {
    this.hoveringCheckbox = on;
  }

  focus(options?: FocusOptions) {
    this.trigger?.focus(options);
  }

  /** Applies a row's action to the selection and reports the change, once every listener has had the event (one on this element may cancel it). */
  private onRowSelect = (e: Event) => {
    const row = e.target as AcmeMultiSelectRow;
    if (row.localName !== "acme-multi-select-row") return;
    e.stopPropagation();
    const action = (e as CustomEvent<{ action: MultiSelectAction }>).detail.action;
    queueMicrotask(() => {
      if (e.defaultPrevented) return;
      if (action === "toggle") row.checked = !row.checked;
      else for (const r of this.rows) r.checked = action === "selectAll" || r === row;
      this.requestUpdate();
      this.dispatchEvent(new CustomEvent("acme-change", { detail: { value: this.value, action, row }, bubbles: true, composed: true }));
    });
  };

  private onTriggerClick = () => {
    if (this.open) this.close();
    else this.show();
  };

  private onTriggerKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowDown" || this.open) return;
    e.preventDefault();
    this.show();
  };

  /** The keys in the list: the arrows move between the rows' buttons and the columns, Escape closes, Tab leaves. */
  private onContentKey = (e: KeyboardEvent) => {
    const rows = this.rows;
    const current = rows.findIndex((r) => r.focused);
    const currentRow = rows[current] as AcmeMultiSelectRow | undefined;
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp": {
        e.preventDefault();
        if (!rows.length) return;
        // The active column carries over to the next row while the hovered row is the focused one.
        const keep = !!currentRow && this.hoveredRow === currentRow && this.hoveringCheckbox;
        const next = e.key === "ArrowDown" ? (current < rows.length - 1 ? current + 1 : 0) : current > 0 ? current - 1 : rows.length - 1;
        rows[next]?.focus();
        this.hoveredRow = rows[next] ?? null;
        this.hoveringCheckbox = keep;
        return;
      }
      case "ArrowLeft":
      case "ArrowRight":
        e.preventDefault();
        this.hoveringCheckbox = e.key === "ArrowLeft";
        if (currentRow) this.hoveredRow = currentRow;
        return;
      case "Escape":
        e.preventDefault();
        this.close();
        return;
      case "Tab":
        // Focus leaves the list the natural way, from the trigger: the list is out of the tab order at once, and closes.
        if (this.floating) this.floating.inert = true;
        this.trigger?.focus();
        this.close();
    }
  };

  private onOutside = (e: Event) => {
    if (!this.open || e.composedPath().includes(this)) return;
    this.interactedOutside = true;
    this.close();
  };

  /** Whether a node sits in this element, its shadow tree, or the tree of an element in them. */
  private within(node: Node | null): boolean {
    for (let n: Node | null = node; n; n = n.parentNode ?? (n as ShadowRoot).host ?? null) if (n === this) return true;
    return false;
  }

  /** Focus moving out of the list and the trigger closes the list; it stays where it went. */
  private onFocusOut = (e: FocusEvent) => {
    if (!this.open) return;
    const to = e.relatedTarget as Node | null;
    if (!to || this.within(to)) return;
    this.interactedOutside = true;
    this.close();
  };

  /** Anchors the list to the trigger at `side` and `align`, 8px away, moved into the window unless pinned; the list learns the trigger's width and the room left below. */
  private place = async () => {
    const trigger = this.trigger;
    const floating = this.floating;
    const content = this.content;
    if (!trigger || !floating || !content) return;
    const padding = this.collisionPadding;
    // The wrapper is in the top layer, whose containing block is the viewport: viewport coordinates place it.
    const { x, y, placement } = await computePosition(trigger, floating, {
      placement: this.align === "center" ? this.side : `${this.side}-${this.align}`,
      strategy: "fixed",
      middleware: [
        offset({ mainAxis: GAP, crossAxis: this.alignOffset }),
        ...(this.avoidCollisions ? [flip({ padding }), shift({ padding })] : []),
        size({
          padding,
          apply: ({ availableHeight, availableWidth, rects }) => {
            content.style.setProperty("--acme-popover-trigger-width", `${rects.reference.width}px`);
            content.style.setProperty("--acme-popover-trigger-height", `${rects.reference.height}px`);
            content.style.setProperty("--acme-popover-content-available-width", `${availableWidth}px`);
            content.style.setProperty("--acme-popover-content-available-height", `${availableHeight}px`);
          },
        }),
      ],
    });
    Object.assign(floating.style, { left: `${x}px`, top: `${y}px` });
    const [side, align = "center"] = placement.split("-");
    if (side !== this.placed.side || align !== this.placed.align) this.placed = { side, align };
  };

  formResetCallback() {
    if (this.defaultValue) this.value = this.defaultValue;
  }

  willUpdate(ch: Map<string, unknown>) {
    // The list's presence follows `open` in the same update, so the box renders with the state that shows it.
    if (!ch.has("open")) return;
    clearTimeout(this.exitTimer);
    if (this.open) this.phase = "entered";
    else if (ch.get("open") === true) {
      this.phase = "exiting";
      this.hoveredRow = null;
      this.hoveringCheckbox = false;
      this.exitTimer = setTimeout(() => {
        this.phase = null;
      }, EXIT_MS);
    }
  }

  updated(ch: Map<string, unknown>) {
    this.triggerState.attach(this.trigger);
    const rows = this.rows;
    const selected = rows.filter((r) => r.checked).length;
    for (const r of rows) {
      r.selectedCount = selected;
      r.totalCount = rows.length;
      r.hovered = r === this.hoveredRow;
      r.checkboxHovered = r === this.hoveredRow && this.hoveringCheckbox;
    }
    const data = new FormData();
    for (const r of rows) if (r.checked && this.name) data.append(this.name, r.formValue);
    this.internals?.setFormValue?.(this.name ? data : null);
    if (ch.has("phase")) {
      this.stopAutoUpdate?.();
      this.stopAutoUpdate = undefined;
      const floating = this.floating;
      const trigger = this.trigger;
      if (this.phase === "entered" && floating) {
        // The popover is shown once, on mount; the fade-out keeps it shown until the box goes.
        if (typeof floating.showPopover === "function" && !floating.matches(":popover-open")) floating.showPopover();
        if (trigger) this.stopAutoUpdate = autoUpdate(trigger, floating, this.place);
        this.content?.focus({ preventScroll: true });
      }
    }
    if (ch.has("open") && (this.open || ch.get("open") === true)) {
      if (!this.open && !this.interactedOutside) this.trigger?.focus();
      this.interactedOutside = false;
      this.dispatchEvent(new CustomEvent(this.open ? "acme-open" : "acme-close", { bubbles: true, composed: true }));
    }
  }

  render() {
    return html`<button
        class="trigger"
        type="button"
        tabindex="0"
        aria-haspopup="dialog"
        aria-expanded=${String(this.open)}
        aria-controls=${this.contentId}
        data-state=${this.open ? "open" : "closed"}
        data-prefix="false"
        data-suffix="true"
        style="--acme-icon-size:16px"
        ?disabled=${this.disabled}
        @click=${this.onTriggerClick}
        @keydown=${this.onTriggerKey}
        part="trigger"
      >
        <span class="label"><span class="text"><slot name="trigger"></slot></span></span>
        <span class="suffix"
          ><div class="chev"><svg viewBox="0 0 16 16" height="14" width="14" style="color:currentColor"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d=${CHEVRON}></path></svg></div></span
        >
      </button>
      ${
        this.phase
          ? html`<div class="floating" popover="manual" part="floating">
            <div
              class="content"
              role="dialog"
              id=${this.contentId}
              tabindex="-1"
              data-state=${this.phase === "entered" ? "open" : "closed"}
              data-side=${this.placed.side}
              data-align=${this.placed.align}
              @keydown=${this.onContentKey}
              part="content"
            >
              <slot @slotchange=${this.readRows}></slot>
            </div>
          </div>`
          : nothing
      }`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-multi-select": AcmeMultiSelect;
  }
}
