import { html, nothing, svg } from "lit";
import { customElement, property, query, queryAll } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { Interaction } from "../../shared/interaction";
import type { ToastItem, ToastQueue, ToastText } from "../../shared/state";
import { buttonCss } from "../button/button.styles";
import { toastCss } from "./toast.styles";

export type { ToastItem, ToastOptions, ToastQueue, ToastText, ToastType, ToastVisual } from "../../shared/state";

/** A toast hides itself this long after it shows, unless it is preserved or carries an action. */
const HIDE_AFTER = 3500;
/** A toast marked to hide does so this long after. */
const SHOULD_HIDE_AFTER = 300;
/** A hiding toast leaves the queue once its exit transition has run. */
const EXIT_MS = 160;
/** A toast behind the front one collapses to this height. */
const COLLAPSED = 50;
/** Each toast behind the front one sits this much higher. */
const STEP = 20;
const CROSS = svg`<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="m12.47 13.53.53.53L14.06 13l-.53-.53L9.06 8l4.47-4.47.53-.53L13 1.94l-.53.53L8 6.94 3.53 2.47 3 1.94 1.94 3l.53.53L6.94 8l-4.47 4.47-.53.53L3 14.06l.53-.53L8 9.06z"></path>`;
const UNDO = svg`<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M13.5 8c0-3.03-2.47-5.5-5.54-5.5a5.5 5.5 0 0 0-5.32 4H6V8H.75A.75.75 0 0 1 0 7.25V2h1.5v3.23A7.04 7.04 0 0 1 15 8a7.04 7.04 0 0 1-12.73 4.11l-.44-.6 1.2-.89.45.6A5.54 5.54 0 0 0 13.5 8"></path>`;
const glyph = (paths: ReturnType<typeof svg>) => html`<span class="label"><svg height="16" width="16" viewBox="0 0 16 16" style="color:currentColor" aria-hidden="true">${paths}</svg></span>`;
const sized = (v: unknown): v is { height: number; content: ToastText } => typeof v === "object" && v !== null && "content" in v;

/**
 * One toast, drawn by `acme-toaster` from its queue: a 420px box (at most the viewport less two
 * gaps) with a 12px radius, the menu shadow and 16px padding, filled blue, red or amber for the
 * success, error and warning types. The message row holds the text and the dismiss control (an
 * undo control before it with `onUndoAction`; none with `hideX` or an action); an action adds a
 * row of two small buttons, cancel (Dismiss) and the action, and makes the toast an alert dialog.
 * A visual block sits above the message. The toast enters translated down and transparent over
 * 350ms, hides itself after 3500ms (`timeout`) unless preserved or carrying an action, and leaves
 * scaled to 0.98 over 160ms. Behind the front toast it collapses to 50px, rises 20px per step and
 * scales down 5% per step; while the pointer is over the viewport (`hovering`) every toast expands
 * to its own height and the timers pause. The fourth toast from the front is hidden, the third on
 * a viewport of 400px or less.
 */
