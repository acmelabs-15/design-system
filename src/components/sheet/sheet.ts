import { preventBodyScroll } from "@zag-js/remove-scroll";
import { css, html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { dialogResetCss } from "../../shared/dialog";
import { Interaction } from "../../shared/interaction";
import { deepActive, tabbables } from "../modal/modal";
import { sheetCss } from "./sheet.styles";
import { sheetOverlayCss } from "./sheet-overlay.styles";

export type SheetSide = "top" | "right" | "bottom" | "left";
/** Why the sheet asks to close: the Escape key or a press outside the panel. */
export type SheetDismissReason = "escape" | "outside";

/**
 * Sheet: a panel that slides in from one edge of the screen (`side`, right by default), for
 * context that stays tied to the page. The native dialog opens in the top layer; a `trigger` slot
 * opens it, `show()` and `close()` do the same. The panel holds the header (`heading` or the
 * `heading` slot, then the `header` slot), the body (the default slot, the dialog's description)
 * and the footer (the `footer` slot: buttons, one of them with `data-close` to close the sheet).
 * `modal` draws the overlay behind the panel and stops the page scrolling; `no-overlay` leaves the
 * overlay out. `inset` is the panel style front apps use most: inset 12px from the edges, rounded
 * 16, 512 wide on large screens, with no padding of its own (the header, body and footer carry
 * theirs). The panel fades in over 200ms and out again before it leaves; the overlay fades with the
 * overlay motion. Escape and a press outside ask to close (`acme-dismiss`, cancelable). Focus goes
 * to the first tabbable element in the panel, else the panel, and returns to the opener on close.
 * `acme-open` fires on open, `acme-close` once the sheet has left.
 */
@customElement("acme-sheet")
export class AcmeSheet extends AcmeElement {
  static styles = [
    sharedCss,
    dialogResetCss,
    css`
      /* A sheet without an overlay draws no backdrop. */
      dialog:where(.bare)::backdrop {
        display: none;
      }
    `,
    sheetOverlayCss,
    sheetCss,
  ];
  /** Open state; `show()` and `close()` set it. */
  @property({ type: Boolean, reflect: true }) open = false;
  /** The edge the panel slides in from. */
  @property({ reflect: true }) side: SheetSide = "right";
  /** The overlay covers the page behind the panel and the page stops scrolling. */
  @property({ type: Boolean, reflect: true }) modal = false;
  /** No overlay behind the panel. */
  @property({ type: Boolean, attribute: "no-overlay" }) noOverlay = false;
  /** The panel inset 12px from the edges, rounded, 512 wide on large screens, its parts padded. */
  @property({ type: Boolean, reflect: true }) inset = false;
  @property() heading = "";
  /** The dialog is open (the exit keeps it open until the sheet leaves). */
  @state() private mounted = false;
  @state() private hasContent = false;
  @state() private hasFooter = false;
  @query("dialog") private dialog!: HTMLDialogElement;
  private interaction = new Interaction(this, { anyFocus: true, ownFocus: true });
  private opener: HTMLElement | null = null;
  private unlock?: () => void;
  /** Counts the visits, so an exit that ends after a reopening leaves the new visit alone. */
  private visit = 0;

  show() {
    this.open = true;
  }
  close() {
    this.open = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("click", this.onClick);
    this.syncSlots();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("click", this.onClick);
    this.unlock?.();
    this.unlock = undefined;
  }

  firstUpdated() {
    this.interaction.attach(this.dialog);
    this.syncSlots();
  }

  /** A press on the trigger opens the sheet; one on a `data-close` element inside it closes it. */
  private onClick = (e: Event) => {
    const t = e.target as Element;
    if (t.closest?.('[slot="trigger"]')) this.show();
    else if (t.closest?.("[data-close]")) this.close();
  };

  /** The trigger says what it opens and whether it is open. */
  private triggers(): Element[] {
    return Array.from(this.querySelectorAll(':scope > [slot="trigger"]'));
  }
  private markTriggers() {
    for (const t of this.triggers()) {
      t.setAttribute("aria-haspopup", "dialog");
      t.setAttribute("aria-expanded", String(this.open));
      t.setAttribute("data-state", this.open ? "open" : "closed");
    }
  }

  /** What the light DOM fills: the body (an element without a slot name, or text that is not blank) and the footer. Read on connect and whenever a slot changes. */
  private syncSlots = () => {
    const kids = Array.from(this.childNodes);
    this.hasContent = kids.some((n) => (n.nodeType === 1 && !(n as Element).hasAttribute("slot")) || (n.nodeType === 3 && (n.textContent ?? "").trim()));
    this.hasFooter = kids.some((n) => n.nodeType === 1 && (n as Element).getAttribute("slot") === "footer");
    this.markTriggers();
  };

  /** Asks to close: the cancelable `acme-dismiss` event, then the exit. */
  private dismiss(reason: SheetDismissReason) {
    const ok = this.dispatchEvent(new CustomEvent<{ reason: SheetDismissReason }>("acme-dismiss", { detail: { reason }, bubbles: true, composed: true, cancelable: true }));
    if (ok) this.close();
  }

  private onCancel = (e: Event) => {
    e.preventDefault();
    this.dismiss("escape");
  };

  /** The dialog closed on its own (a second Escape the platform no longer lets us cancel): the sheet leaves at once. */
  private onNativeClose = () => {
    if (this.open) this.open = false;
    else if (this.mounted) this.unmount();
  };

  /** A press on the backdrop: the dialog is the target, and the point lies outside its box. */
  private onPointerDown = (e: PointerEvent) => {
    if (e.target !== this.dialog) return;
    const r = this.dialog.getBoundingClientRect();
    if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) return;
    this.dismiss("outside");
  };

  /** Focus on open: the first tabbable element in the panel, else the panel itself. */
  private focusInitial() {
    (tabbables(this.dialog)[0] ?? this.dialog).focus({ preventScroll: true });
  }

  /** The sheet leaves: the dialog closes, the page scrolls again, focus returns to the opener. */
  private unmount() {
    this.mounted = false;
    if (this.dialog?.open) this.dialog.close();
    this.unlock?.();
    this.unlock = undefined;
    this.opener?.focus?.();
    this.opener = null;
    this.dispatchEvent(new CustomEvent("acme-close", { bubbles: true, composed: true }));
  }

  /** The exit: the sheet leaves once its closing animations have run (at once where there are none). */
  private exit() {
    const visit = ++this.visit;
    const running = typeof this.dialog.getAnimations === "function" ? this.dialog.getAnimations({ subtree: true }) : [];
    const done = () => {
      if (visit === this.visit && !this.open && this.mounted) this.unmount();
    };
    if (!running.length) done();
    else Promise.all(running.map((a) => a.finished.catch(() => undefined))).then(done);
  }

  willUpdate(ch: Map<string, unknown>) {
    if (ch.has("open") && this.open) {
      this.visit++;
      this.mounted = true;
    }
  }

  updated(ch: Map<string, unknown>) {
    if (!ch.has("open")) return;
    this.markTriggers();
    if (this.open) {
      this.opener = deepActive();
      if (!this.dialog.open) this.dialog.showModal();
      if (this.modal) this.unlock ??= preventBodyScroll();
      this.focusInitial();
      this.dispatchEvent(new CustomEvent("acme-open", { bubbles: true, composed: true }));
    } else if (this.mounted) this.exit();
  }

  render() {
    const bare = !this.modal || this.noOverlay;
    return html`<slot name="trigger" @slotchange=${this.syncSlots}></slot>
      <dialog
        class=${this.cls("sheet", { top: this.side === "top", bottom: this.side === "bottom", left: this.side === "left", inset: this.inset, bare })}
        data-state=${this.open ? "open" : "closed"}
        aria-labelledby="title"
        aria-describedby=${this.hasContent ? "body" : nothing}
        tabindex="-1"
        @cancel=${this.onCancel}
        @close=${this.onNativeClose}
        @pointerdown=${this.onPointerDown}
        part="dialog"
      >
        <div class="header" part="header">
          <h2 class="title" id="title">${this.heading}<slot name="heading"></slot></h2>
          <slot name="header"></slot>
        </div>
        ${this.hasContent ? html`<div class="body" id="body" part="body"><slot @slotchange=${this.syncSlots}></slot></div>` : html`<slot @slotchange=${this.syncSlots}></slot>`}
        ${this.hasFooter ? html`<div class="footer" part="footer"><slot name="footer" @slotchange=${this.syncSlots}></slot></div>` : html`<slot name="footer" @slotchange=${this.syncSlots}></slot>`}
      </dialog>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-sheet": AcmeSheet;
  }
}
