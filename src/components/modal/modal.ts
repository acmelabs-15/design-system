import { preventBodyScroll } from "@zag-js/remove-scroll";
import { html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { AcmeElement, boolish, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { dialogResetCss } from "../../shared/dialog";
import { modalCss } from "./modal.styles";
import { modalActionCss } from "./modal-action.styles";
import { modalBackdropCss } from "./modal-backdrop.styles";
import { modalOverlayCss } from "./modal-overlay.styles";

const TABBABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[contenteditable="true"]';
const visible = (el: HTMLElement) => (typeof el.checkVisibility === "function" ? el.checkVisibility() : true);

/** Every tabbable element under `root` in flat-tree order: slotted light DOM through its slot, shadow roots included. */
export function tabbables(root: Element | ShadowRoot): HTMLElement[] {
  const out: HTMLElement[] = [];
  const walk = (n: Element | ShadowRoot) => {
    const kids = n instanceof HTMLSlotElement ? n.assignedElements({ flatten: true }) : Array.from(n.children);
    for (const c of kids) {
      if (c instanceof HTMLElement && c.matches(TABBABLE) && visible(c)) out.push(c);
      walk(c.shadowRoot ?? c);
    }
  };
  walk((root as Element).shadowRoot ?? root);
  return out;
}

/** The element that really has focus, through every open shadow root. */
export const deepActive = (): HTMLElement | null => {
  let a = document.activeElement as HTMLElement | null;
  while (a?.shadowRoot?.activeElement) a = a.shadowRoot.activeElement as HTMLElement;
  return a;
};

/** Whether an element under `root` (shadow roots included) has its popup open (`aria-expanded="true"`): Escape and an outside press close that first. */
const expandedInside = (root: Element): boolean => {
  const walk = (n: Element | ShadowRoot): boolean => {
    const kids = n instanceof HTMLSlotElement ? n.assignedElements({ flatten: true }) : Array.from(n.children);
    return kids.some((c) => c.getAttribute("aria-expanded") === "true" || walk(c.shadowRoot ?? c));
  };
  return walk(root.shadowRoot ?? root);
};

export type ModalDrawerHeight = "" | "max" | "expand" | number;
/** Why the modal asks to close: the Escape key or a press outside the panel. */
export type ModalDismissReason = "escape" | "outside";

/** The viewport width at and under which the modal opens as a bottom sheet. */
const SHEET_QUERY = "(max-width: 600px)";
/** The exit stays on screen this long before the modal leaves, unless `render-delay` sets its own. */
const EXIT_MS = 350;
/** The sheet's exit: the length of its slide-out transition. */
const SHEET_EXIT_MS = 400;

/**
 * Modal: a dialog over the page for content that needs a decision. The native dialog opens in the
 * top layer (focus stays inside it, the page behind is inert), the page stops scrolling, and its
 * backdrop fades in while the 540px panel (`width`) scales up; on close both fade out and the modal
 * leaves after the exit, focus back on the opener. The panel holds the body (padding 20, or 0 with
 * `body-padding="0"`) with its header (`heading` or the `heading` slot, the `subtitle` slot) and
 * the default slot, then the footer with the `actions` slot: small buttons, one with `block` for a
 * lone full-width action, or a div of several. `sticky` pins the header and footer while the body
 * scrolls, each with a shadow once the body's end behind it is out of view. Under 600px it opens as
 * a bottom sheet (`drawer="false"` keeps the panel; `drawer-height` and `drawer-vertical-scroll`
 * shape the sheet). Escape and a press outside ask to close (`acme-dismiss`, cancelable), unless
 * `no-dismiss`, or `enable-skip` for the sheet's outside press; an open popup inside closes first.
 * Focus goes to `initial-focus` (a selector), else the first tabbable element that is not an
 * action, else the panel. `acme-open` fires on open, `acme-enter` on Enter, `acme-close` once the
 * modal has left.
 */
@customElement("acme-modal")
export class AcmeModal extends AcmeElement {
  static styles = [sharedCss, dialogResetCss, modalOverlayCss, modalBackdropCss, modalCss, modalActionCss];
  /** Open state; `show()` and `close()` set it. */
  @property({ type: Boolean, reflect: true }) open = false;
  /** The panel's width in px. */
  @property({ type: Number }) width = 540;
  @property() heading = "";
  /** The header and footer stay in view while the body scrolls. */
  @property({ type: Boolean }) sticky = false;
  /** The panel lets content overflow (a menu opened from inside it). */
  @property({ type: Boolean, attribute: "allow-overflow" }) allowOverflow = false;
  /** Under 600px the modal opens as a bottom sheet; `drawer="false"` keeps the panel. */
  @property({ converter: boolish }) drawer = true;
  /** The sheet's height: `max` (the viewport), `expand` (90% of it) or a number of px. */
  @property({ attribute: "drawer-height" }) drawerHeight: ModalDrawerHeight = "";
  /** `drawer-vertical-scroll="false"` clips the sheet's content instead of scrolling it. */
  @property({ converter: boolish, attribute: "drawer-vertical-scroll" }) drawerVerticalScroll = true;
  /** No wrapper takes focus around the panel and nothing is focused on open. */
  @property({ type: Boolean, attribute: "disable-focus-trap" }) disableFocusTrap = false;
  /** The sheet ignores a press outside it. */
  @property({ type: Boolean, attribute: "enable-skip" }) enableSkip = false;
  /** Escape and a press outside do not close it. */
  @property({ type: Boolean, attribute: "no-dismiss" }) noDismiss = false;
  /** Selector (in the light DOM) of the element that gets focus on open. */
  @property({ attribute: "initial-focus" }) initialFocus = "";
  /** Delay in ms before the entrance starts, and the length of the exit (350 by default). */
  @property({ type: Number, attribute: "render-delay" }) renderDelay = 0;
  /** The body's padding in px (20); 0 removes it. */
  @property({ type: Number, attribute: "body-padding" }) bodyPadding = 20;
  /** Centres the title. */
  @property({ type: Boolean }) center = false;
  /** The panel is on screen at its full opacity (false during the entrance and the exit). */
  @atomState() private rendered = false;
  /** The dialog is open (the exit keeps it open until the modal leaves). */
  @atomState() private mounted = false;
  @atomState() private sheet = false;
  @atomState() private hasSubtitle = false;
  @atomState() private hasHeadingSlot = false;
  @atomState() private hasContent = false;
  @atomState() private topHidden = false;
  @atomState() private bottomHidden = false;
  @query("dialog") private dialog!: HTMLDialogElement;
  @query(".modal") private panel!: HTMLElement;
  @query(".body") private body!: HTMLElement;
  @query(".probe-bottom") private probeBottom!: HTMLElement;
  private opener: HTMLElement | null = null;
  private unlock?: () => void;
  private exit?: ReturnType<typeof setTimeout>;
  private enter?: ReturnType<typeof setTimeout>;
  private media?: MediaQueryList;
  private resize?: ResizeObserver;

  /** The modal takes the sheet form: under 600px, unless `drawer` is off. */
  private get asSheet() {
    return this.sheet && this.drawer;
  }

  show() {
    this.open = true;
  }
  close() {
    this.open = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.hasSubtitle = !!this.querySelector('[slot="subtitle"]');
    this.hasHeadingSlot = !!this.querySelector('[slot="heading"]');
    this.hasContent = this.hasSlotContent();
    if (typeof matchMedia === "function") {
      this.media = matchMedia(SHEET_QUERY);
      this.media.addEventListener("change", this.onMedia);
      this.sheet = this.media.matches;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.media?.removeEventListener("change", this.onMedia);
    this.resize?.disconnect();
    clearTimeout(this.exit);
    clearTimeout(this.enter);
    this.unlock?.();
    this.unlock = undefined;
  }

  firstUpdated() {
    this.hasSubtitle ||= !!this.querySelector('[slot="subtitle"]');
    this.hasHeadingSlot ||= !!this.querySelector('[slot="heading"]');
    this.hasContent ||= this.hasSlotContent();
  }

  private onMedia = (e: MediaQueryListEvent) => {
    this.sheet = e.matches;
  };

  /** The default slot has content: an element, or text that is not blank. */
  private hasSlotContent() {
    return [...this.childNodes].some((n) => (n.nodeType === 1 && !(n as Element).hasAttribute("slot")) || (n.nodeType === 3 && (n.textContent ?? "").trim()));
  }

  private slotted = (name: "subtitle" | "heading" | "content") => (e: Event) => {
    const has = (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).some((n) => n.nodeType === 1 || (n.textContent ?? "").trim());
    if (name === "subtitle") this.hasSubtitle = has;
    else if (name === "heading") this.hasHeadingSlot = has;
    else {
      this.hasContent = has;
      this.measure();
    }
  };

  /** Every action is a small button; a lone full-width one is secondary unless it says otherwise. */
  private sizeActions = () => {
    for (const it of this.querySelectorAll('[slot="actions"]'))
      for (const b of it.matches("acme-button") ? [it] : Array.from(it.querySelectorAll("acme-button"))) {
        const btn = b as HTMLElement & { size: string; variant: string };
        if (!b.hasAttribute("size")) btn.size = "small";
        if (b.hasAttribute("block") && !b.hasAttribute("variant")) btn.variant = "secondary";
      }
    this.measure();
  };

  /**
   * Whether the body's ends are scrolled out of the scroller's view: the header's and the footer's
   * shadows. The body scrolls in the panel; the sheet scrolls as a whole, so there the panel is the scroller.
   */
  private measure = () => {
    const body = this.body;
    const scroller = this.asSheet ? this.panel : body;
    if (!body || !scroller || !this.mounted) return;
    this.topHidden = Math.ceil(scroller.scrollTop) >= 1;
    const probe = this.probeBottom;
    const box = scroller.getBoundingClientRect();
    this.bottomHidden = !!probe && box.height > 0 && probe.getBoundingClientRect().top >= box.bottom;
  };

  /** Asks to close: the cancelable `acme-dismiss` event, then the exit. */
  private dismiss(reason: ModalDismissReason) {
    if (this.noDismiss) return;
    const ok = this.dispatchEvent(new CustomEvent<{ reason: ModalDismissReason }>("acme-dismiss", { detail: { reason }, bubbles: true, composed: true, cancelable: true }));
    if (ok) this.close();
  }

  private onCancel = (e: Event) => {
    e.preventDefault();
    if (this.panel && expandedInside(this.panel)) return;
    this.dismiss("escape");
  };

  /** The dialog closed on its own (a second Escape the platform no longer lets us cancel): the modal leaves at once. */
  private onNativeClose = () => {
    if (this.open) this.open = false;
    else if (this.mounted) this.unmount();
  };

  private onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" && this.rendered) this.dispatchEvent(new CustomEvent("acme-enter", { bubbles: true, composed: true }));
  };

  /** A press on the backdrop or the overlay around the panel. */
  private onPointerDown = (e: PointerEvent) => {
    const t = e.target as Element;
    if (t !== this.dialog && !t.matches(".trap")) return;
    if (this.asSheet && this.enableSkip) return;
    if (this.panel && expandedInside(this.panel)) {
      for (const el of this.querySelectorAll<HTMLElement>("input")) el.blur();
      requestAnimationFrame(() => this.dismiss("outside"));
      return;
    }
    this.dismiss("outside");
  };

  /** Focus on open: the `initial-focus` target, else the first tabbable element that is not an action, else the panel (or its wrapper). */
  private focusInitial() {
    const panel = this.panel;
    if (!panel) return;
    const target = this.initialFocus ? this.querySelector<HTMLElement>(this.initialFocus) : null;
    // Without the trap nothing is focused on open, except an `initial-focus` target.
    if (!target && this.disableFocusTrap && !this.asSheet) return;
    // Through shadow roots: an action's inner control sits in the slotted button's own tree.
    const inActions = (el: Element) => {
      for (let n: Node | null = el; n && n !== this; n = n instanceof ShadowRoot ? n.host : n.parentNode) if (n instanceof Element && n.getAttribute("slot") === "actions") return true;
      return false;
    };
    const first = tabbables(panel).find((el) => this.asSheet || !inActions(el));
    const el = target ? (target.matches(TABBABLE) ? target : tabbables(target)[0]) : first;
    const wrapper = this.asSheet ? panel : ((this.dialog.querySelector(".trap") as HTMLElement | null) ?? panel);
    (el ?? wrapper).focus({ preventScroll: true });
    // Moving focus is not a request to open anything: a control that opened its list because focus
    // arrived (the combobox opens on focus) closes again, so the modal opens quietly.
    const host = el?.getRootNode() instanceof ShadowRoot ? ((el.getRootNode() as ShadowRoot).host as HTMLElement & { open?: boolean }) : null;
    if (host && host !== this && host.open === true) host.open = false;
  }

  /** The modal leaves: the dialog closes, the page scrolls again, focus returns to the opener. */
  private unmount() {
    clearTimeout(this.exit);
    this.exit = undefined;
    this.mounted = false;
    this.rendered = false;
    if (this.dialog?.open) this.dialog.close();
    this.unlock?.();
    this.unlock = undefined;
    this.opener?.focus?.();
    this.opener = null;
    this.dispatchEvent(new CustomEvent("acme-close", { bubbles: true, composed: true }));
  }

  willUpdate(ch: Map<string, unknown>) {
    if (ch.has("open") && this.open) {
      clearTimeout(this.exit);
      this.exit = undefined;
      this.mounted = true;
    }
  }

  updated(ch: Map<string, unknown>) {
    if (ch.has("mounted") && this.mounted) {
      this.sizeActions();
      this.resize?.disconnect();
      if (typeof ResizeObserver === "function") {
        this.resize = new ResizeObserver(this.measure);
        this.resize.observe(this.body);
        this.resize.observe(this.panel);
      }
    }
    if (!ch.has("open")) return;
    if (this.open) {
      this.opener = deepActive();
      if (!this.dialog.open) this.dialog.showModal();
      this.unlock ??= preventBodyScroll();
      this.focusInitial();
      this.measure();
      // The entrance: the panel is laid out at its start (faded, scaled down; the sheet below the
      // edge), then shown, so the transition runs from that start.
      void this.dialog.offsetWidth;
      const enter = () => {
        this.enter = undefined;
        this.rendered = true;
      };
      clearTimeout(this.enter);
      if (this.renderDelay > 0) this.enter = setTimeout(enter, this.renderDelay);
      else enter();
      this.dispatchEvent(new CustomEvent("acme-open", { bubbles: true, composed: true }));
    } else if (this.mounted) {
      clearTimeout(this.enter);
      this.enter = undefined;
      this.rendered = false;
      this.exit = setTimeout(() => this.unmount(), this.asSheet ? SHEET_EXIT_MS : this.renderDelay || EXIT_MS);
    }
  }

  private panelStyle() {
    if (this.asSheet) {
      const h = this.drawerHeight;
      const px = h !== "" && Number.isFinite(Number(h)) ? Number(h) : null;
      return h === "max" ? { height: "100dvh", maxHeight: "100dvh" } : h === "expand" ? { height: "90dvh" } : px !== null ? { height: `${px}px` } : {};
    }
    return { width: `${this.width}px`, opacity: this.rendered ? "1" : "0", transform: this.rendered ? "scale(1)" : "scale(var(--ds-motion-overlay-scale))" };
  }

  render() {
    const sheet = this.asSheet;
    const header = this.heading || this.hasHeadingSlot || this.hasSubtitle;
    const subtitle = html`<slot name="subtitle" @slotchange=${this.slotted("subtitle")}></slot>`;
    // The starting and ending frames of the sheet's transition, as the reference marks them.
    const starting = sheet && this.mounted && !this.rendered && this.open;
    const ending = sheet && this.mounted && !this.rendered && !this.open;
    const panel = html`<div
      class=${this.cls("modal", { sticky: this.sticky, overflow: this.allowOverflow, sheet, unpadded: this.bodyPadding === 0, center: this.center, noscroll: !this.drawerVerticalScroll })}
      role="dialog"
      aria-modal="true"
      aria-labelledby=${header ? "title" : nothing}
      aria-describedby=${this.hasSubtitle ? "subtitle" : nothing}
      tabindex=${sheet ? "-1" : nothing}
      style=${styleMap(this.panelStyle())}
      @scroll=${this.measure}
      ?data-top-hidden=${this.topHidden}
      ?data-bottom-hidden=${this.bottomHidden}
      ?data-starting-style=${starting}
      ?data-ending-style=${ending}
      part="modal"
    >
      ${sheet ? html`<div class="fade-wrap" style="position:sticky;top:0;z-index:10"><div class="fade"></div></div>` : nothing}
      <div class="body" style=${`--modal-padding:${this.bodyPadding}px`} @scroll=${this.measure} part="body">
        <div class="content">
          ${
            header
              ? html`<header class="header" ?data-last=${!this.hasContent} part="header">
                  <h3 class="title" id="title">${this.heading}<slot name="heading" @slotchange=${this.slotted("heading")}></slot></h3>
                  ${this.hasSubtitle ? html`<div class="subtitle" id="subtitle">${subtitle}</div>` : subtitle}
                </header>`
              : html`<slot name="heading" @slotchange=${this.slotted("heading")}></slot>${subtitle}`
          }
          <slot @slotchange=${this.slotted("content")}></slot>
        </div>
        <div class="probe-top" aria-hidden="true"></div>
        <div class="probe-bottom" aria-hidden="true"></div>
      </div>
      <footer class="actions" part="actions"><slot name="actions" @slotchange=${this.sizeActions}></slot></footer>
    </div>`;
    // `data-open` is the desktop backdrop's fade-in; the sheet's backdrop fades through the starting and ending frames alone.
    return html`<dialog
      class=${this.cls("dialog", { sheet })}
      ?data-open=${this.rendered && !sheet}
      ?data-starting-style=${starting}
      ?data-ending-style=${ending}
      @cancel=${this.onCancel}
      @close=${this.onNativeClose}
      @keydown=${this.onKey}
      @pointerdown=${this.onPointerDown}
      part="dialog"
    >${this.mounted ? (sheet || this.disableFocusTrap ? panel : html`<div class="trap" tabindex="-1">${panel}</div>`) : nothing}</dialog>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-modal": AcmeModal;
  }
}
