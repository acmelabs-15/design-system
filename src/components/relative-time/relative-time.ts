import { DateFormatter, getLocalTimeZone } from "@internationalized/date";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import "../context-card/context-card";
import { atomState } from "../../shared/atom-state";
import { relativeTimeCardCss } from "./relative-time-card.styles";
import { relativeTimeLabelCss } from "./relative-time-label.styles";
import { relativeTimeTriggerCss } from "./relative-time-trigger.styles";

/** The side of the trigger the card opens on. */
export type RelativeTimeSide = "top" | "right" | "bottom" | "left";
/** Where the card sits along the trigger: its start edge, the middle, or its end edge. */
export type RelativeTimeAlign = "start" | "center" | "end";

const DAY = 864e5;
const HOUR = 36e5;
const MINUTE = 6e4;
/** The units of the full age, largest first, with their length in milliseconds. */
const UNITS: [string, number][] = [
  ["year", 31536e6],
  ["month", 2628e6],
  ["day", DAY],
  ["hour", HOUR],
  ["minute", MINUTE],
  ["second", 1e3],
];
/** The full age names this many units at most. */
const MAX_UNITS = 3;
/** The short age is refreshed this often; the full age, while the card can be seen, this often. */
const LABEL_TICK = MINUTE;
const AGE_TICK = 1e3;
const LOCALE = "en-US";
const plural = (n: number, unit: string) => `${n} ${unit}${n === 1 ? "" : "s"}`;

