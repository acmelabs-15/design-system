import { preventBodyScroll } from "@zag-js/remove-scroll";
import { css, html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { toasts } from "../../shared/state";
import type { AcmeMenu, MenuCloseKind } from "../menu/menu";
import { contextMenuCss } from "./context-menu.styles";
import "../menu/menu";
import "../menu-item/menu-item";
import { atomState } from "../../shared/atom-state";

/** A press this long on a touch or pen pointer opens the menu. */
const LONG_PRESS_MS = 700;
/** The list opens this far to the right of the point. */
const POINT_GAP = 2;

/** The absolute address of the link under a node, when it has one that goes somewhere. */
const linkOf = (node: EventTarget | null): string => {
  if (!(node instanceof Element)) return "";
  const a = node.closest("a[href]");
  if (!(a instanceof HTMLAnchorElement)) return "";
  const href = a.getAttribute("href");
  return href && href !== "#" ? a.href : "";
};

/**
 * A menu of contextual actions on the content in the default slot: a right click (the `contextmenu`
 * event, the keyboard's menu key included) or a 700ms press of a touch or pen pointer opens an
 * `acme-menu` of the `acme-menu-item` rows in the `items` slot (sections and dividers too), `width`
 * wide (160), 2px to the right of the point and level with it, flipped and shifted when the window
 * bounds would clip it. Over a link, the list starts with "Open in New Tab" and "Copy Link Address"
 * (a toast reports the copy), then a separator before the rows. The browser's own menu stays off
 * the content only. Arrow keys move the highlight, Enter or Space activate, Escape (`acme-escape`,
 * cancelable) and a press outside close, and so does a selected row; focus returns to where it was
 * unless a press outside closed it. The open menu is modal: the page stops scrolling and takes no
 * pointer events (a press outside only closes the list). The host is the inline wrapper around the
 * content, `data-state` open or closed; `disabled` keeps the menu shut. `open` follows the menu, and `show(x, y)` and
 * `close()` drive it. Fires `acme-open` and `acme-close` (`detail.kind`). The menu's `floating` and
 * `menu` parts are exported.
 */
@customElement("acme-context-menu")
export class AcmeContextMenu extends AcmeElement {
  static styles = [
    sharedCss,
    contextMenuCss,
    css`
      /* The wrapper around the content: an inline span whose long press is the menu's, not the browser's, as the script styles it. */
      :host {
        display: inline;
        -webkit-touch-callout: none;
      }
      /* The composed menu is the point the list anchors to: an empty box the script places at the pointer, out of the content's flow. */
      acme-menu {
        position: fixed;
        width: 0;
        height: 0;
      }
      .anchor {
        display: block;
        width: 0;
        height: 0;
      }
      /* The list takes pointer events while the page behind it takes none. */
      acme-menu::part(floating) {
        pointer-events: auto;
      }
    `,
  ];
  /** Whether the menu is open: follows the menu, and opens (at the last point) or closes it when set. */
  @property({ type: Boolean, reflect: true }) open = false;
  /** The list's width in px. */
  @property({ type: Number }) width = 160;
  /** Nothing opens the menu. */
  @property({ type: Boolean, reflect: true }) disabled = false;
  /** The link under the last press, whose rows lead the list. */
  @atomState() private linkHref = "";
  @query("acme-menu") private menu?: AcmeMenu;
  /** The point the list opens at, in window coordinates. */
  private x = 0;
  private y = 0;
  /** A point has been set: `show()` with none keeps it, or starts at the content's corner. */
  private placed = false;
  private pressTimer?: ReturnType<typeof setTimeout>;
  /** The element focused before the menu opened: focus goes back to it on close. */
  private previous: Element | null = null;
  /** A press outside closed the menu: focus stays where the press put it. */
  private outside = false;
  private unlock?: () => void;
  /** The body's own pointer-events value, put back when the menu closes. */
  private bodyPointer: string | null = null;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("pointerdown", this.onDocPress, true);
    this.renderRoot.addEventListener("acme-select", this.onSelect);
    // The content's presses reach the host from the light DOM; the list's own reach it from the shadow tree and are left to the menu.
    this.addEventListener("contextmenu", this.onContextMenu);
    this.addEventListener("pointerdown", this.onPointerDown);
    this.addEventListener("pointermove", this.onPointerEnd);
    this.addEventListener("pointerup", this.onPointerEnd);
    this.addEventListener("pointercancel", this.onPointerEnd);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.release();
    document.removeEventListener("pointerdown", this.onDocPress, true);
    this.renderRoot.removeEventListener("acme-select", this.onSelect);
    this.removeEventListener("contextmenu", this.onContextMenu);
    this.removeEventListener("pointerdown", this.onPointerDown);
    this.removeEventListener("pointermove", this.onPointerEnd);
    this.removeEventListener("pointerup", this.onPointerEnd);
    this.removeEventListener("pointercancel", this.onPointerEnd);
    this.clearPress();
  }

  /** Whether an event comes from the open list rather than the content. */
  private inList(e: Event) {
    const menu = this.menu;
    return !!menu && e.composedPath().includes(menu);
  }

  /** Opens the menu at a point in window coordinates; by default the last point, or the content's top left corner. */
  show(x?: number, y?: number, kind: MenuCloseKind = "pointer") {
    if (x !== undefined && y !== undefined) [this.x, this.y] = [x, y];
    else if (!this.placed) {
      const r = this.getBoundingClientRect();
      [this.x, this.y] = [r.left, r.top];
    }
    this.placed = true;
    this.placeMenu();
    if (!this.open) {
      this.previous = document.activeElement;
      this.outside = false;
    }
    this.open = true;
    this.menu?.show(kind);
  }

  /** Closes the menu. */
  close(kind: MenuCloseKind = "pointer") {
    this.menu?.close(kind);
  }

  /** Puts the anchor box at the point: it is measured at the origin first, so an offset ancestor (a transformed one) counts. */
  private placeMenu() {
    const m = this.menu;
    if (!m) return;
    m.style.left = "0px";
    m.style.top = "0px";
    const r = m.getBoundingClientRect();
    m.style.left = `${this.x - r.left}px`;
    m.style.top = `${this.y - r.top}px`;
  }

  private clearPress() {
    clearTimeout(this.pressTimer);
    this.pressTimer = undefined;
  }

  private onContextMenu = (e: MouseEvent) => {
    if (this.disabled || this.inList(e)) return;
    this.clearPress();
    this.linkHref = linkOf(e.composedPath()[0] ?? null);
    this.show(e.clientX, e.clientY);
    e.preventDefault();
  };

  /** A touch or pen pointer held still on the content opens the menu after the long-press delay. */
  private onPointerDown = (e: PointerEvent) => {
    if (this.disabled || e.pointerType === "mouse" || this.inList(e)) return;
    this.clearPress();
    const { clientX, clientY } = e;
    const link = linkOf(e.composedPath()[0] ?? null);
    this.pressTimer = setTimeout(() => {
      this.linkHref = link;
      this.show(clientX, clientY);
    }, LONG_PRESS_MS);
  };

  private onPointerEnd = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") this.clearPress();
  };

  private onDocPress = (e: Event) => {
    if (this.open && !e.composedPath().includes(this)) this.outside = true;
  };

  /** The link rows are the menu's own: their selection closes it and goes no further. */
  private onSelect = (e: Event) => {
    if (e.composedPath().some((n) => n instanceof Element && n.hasAttribute("data-link-row"))) e.stopPropagation();
  };

  private copyLink = () => {
    navigator.clipboard
      .writeText(this.linkHref)
      .then(() => toasts.message("Copied"))
      .catch(() => toasts.error("Failed to copy to clipboard"));
  };

  /** The open menu is modal: the page stops scrolling and takes no pointer events. */
  private lock() {
    this.unlock ??= preventBodyScroll();
    if (this.bodyPointer === null) {
      this.bodyPointer = document.body.style.pointerEvents;
      document.body.style.pointerEvents = "none";
    }
  }
  private release() {
    this.unlock?.();
    this.unlock = undefined;
    if (this.bodyPointer !== null) {
      document.body.style.pointerEvents = this.bodyPointer;
      this.bodyPointer = null;
    }
  }

  /** The menu's own events stop at this shadow root: they fire again from the host, and `open` follows. */
  private relay = (e: Event) => {
    const menu = e.target as AcmeMenu;
    this.open = menu.open;
    if (e.type === "acme-open") this.lock();
    if (e.type === "acme-close") {
      this.release();
      if (!this.outside && this.previous instanceof HTMLElement) this.previous.focus();
      this.previous = null;
      this.outside = false;
      this.linkHref = "";
    }
    this.dispatchEvent(new CustomEvent(e.type, { bubbles: true, detail: (e as CustomEvent).detail }));
  };

  /** Escape asks first: a listener on the host that cancels keeps the menu open. */
  private relayEscape = (e: Event) => {
    const out = new CustomEvent("acme-escape", { bubbles: true, cancelable: true });
    this.dispatchEvent(out);
    if (out.defaultPrevented) e.preventDefault();
  };

  updated(ch: Map<string, unknown>) {
    if (ch.has("open")) this.setAttribute("data-state", this.open ? "open" : "closed");
    if (ch.has("disabled")) this.toggleAttribute("data-disabled", this.disabled);
    const menu = this.menu;
    if (ch.has("open") && menu && menu.open !== this.open) {
      if (this.open) this.show();
      else menu.close();
    }
  }

  render() {
    const hasRows = this.querySelector('[slot="items"]') !== null;
    return html`<slot></slot
      ><acme-menu position="right-start" width=${this.width} offset=${POINT_GAP} exportparts="floating,menu" @acme-open=${this.relay} @acme-close=${this.relay} @acme-escape=${this.relayEscape}>
        <span slot="trigger" class="anchor" aria-hidden="true"></span>
        ${
          this.linkHref
            ? html`<acme-menu-item slot="items" href=${this.linkHref} external data-link-row>Open in New Tab</acme-menu-item
                ><acme-menu-item slot="items" data-link-row @acme-select=${this.copyLink}>Copy Link Address</acme-menu-item>${
                  hasRows ? html`<div class="separator" role="separator" aria-orientation="horizontal" slot="items"></div>` : nothing
                }`
            : nothing
        }
        <slot name="items" slot="items"></slot>
      </acme-menu>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-context-menu": AcmeContextMenu;
  }
}