@customElement("acme-toast")
export class AcmeToast extends AcmeElement {
  static styles = [sharedCss, buttonCss, toastCss];
  /** The toast shown. */
  @property({ attribute: false }) item!: ToastItem;
  /** The queue the toast belongs to: it takes the measured height and the removal. */
  @property({ attribute: false }) queue?: ToastQueue;
  /** The toast's place counted from the front: 0 is the newest. */
  @property({ type: Number }) position = 0;
  /** Every toast's measured height, the front first. */
  @property({ attribute: false }) heights: (number | undefined)[] = [];
  /** The pointer is over the viewport: the stack expands and the timers pause. */
  @property({ type: Boolean }) hovering = false;
  /** The toast has entered: its box is drawn in place. */
  @property({ type: Boolean }) visible = false;
  /** The toast is on its way out. */
  @property({ type: Boolean }) hiding = false;
  @query(".toast") private root?: HTMLElement;
  @query(".actions button, .actions a") private actionButton?: HTMLElement;
  @queryAll(".btn") private buttons!: NodeListOf<HTMLElement>;
  /** One controller per button: its hover, focus and press land as attributes on the button. */
  private interactions = [0, 1, 2].map(() => new Interaction(this));
  private hider?: ReturnType<typeof setTimeout>;
  private exit?: ReturnType<typeof setTimeout>;
  private hideScheduled = false;

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this.hider);
    clearTimeout(this.exit);
  }

  /** The toast keeps its timer unless it is preserved or carries an action (`preserve: false` restores it). */
  private get timed() {
    const t = this.item;
    return !(t.preserve || (t.action !== undefined && t.preserve !== false));
  }

  private startTimer() {
    clearTimeout(this.hider);
    this.hider = setTimeout(() => this.hide(), this.item.timeout ?? HIDE_AFTER);
  }

  /** Starts the exit: the box fades and scales down, then the toast leaves the queue; `dismissed` names the dismiss control. */
  hide(dismissed = false) {
    if (this.hiding) return;
    this.hiding = true;
    this.exit = setTimeout(() => {
      this.item.onRemove?.(dismissed);
      this.queue?.removeToastByKey(this.item.key);
    }, EXIT_MS);
  }

  firstUpdated() {
    // The height is measured before the entry: the measure lays the box out in its starting state, so the transition to the shown one plays.
    const height = this.root?.getBoundingClientRect().height ?? 0;
    this.queue?.setHeight(this.item.key, height);
    this.visible = true;
    if (this.timed) this.startTimer();
  }

  updated(ch: Map<string, unknown>) {
    const t = this.item;
    if (ch.has("visible") && this.visible && (t.cancelAction || t.action !== undefined) && t.autoFocus) this.actionButton?.focus();
    if (t.shouldHide && !this.hideScheduled) {
      this.hideScheduled = true;
      setTimeout(() => this.hide(), SHOULD_HIDE_AFTER);
    }
    if (ch.has("hovering") && this.timed) {
      if (this.hovering) clearTimeout(this.hider);
      else if (ch.get("hovering") === true) this.startTimer();
    }
    const buttons = this.buttons;
    this.interactions.forEach((it, i) => {
      it.attach(buttons[i]);
    });
  }

  /** The inline geometry once shown: the own height as the greatest, and behind the front toast the collapsed height and the stacked transform. */
  private geometry() {
    if (!this.visible) return nothing;
    const p = this.position;
    const own = this.heights[p];
    const front = this.heights[0];
    const above =
      p === 0
        ? 0
        : this.heights
            .slice(0, p)
            .filter(Boolean)
            .reduce<number>((a, h) => (a && h ? a + h : a), STEP * p);
    const parts: string[] = [];
    if (own !== undefined) parts.push(`max-height:${own}px`);
    if (p !== 0) {
      parts.push(`max-height:${COLLAPSED}px`);
      if (front !== undefined) parts.push(`transform:translate3d(0, calc(-${front}px + 100% + ${-STEP * p}px), -${p}px) scale(${1 - (p / 100) * 5})`);
    }
    parts.push(`--y:${-1 * (above || 0)}px`, `--z:-${p}px`);
    if (own !== undefined) parts.push(`--max-height:${own}px`);
    return parts.join(";");
  }

  private button(cls: string, label: string | undefined, onClick: () => void, content: unknown) {
    return html`<button class=${cls} type="button" tabindex="0" aria-label=${label ?? nothing} style="--acme-icon-size:16px" @click=${onClick}>${content}</button>`;
  }

  render() {
    const t = this.item;
    const type = t.type ?? "";
    const hasAction = t.action !== undefined;
    const dialog = !!t.cancelAction || hasAction;
    const cls = this.cls("toast", {
      shown: this.visible,
      hiding: this.hiding,
      success: type === "success",
      error: type === "error",
      warning: type === "warning",
      bleed: !!t.fullBleed,
      clip: !!t.overflowHidden || t.visual !== undefined,
      wide: !!t.hideX || !!t.fullWidth,
    });
    const v = t.visual;
    const visual = v === undefined ? nothing : html`<div class="visual" style=${sized(v) ? `height:${v.height}px` : nothing}>${sized(v) ? v.content : v}</div>`;
    const controls =
      hasAction || t.hideX
        ? nothing
        : html`<div class="controls">
            ${
              t.onUndoAction
                ? this.button(
                    "btn sm tertiary square icon undo",
                    "Undo",
                    () => {
                      t.onUndoAction?.();
                      this.hide();
                    },
                    glyph(UNDO),
                  )
                : nothing
            }${this.button("btn sm tertiary square icon close", "Dismiss toast", () => this.hide(true), glyph(CROSS))}
          </div>`;
    const act = () => {
      t.onAction?.();
      this.hide();
    };
    const actions = hasAction
      ? html`<div class="actions">
          ${this.button(
            "btn sm tertiary cancel",
            undefined,
            () => {
              this.hide();
              t.onCancelAction?.();
            },
            html`<span class="label">${t.cancelAction || "Dismiss"}</span>`,
          )}${
            t.actionHref
              ? html`<a class="btn sm link action" href=${t.actionHref} role="link" tabindex="0" style="--acme-icon-size:16px" @click=${act}><span class="label">${t.action}</span></a>`
              : this.button("btn sm action", undefined, act, html`<span class="label">${t.action}</span>`)
          }
        </div>`
      : nothing;
    return html`<div class=${cls} role=${dialog ? "alertdialog" : "status"} aria-atomic="true" aria-labelledby=${dialog ? "toast-message" : ""} ?data-expanded=${this.hovering} style=${this.geometry()} part="toast">
      <div class="body">
        ${visual}
        <div class="message" id="toast-message">${type === "success" || type === "error" ? html`<span class="sr">${type}: </span>` : nothing}<span class="text">${t.text}</span>${controls}</div>
        ${actions}
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-toast": AcmeToast;
  }
}
