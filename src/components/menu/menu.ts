import { autoUpdate, computePosition, flip, offset, shift, size } from "@floating-ui/dom";
import { css, html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, boolish, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { RovingTabindex } from "../../shared/roving-tabindex";
import type { AcmeMenuItem } from "../menu-item/menu-item";
import { menuCss } from "./menu.styles";

export type MenuPosition = "top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end" | "left" | "left-start" | "left-end" | "right" | "right-start" | "right-end";
/** How the menu was opened or closed: by the keys (focus returns to the trigger on close) or by a pointer. */
export type MenuCloseKind = "keyboard" | "pointer";

/** The list keeps its box for this long after it starts to fade out. */
const EXIT_MS = 400;
/** Typed characters form one prefix while they come this close together. */
const TYPEAHEAD_MS = 1000;
let seq = 0;
const editable = (el: EventTarget | null) =>
  el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement || (el instanceof HTMLElement && el.isContentEditable);

/**
 * A menu of actions opened from a trigger: the `trigger` slot (an `acme-menu-button`, or any
 * button; the first unslotted child counts too) and rows in the `items` slot (`acme-menu-item`,
 * `acme-menu-section`, `acme-menu-divider`). The list floats `width` wide (150) at `position`
 * (bottom-start), 10px from the trigger, and flips or shifts when the window bounds would clip it;
 * it fades out over 150ms. A click on the trigger toggles it; Arrow Down, Arrow Up, Enter or Space
 * on the trigger open it on the first row. In the list the arrows move the highlight (past the
 * ends with `rotate`), Home and End jump, typed characters jump to the first row that starts with
 * them (`enable-typeahead="false"` turns that off), Enter or Space activate the highlighted row,
 * Escape (`acme-escape`, cancelable) closes and returns focus to the trigger, Tab is swallowed, a press outside
 * closes (`disable-interact-outside` keeps it open). A row's `acme-select` closes it unless
 * `close-on-select="false"`. `hover-mode` opens it while the pointer is over the menu and closes it
 * `hover-close-delay` ms after it leaves. Fires `acme-open` and `acme-close` (`detail.kind`).
 */
@customElement("acme-menu")
export class AcmeMenu extends AcmeElement {
  static styles = [
    sharedCss,
    menuCss,
    css`
      :host {
        display: inline-block;
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
  @property({ type: Boolean, reflect: true }) open = false;
  /** Where the list opens: side, then alignment. */
  @property() position: MenuPosition = "bottom-start";
  /** The list's width in px, or `auto` for the width of its rows. */
  @property({ converter: { fromAttribute: (v: string | null) => (v === "auto" ? "auto" : Number(v) || 150), toAttribute: (v: number | "auto") => String(v) } }) width: number | "auto" = 150;
  /** The list's least width in px, for an `auto` width. */
  @property({ type: Number, attribute: "min-width" }) minWidth = 0;
  /** The gap between the trigger and the list in px. */
  @property({ type: Number }) offset = 10;
  /** The list's greatest height in px; past it the rows scroll. */
  @property({ type: Number }) height = 0;
  /** Whether a selected row closes the menu (`close-on-select="false"` keeps it open). */
  @property({ attribute: "close-on-select", converter: boolish }) closeOnSelect = true;
  /** The highlight wraps past the first and last row. */
  @property({ type: Boolean }) rotate = false;
  /** Typed characters jump to a row (`enable-typeahead="false"` turns that off). */
  @property({ attribute: "enable-typeahead", converter: boolish }) enableTypeahead = true;
  /** A press outside no longer closes the menu. */
  @property({ type: Boolean, attribute: "disable-interact-outside" }) disableInteractOutside = false;
  /** The menu opens while the pointer is over it. */
  @property({ type: Boolean, attribute: "hover-mode" }) hoverMode = false;
  /** In hover mode, the delay in ms before the menu closes after the pointer leaves. */
  @property({ type: Number, attribute: "hover-close-delay" }) hoverCloseDelay = 150;
  /** The list's presence: shown, fading out, or gone. */
  @atomState() private phase: "entered" | "exiting" | null = null;
  /** The highlighted row's index among `items`; -1 for none. */
  @atomState() private selected = -1;
  @query(".floating") private floating?: HTMLElement;
  @query(".menu") private list?: HTMLElement;
  private menuId = `menu-${(++seq).toString(36)}`;
  private openedBy: MenuCloseKind = "pointer";
  private closedBy: MenuCloseKind = "pointer";
  /** A row activated by Enter or Space: its `acme-select` closes the menu the keyboard way. */
  private viaKeyboard = false;
  private typed = "";
  private typedTimer?: ReturnType<typeof setTimeout>;
  private exitTimer?: ReturnType<typeof setTimeout>;
  private hoverTimer?: ReturnType<typeof setTimeout>;
  private stopAutoUpdate?: () => void;
  private roving = new RovingTabindex(this, {
    items: () => this.items,
    current: () => this.selected,
    onMove: (_item, i) => this.select(i),
    orientation: "both",
    wrap: () => this.rotate,
    skipDisabled: true,
    homeEnd: true,
    disabled: (item) => (item as AcmeMenuItem).inert,
  });

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("pointerdown", this.onOutside, true);
    this.addEventListener("click", this.onClick);
    this.addEventListener("keydown", this.onKeydown);
    this.addEventListener("pointermove", this.onPointerMove);
    this.addEventListener("acme-select", this.onSelect);
    this.addEventListener("mouseenter", this.onEnter);
    this.addEventListener("mouseleave", this.onLeave);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("pointerdown", this.onOutside, true);
    this.removeEventListener("click", this.onClick);
    this.removeEventListener("keydown", this.onKeydown);
    this.removeEventListener("pointermove", this.onPointerMove);
    this.removeEventListener("acme-select", this.onSelect);
    this.removeEventListener("mouseenter", this.onEnter);
    this.removeEventListener("mouseleave", this.onLeave);
    this.stopAutoUpdate?.();
    clearTimeout(this.exitTimer);
    clearTimeout(this.typedTimer);
    clearTimeout(this.hoverTimer);
  }

  /** The element that opens the menu: the `trigger` slot's child, or the first child in no slot. */
  get trigger(): HTMLElement | null {
    return this.querySelector<HTMLElement>(':scope > [slot="trigger"]') ?? (Array.from(this.children).find((c) => !c.hasAttribute("slot")) as HTMLElement | undefined) ?? null;
  }

  /** Every row, in order, wherever it sits (a section, a wrapper, a forwarded slot); inert rows included. */
  get items(): AcmeMenuItem[] {
    const out: AcmeMenuItem[] = [];
    const walk = (nodes: Element[]) => {
      for (const n of nodes) {
        if (n.localName === "acme-menu-item") out.push(n as AcmeMenuItem);
        else if (n.localName === "slot") walk((n as HTMLSlotElement).assignedElements({ flatten: true }));
        else walk(Array.from(n.querySelectorAll("acme-menu-item")));
      }
    };
    walk(Array.from(this.querySelectorAll(':scope > [slot="items"]')));
    return out;
  }

  private firstEnabled() {
    return this.items.findIndex((i) => !i.inert);
  }

  /** Opens the menu; by the keys, the first row is highlighted. */
  show(kind: MenuCloseKind = "pointer") {
    this.openedBy = kind;
    this.open = true;
  }

  /** Closes the menu; closed by the keys, focus returns to the trigger. */
  close(kind: MenuCloseKind = "pointer") {
    if (!this.open) return;
    this.closedBy = kind;
    this.open = false;
    if (kind === "keyboard") this.trigger?.focus();
  }

  private select(i: number) {
    this.selected = i;
    this.items[i]?.scrollIntoView?.({ block: "nearest" });
  }

  private onOutside = (e: Event) => {
    if (this.open && !this.disableInteractOutside && !e.composedPath().includes(this)) this.close("pointer");
  };

  private inTrigger(e: Event) {
    const t = this.trigger;
    return !!t && e.composedPath().includes(t);
  }

  private onClick = (e: Event) => {
    if (!this.inTrigger(e)) return;
    if (this.open) this.close("pointer");
    else this.show("pointer");
  };

  private onKeydown = (e: KeyboardEvent) => {
    const path = e.composedPath();
    if (this.list && path.includes(this.list)) return this.onListKey(e);
    if (!this.inTrigger(e)) return;
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    if (this.open) {
      this.select(this.firstEnabled());
      this.list?.focus({ preventScroll: true });
    } else this.show("keyboard");
  };

  private onListKey(e: KeyboardEvent) {
    switch (e.key) {
      case "Escape": {
        e.preventDefault();
        const cancel = new CustomEvent("acme-escape", { bubbles: true, cancelable: true });
        this.dispatchEvent(cancel);
        if (!cancel.defaultPrevented) this.close("keyboard");
        return;
      }
      case "Tab":
        // Tab does nothing while the menu is open: focus stays in the list, as the reference keeps it.
        e.preventDefault();
        return;
      case "Backspace":
        this.typed = "";
        return;
      case "Enter":
      case " ": {
        e.preventDefault();
        const item = this.items[this.selected];
        if (!item || item.inert) return;
        this.viaKeyboard = true;
        item.activate();
        this.viaKeyboard = false;
        return;
      }
      default:
        if (this.roving.handleKey(e)) return;
        if (this.enableTypeahead && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && !editable(e.target) && !editable(document.activeElement)) this.typeahead(e.key);
    }
  }

  /** Characters typed within a second form a prefix; the first row whose label starts with it is highlighted. */
  private typeahead(ch: string) {
    clearTimeout(this.typedTimer);
    this.typed += ch.toLowerCase();
    this.typedTimer = setTimeout(() => {
      this.typed = "";
    }, TYPEAHEAD_MS);
    const items = this.items;
    const i = items.findIndex((it) => !it.inert && it.label.toLowerCase().startsWith(this.typed));
    if (i < 0) return;
    this.select(i);
    items[i].focus({ preventScroll: true });
  }

  private onPointerMove = (e: PointerEvent) => {
    if (!this.open) return;
    const path = e.composedPath();
    const i = this.items.findIndex((it) => path.includes(it));
    if (i >= 0 && !this.items[i].inert && i !== this.selected) this.select(i);
  };

  private onSelect = () => {
    if (this.closeOnSelect) this.close(this.viaKeyboard ? "keyboard" : "pointer");
  };

  private onEnter = () => {
    if (!this.hoverMode) return;
    clearTimeout(this.hoverTimer);
    this.show("pointer");
  };

  private onLeave = () => {
    if (!this.hoverMode) return;
    clearTimeout(this.hoverTimer);
    this.hoverTimer = setTimeout(() => this.close("pointer"), this.hoverCloseDelay);
  };

  /** Anchors the list to the trigger at `position`, flipped and shifted into the window, no taller than the room below it. */
  private place = async () => {
    const trigger = this.trigger;
    const floating = this.floating;
    const list = this.list;
    if (!trigger || !floating || !list) return;
    // The wrapper is in the top layer, whose containing block is the viewport: viewport coordinates place it.
    const { x, y } = await computePosition(trigger, floating, {
      placement: this.position,
      strategy: "fixed",
      middleware: [
        offset(this.offset),
        flip(),
        shift({ padding: 8 }),
        size({
          padding: 8,
          apply: ({ availableHeight }) => {
            list.style.maxHeight = `${Math.min(this.height || Number.POSITIVE_INFINITY, availableHeight)}px`;
          },
        }),
      ],
    });
    Object.assign(floating.style, { left: `${x}px`, top: `${y}px` });
  };

  /** The trigger carries the menu's ARIA and open state. */
  private syncTrigger = () => {
    const t = this.trigger;
    if (!t) return;
    t.setAttribute("aria-haspopup", "true");
    t.setAttribute("aria-expanded", String(this.open));
    t.setAttribute("aria-controls", this.menuId);
    t.setAttribute("data-is-open", String(this.open));
    if ("open" in t) (t as HTMLElement & { open: boolean }).open = this.open;
  };

  private get name() {
    const t = this.trigger;
    return t?.getAttribute("aria-label") || t?.textContent?.trim() || "Menu";
  }

  willUpdate(ch: Map<string, unknown>) {
    // The list's presence follows `open` in the same update, so the box renders with the state that shows it.
    if (!ch.has("open")) return;
    clearTimeout(this.exitTimer);
    if (this.open) {
      this.phase = "entered";
      this.selected = this.openedBy === "keyboard" ? this.firstEnabled() : -1;
    } else if (ch.get("open") === true) {
      this.phase = "exiting";
      this.selected = -1;
      this.typed = "";
      this.exitTimer = setTimeout(() => {
        this.phase = null;
      }, EXIT_MS);
    }
  }

  updated(ch: Map<string, unknown>) {
    if (ch.has("phase")) {
      this.stopAutoUpdate?.();
      this.stopAutoUpdate = undefined;
      const floating = this.floating;
      const trigger = this.trigger;
      if (this.phase === "entered" && floating) {
        // The popover is shown once, on mount; the fade-out keeps it shown until the box goes.
        if (typeof floating.showPopover === "function" && !floating.matches(":popover-open")) floating.showPopover();
        if (trigger) this.stopAutoUpdate = autoUpdate(trigger, floating, this.place);
        this.list?.focus({ preventScroll: true });
      }
    }
    if (ch.has("selected") || ch.has("open")) for (const [i, it] of this.items.entries()) it.selected = this.open && i === this.selected;
    this.syncTrigger();
    if (ch.has("open") && (this.open || ch.get("open") === true)) {
      this.dispatchEvent(new CustomEvent(this.open ? "acme-open" : "acme-close", { bubbles: true, detail: { kind: this.open ? this.openedBy : this.closedBy } }));
      this.openedBy = "pointer";
      this.closedBy = "pointer";
    }
  }

  render() {
    const style = `width:${this.width === "auto" ? "auto" : `${this.width}px`}${this.minWidth ? `;min-width:${this.minWidth}px` : ""}${this.height ? `;max-height:${this.height}px` : ""}`;
    return html`<slot name="trigger" @slotchange=${this.syncTrigger}><slot @slotchange=${this.syncTrigger}></slot></slot>${
      this.phase
        ? html`<div class="floating" popover="manual" data-phase=${this.phase} part="floating">
            <ul class="menu" role="menu" tabindex="-1" id=${this.menuId} aria-label=${this.name} style=${style} part="menu"><slot name="items"></slot></ul>
          </div>`
        : nothing
    }`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-menu": AcmeMenu;
  }
}
