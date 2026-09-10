import { css, html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { AcmeElement, sharedCss } from "../../base";
import { type ToastQueue, toasts } from "../../shared/state";
import { toasterCss } from "./toaster.styles";
import "../toast/toast";

export type { ToastItem, ToastOptions, ToastQueue, ToastText, ToastType, ToastVisual } from "../../shared/state";
export { createToastQueue, toasts } from "../../shared/state";

/**
 * The toast viewport: a fixed area a gap (24px) from the bottom right corner of the window, in
 * the top layer, that stacks the toasts of its queue newest in front. It rises 10px once it holds
 * more than one toast, and moves to calc(50% - 210px) from the right (half a toast's width) with
 * `center`. The pointer over the area (or a touch on it) expands the stack and pauses the
 * toasts' timers. On a touch screen the area keeps clear of the keyboard by the visual
 * viewport's height. It renders the shared `toasts` queue unless `queue` names another; of
 * several viewports on one queue the first connected renders, and the next takes over when it
 * leaves.
 */
@customElement("acme-toaster")
export class AcmeToaster extends AcmeElement {
  static styles = [
    sharedCss,
    css`
      /* The area is a manual popover in the top layer, so it overlays every dialog: the browser's own box for one (inset, centred, bordered, padded, clipping, on a canvas fill) gives way to a bare box the area's own rules place. */
      .area {
        inset: auto;
        margin: 0;
        border: 0;
        padding: 0;
        width: auto;
        height: auto;
        overflow: visible;
        background: transparent;
        color: inherit;
      }
    `,
    toasterCss,
  ];
  /** The queue this viewport shows: the shared `toasts` unless set. */
  @property({ attribute: false }) queue: ToastQueue = toasts;
  /** Centers the area: calc(50% - 210px) from the right. */
  @property({ type: Boolean, reflect: true }) center = false;
  @state() private hovering = false;
  /** The height the on-screen keyboard takes from the window. */
  @state() private offsetBottom = 0;
  @query(".area") private area?: HTMLElement;
  private shownArea?: HTMLElement;
  /** The queue this viewport is attached to and listens to; `queue` may change before the next update. */
  private bound?: ToastQueue;
  private unsubscribe?: () => void;

  connectedCallback() {
    super.connectedCallback();
    this.bind();
    window.visualViewport?.addEventListener("resize", this.onViewport);
    this.onViewport();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unbind();
    window.visualViewport?.removeEventListener("resize", this.onViewport);
  }

  private bind() {
    if (this.bound === this.queue) return;
    this.unbind();
    const q = this.queue;
    this.bound = q;
    q.attach(this);
    const sub = q.store.subscribe(() => this.requestUpdate());
    this.unsubscribe = () => sub.unsubscribe();
  }

  private unbind() {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
    this.bound?.detach(this);
    this.bound = undefined;
  }

  private onViewport = () => {
    const vv = window.visualViewport;
    if (vv?.height) this.offsetBottom = window.innerHeight - vv.height;
  };

  private enter = () => {
    this.hovering = true;
  };

  private leave = () => {
    this.hovering = false;
  };

  willUpdate(ch: Map<string, unknown>) {
    if (ch.has("queue") && this.isConnected) this.bind();
  }

  updated() {
    const area = this.area;
    if (area === this.shownArea) return;
    this.shownArea = area;
    // The area joins the top layer as it mounts; a runtime without popovers keeps it in the tree.
    if (area && typeof area.showPopover === "function" && !area.matches(":popover-open")) area.showPopover();
  }

  render() {
    if (!this.queue.renders(this)) return nothing;
    const list = this.queue.store.state;
    if (!list.length) return nothing;
    // The heights the front toast first: each toast reads its own at its position, and those in front of it.
    const heights = list.map((t) => t.height).reverse();
    return html`<div
      class=${this.cls("area", { center: this.center, stacked: list.length > 1 })}
      popover="manual"
      style=${`--offset-bottom:${this.offsetBottom}px`}
      @mouseenter=${this.enter}
      @mouseleave=${this.leave}
      @touchstart=${this.enter}
      @touchend=${this.leave}
      part="area"
    >
      ${repeat(
        list,
        (t) => t.key,
        (t, i) => html`<acme-toast .item=${t} .queue=${this.queue} .position=${list.length - i - 1} .heights=${heights} .hovering=${this.hovering}></acme-toast>`,
      )}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-toaster": AcmeToaster;
  }
}
