import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { tooltipCss } from "../tooltip/tooltip.styles.js";
import { relativeTimeCss } from "./relative-time.styles.js";

/** Geist Relative Time Card: the short form (2m, 5h, Yesterday) with a hover card of UTC and local time. */
@customElement("acme-relative-time")
export class AcmeRelativeTime extends AcmeElement {
  static styles = [
    sharedCss,
    relativeTimeCss,
    tooltipCss,
    css`:host{display:inline-block;position:relative} .time-card{position:absolute;left:50%;bottom:calc(100% + 10px);transform:translateX(-50%);opacity:0;pointer-events:none;transition:opacity var(--dur) var(--ease) .15s;z-index:30} :host([open]) .time-card{opacity:1} :host([static]) .time-card{position:static;transform:none;opacity:1}`,
  ];
  @property({ type: Number }) date = Date.now();
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean, reflect: true }) static = false;
  private timer = 0;
  connectedCallback() {
    super.connectedCallback();
    this.timer = window.setInterval(() => this.requestUpdate(), 30000);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.timer);
  }
  static short(ms: number, now = Date.now()): string {
    const d = Math.round((now - ms) / 1000);
    if (d < 60) return "Just now";
    const m = Math.round(d / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.round(m / 60);
    if (h < 24) return `${h}h ago`;
    const days = Math.round(h / 24);
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return new Date(ms).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }
  static long(ms: number, now = Date.now()): string {
    const s = Math.round((now - ms) / 1000);
    if (s < 60) return `${s} seconds ago`;
    const m = Math.round(s / 60);
    if (m < 60) return `${m} minutes ago`;
    const h = Math.round(m / 60);
    if (h < 24) return `${h} hours ago`;
    return `${Math.round(h / 24)} days ago`;
  }
  render() {
    const d = new Date(this.date);
    const row = (tz: string, timeZone?: string) =>
      html`<span class="zone"><span class="tz">${tz}</span>${d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone })}<span class="t">${d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone })}</span></span>`;
    const local = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localAbbr = d.toLocaleTimeString("en-US", { timeZoneName: "short" }).split(" ").pop() ?? "Local";
    return html`<span class="reltime" tabindex="0" @mouseenter=${() => {
      this.open = true;
    }} @mouseleave=${() => {
      this.open = false;
    }} @focus=${() => {
      this.open = true;
    }} @blur=${() => {
      this.open = false;
    }}><slot>${AcmeRelativeTime.short(this.date)}</slot></span><div class="time-card" role="tooltip"><span class="ago">${AcmeRelativeTime.long(this.date)}</span>${row("UTC", "UTC")}${row(localAbbr, local)}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-relative-time": AcmeRelativeTime;
  }
}