/** Every zone reads through one formatter per format; a zone's formatters are built once. */
const formatters = new Map<string, { abbr: DateFormatter; date: DateFormatter; time: DateFormatter }>();
const zoneFormatters = (timeZone: string) => {
  let f = formatters.get(timeZone);
  if (!f) {
    f = {
      abbr: new DateFormatter(LOCALE, { timeZone, timeZoneName: "short" }),
      date: new DateFormatter(LOCALE, { timeZone, year: "numeric", month: "long", day: "numeric" }),
      time: new DateFormatter(LOCALE, { timeZone, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    };
    formatters.set(timeZone, f);
  }
  return f;
};

/**
 * Relative time card: a moment shown as its age, with a hover card that gives the moment in full in
 * UTC and in the reader's zone. The trigger is the slotted content (a button, a link, a name) or,
 * with nothing slotted, the short age the element draws itself (`3 days ago`, `2 hours ago`,
 * `5 minutes ago`, `Just now`; refreshed every minute) as a 14px label in gray-900. The card is a
 * composed context card: it opens on hover after the card's own delay, on `side` (right by default)
 * at `align` (centre), `side-offset` (16) from the trigger and `align-offset` (0) along it; `shown`
 * opens it (the open bits, 1 for a hover), `disable-triggers` ignores the pointer, `hide` keeps it
 * closed, `inactive-timeout-ms` (250) is how long it stays after the pointer leaves, `no-padding`
 * drops its padding and `ignore-card-pointer-events` lets the pointer pass through it. Inside, a
 * column at least 300px wide: the full age in up to three units (`1 hour, 2 minutes, 3 seconds ago`,
 * in tabular figures, refreshed every second while the card can be seen), then a row per zone, UTC
 * first and the local zone second, each with the zone's abbreviation in a small monospace chip, the
 * date (`September 9, 2026`) and the clock time (`08:15:30 AM`) at the row's end. Dates and zones
 * read through `@internationalized/date`. `date` is the moment in epoch milliseconds; without one,
 * the slotted content stands alone and no card opens.
 */
@customElement("acme-relative-time")
export class AcmeRelativeTime extends AcmeElement {
  static styles = [sharedCss, relativeTimeTriggerCss, relativeTimeLabelCss, relativeTimeCardCss];
  /** The moment, in epoch milliseconds. */
  @property({ type: Number }) date = 0;
  @property() side: RelativeTimeSide = "right";
  @property() align: RelativeTimeAlign = "center";
  /** The card's distance from the trigger, in pixels. */
  @property({ type: Number, attribute: "side-offset" }) sideOffset = 16;
  /** The card's shift along the trigger, in pixels. */
  @property({ type: Number, attribute: "align-offset" }) alignOffset = 0;
  /** The pointer passes through the card. */
  @property({ type: Boolean, attribute: "ignore-card-pointer-events" }) ignoreCardPointerEvents = false;
  /** The card's content sits flush to its edge. */
  @property({ type: Boolean, attribute: "no-padding" }) noPadding = false;
  /** Keeps the card closed. */
  @property({ type: Boolean }) hide = false;
  /** How long the card stays after the pointer leaves, in milliseconds. */
  @property({ type: Number, attribute: "inactive-timeout-ms" }) inactiveTimeoutMs = 250;
  /** The card's open bits (1 for a hover); 0 leaves it to the pointer. */
  @property({ type: Number }) shown = 0;
  /** Ignores the pointer, so the card opens through `shown` alone. */
  @property({ type: Boolean, attribute: "disable-triggers" }) disableTriggers = false;
  /** The moment the ages are counted from, refreshed by the ticks. */
  @atomState() private now = Date.now();
  private labelTimer?: ReturnType<typeof setInterval>;
  private ageTimer?: ReturnType<typeof setInterval>;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("pointerenter", this.onEnter);
    this.addEventListener("pointerleave", this.onLeave);
    this.now = Date.now();
    this.labelTimer = setInterval(this.tick, LABEL_TICK);
    if (this.shown) this.startAge();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("pointerenter", this.onEnter);
    this.removeEventListener("pointerleave", this.onLeave);
    clearInterval(this.labelTimer);
    this.stopAge();
  }

  /** The short age of a moment: whole days, hours or minutes before `now`, or `Just now`; empty without a moment. */
  static shortAge(date: number, now = Date.now()): string {
    if (!date) return "";
    const diff = now - date;
    const days = Math.floor(diff / DAY);
    const hours = Math.floor(diff / HOUR);
    const minutes = Math.floor(diff / MINUTE);
    if (days > 0) return `${plural(days, "day")} ago`;
    if (hours > 0) return `${plural(hours, "hour")} ago`;
    if (minutes > 0) return `${plural(minutes, "minute")} ago`;
    return "Just now";
  }

  /** The full age of a moment: its distance from `now` in up to three units, largest first, or `Just now`. */
  static longAge(date: number, now = Date.now()): string {
    let left = Math.abs(now - date);
    const parts: string[] = [];
    for (const [unit, ms] of UNITS) {
      const n = Math.floor(left / ms);
      if (n > 0 || parts.length > 0) {
        parts.push(plural(n, unit));
        left %= ms;
      }
      if (parts.length === MAX_UNITS) break;
    }
    return parts.length ? `${parts.join(", ")} ago` : "Just now";
  }

  /** A moment in one zone: the zone's abbreviation (or its name), the date and the clock time. */
  static inZone(date: number, timeZone: string): { abbr: string; date: string; time: string } {
    const d = new Date(date);
    const f = zoneFormatters(timeZone);
    return {
      abbr: f.abbr.formatToParts(d).find((p) => p.type === "timeZoneName")?.value || timeZone,
      date: f.date.format(d),
      time: f.time.format(d),
    };
  }

  private tick = () => {
    this.now = Date.now();
  };

  /** While the card can be seen (the pointer inside, or `shown`), the full age counts every second. */
  private startAge() {
    if (this.ageTimer) return;
    this.tick();
    this.ageTimer = setInterval(this.tick, AGE_TICK);
  }

  private stopAge() {
    clearInterval(this.ageTimer);
    this.ageTimer = undefined;
  }

  private onEnter = () => this.startAge();

  private onLeave = () => {
    if (!this.shown) this.stopAge();
  };

  willUpdate(ch: Map<string, unknown>) {
    if (ch.has("shown")) {
      if (this.shown) this.startAge();
      else this.stopAge();
    }
    if (ch.has("date")) this.now = Date.now();
  }

  private row(timeZone: string) {
    const z = AcmeRelativeTime.inZone(this.date, timeZone);
    return html`<div class="row">
      <div class="place"><div class="chip"><span class="abbr">${z.abbr}</span></div><span class="date">${z.date}</span></div>
      <span class="clock">${z.time}</span>
    </div>`;
  }

  render() {
    // Without a moment there is no card: the slotted content stands alone.
    if (!this.date) return html`<slot></slot>`;
    return html`<acme-context-card
      .side=${this.side}
      .align=${this.align}
      .sideOffset=${this.sideOffset}
      .alignOffset=${this.alignOffset}
      .ignoreCardPointerEvents=${this.ignoreCardPointerEvents}
      .noPadding=${this.noPadding}
      .hide=${this.hide}
      .inactiveTimeoutMs=${this.inactiveTimeoutMs}
      .shown=${this.shown}
      .disableTriggers=${this.disableTriggers}
      exportparts="trigger, card"
      ><slot><span class="time">${AcmeRelativeTime.shortAge(this.date, this.now)}</span></slot>
      <div slot="content" class="content" part="content">
        <div class="ago"><span class="age">${AcmeRelativeTime.longAge(this.date, this.now)}</span></div>
        <div class="rows">${this.row("UTC")}${this.row(getLocalTimeZone())}</div>
      </div>
    </acme-context-card>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-relative-time": AcmeRelativeTime;
  }
}
