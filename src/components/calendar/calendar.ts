import { css, html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base";
import { fieldCss } from "../../shared/field.styles";
import { buttonCss } from "../button/button.styles";
import { kbdCss } from "../kbd/kbd.styles";
import { calendarCss } from "./calendar.styles";

/** A preset range: fixed `start`/`end` (Date or ISO), or relative to now with `days`, `weeks` or `months` back. */
export type CalendarPreset = { text: string; start?: Date | string; end?: Date | string; days?: number; weeks?: number; months?: number };
export type CalendarPresets = Record<string, CalendarPreset> | CalendarPreset[];
type Resolved = { key: string; text: string; start: Date; end: Date };

const ZONES = [
  "UTC",
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const toDate = (v: Date | string | undefined | null): Date | null => {
  if (!v) return null;
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(v);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const fmt = (s: string, year = true) => {
  const d = toDate(s);
  return d ? d.toLocaleDateString("en-US", { month: "short", day: "numeric", ...(year ? { year: "numeric" } : {}) }) : s;
};

/** Geist Calendar: a date-range picker behind a secondary trigger labelled with the chosen range; a 280px popover with Start / End inputs, a timezone select, Apply, and the month grid (32px cells, blue-900 selection). Presets are real buttons; `compact` and `stacked` join a period combobox to the trigger; `horizontal-layout` puts the form beside the grid. */
@customElement("acme-calendar")
export class AcmeCalendar extends AcmeElement {
  static styles = [
    sharedCss,
    calendarCss,
    fieldCss,
    buttonCss,
    kbdCss,
    css`
      :host {
        display: inline-block;
        position: relative;
      }
      .calendar {
        display: none;
      }
      :host([open]) .calendar {
        display: flex;
      }
      :host([static]) .calendar {
        display: flex;
        position: static;
      }
      .field {
        margin: 0;
      }
      .cal-trigger {
        gap: 8px;
      }
    `,
  ];
  /** The start date (ISO `YYYY-MM-DD`). */
  @property() value = "";
  /** The end date (ISO). */
  @property() end = "";
  /** The earliest pickable date (ISO or any Date string). */
  @property({ attribute: "min-value" }) minValue = "";
  /** The latest pickable date. */
  @property({ attribute: "max-value" }) maxValue = "";
  /** Pick one date instead of a range. */
  @property({ type: Boolean }) single = false;
  /** A clear button next to the trigger once a value is set. */
  @property({ type: Boolean, attribute: "allow-clear" }) allowClear = false;
  /** Form beside the month grid instead of above it. */
  @property({ type: Boolean, attribute: "horizontal-layout" }) horizontalLayout = false;
  /** Joins a period combobox to the left of the trigger. */
  @property({ type: Boolean }) compact = false;
  /** Stacks the period combobox above the trigger. */
  @property({ type: Boolean }) stacked = false;
  /** medium (default) or small: a 32px trigger and 28px day cells. */
  @property() size: "medium" | "small" = "medium";
  /** Common ranges: `{ "last-7-days": { "text": "Last 7 Days", "days": 7 } }` or an array; `start`/`end` may be fixed dates. */
  @property({ type: Object }) presets: CalendarPresets = {};
  /** The preset selected at first render (0-based). */
  @property({ type: Number, attribute: "preset-index" }) presetIndex = -1;
  /** Start and end time inputs in the form; `show-time-input="false"` hides them. */
  @property({ attribute: "show-time-input", converter: (v: string | null) => v !== "false" && v !== null }) showTimeInput = true;
  /** Where the popover aligns to the trigger: start · center · end. */
  @property({ attribute: "popover-alignment" }) popoverAlignment: "start" | "center" | "end" = "start";
  /** Locks the timezone; it shows as read-only text instead of a select. */
  @property({ attribute: "pinned-timezone" }) pinnedTimezone = "";
  @property({ type: Boolean, reflect: true }) open = false;
  /** Renders the popover inline and always open (for docs and tests). */
  @property({ type: Boolean, reflect: true }) static = false;
  @property() placeholder = "Select Date";
  @state() private view = startOfDay(new Date());
  @state() private focusDate = iso(new Date());
  @state() private announce = "";
  @state() private presetKey = "";
  @state() private tz = typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC";
  @state() private startTime = "12:00 AM";
  @state() private endTime = "11:59 PM";
  @query(".cal-trigger") private trigger!: HTMLButtonElement;
  @query(".calendar") private pop!: HTMLElement & { showPopover?: () => void; hidePopover?: () => void };
  private appliedPreset = false;
  private onDoc = (e: Event) => {
    if (this.open && !e.composedPath().includes(this)) this.open = false;
  };
  private onWin = () => {
    if (this.open) this.place();
  };
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this.onDoc);
    window.addEventListener("resize", this.onWin);
    window.addEventListener("scroll", this.onWin, true);
    const d = toDate(this.value);
    if (d) {
      this.view = new Date(d.getFullYear(), d.getMonth(), 1);
      this.focusDate = iso(d);
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this.onDoc);
    window.removeEventListener("resize", this.onWin);
    window.removeEventListener("scroll", this.onWin, true);
  }
  /** The presets in order, with concrete dates. */
  get presetList(): Resolved[] {
    const now = new Date();
    const entries: [string, CalendarPreset][] = Array.isArray(this.presets) ? this.presets.map((p, i) => [String(i), p]) : Object.entries(this.presets ?? {});
    return entries.map(([key, p]) => {
      let start = toDate(p.start);
      let end = toDate(p.end) ?? endOfDay(now);
      if (!start) {
        if (p.months) start = startOfDay(new Date(now.getFullYear(), now.getMonth() - p.months, now.getDate()));
        else start = startOfDay(addDays(now, -((p.days ?? 0) + (p.weeks ?? 0) * 7)));
      }
      if (!p.end && toDate(p.start)) end = endOfDay(now);
      return { key, text: p.text, start, end };
    });
  }
  willUpdate(ch: Map<string, unknown>) {
    if (!this.appliedPreset && this.presetIndex >= 0) {
      const p = this.presetList[this.presetIndex];
      if (p) {
        this.appliedPreset = true;
        this.applyPreset(p, false);
      }
    }
    if (ch.has("value") && this.value) {
      const d = toDate(this.value);
      if (d && !this.open) this.view = new Date(d.getFullYear(), d.getMonth(), 1);
    }
  }
  updated(ch: Map<string, unknown>) {
    if (!ch.has("open") || this.static) return;
    if (this.open) {
      try {
        this.pop.showPopover?.();
      } catch {}
      this.place();
      const d = toDate(this.value) ?? new Date();
      this.view = new Date(d.getFullYear(), d.getMonth(), 1);
      requestAnimationFrame(() => (this.pop.querySelector<HTMLElement>("input,button,select,[tabindex='0']") ?? this.pop).focus());
    } else {
      try {
        this.pop.hidePopover?.();
      } catch {}
      if (ch.get("open") === true) this.trigger?.focus();
    }
  }
  private place() {
    const t = this.trigger;
    const p = this.pop;
    if (!t || !p || this.static) return;
    const r = t.getBoundingClientRect();
    const w = p.offsetWidth || 280;
    let left = r.left;
    if (this.popoverAlignment === "center") left = r.left + r.width / 2 - w / 2;
    else if (this.popoverAlignment === "end") left = r.right - w;
    left = Math.max(8, Math.min(left, (window.innerWidth || 1e4) - w - 8));
    p.style.top = `${r.bottom + 8}px`;
    p.style.left = `${left}px`;
  }
  private disabled(v: string) {
    const min = toDate(this.minValue);
    const max = toDate(this.maxValue);
    return (min && v < iso(min)) || (max && v > iso(max)) || false;
  }
  private pick(d: Date) {
    const v = iso(d);
    this.focusDate = v;
    this.presetKey = "";
    if (this.single) {
      this.value = v;
      this.announce = fmt(v);
      this.commit();
      return;
    }
    if (!this.value || this.end) {
      this.value = v;
      this.end = "";
      this.announce = `From ${fmt(v)}`;
    } else {
      if (v < this.value) {
        this.end = this.value;
        this.value = v;
      } else this.end = v;
      this.announce = `From ${fmt(this.value)} to ${fmt(this.end)}`;
    }
  }
  private applyPreset(p: Resolved, close = true) {
    this.presetKey = p.key;
    this.value = iso(p.start);
    this.end = iso(p.end);
    this.focusDate = this.value;
    this.announce = `${p.text}: from ${fmt(this.value)} to ${fmt(this.end)}`;
    this.commit(close);
  }
  private commit = (close = true) => {
    this.dispatchEvent(
      new CustomEvent("acme-change", {
        detail: { value: this.value, end: this.end, start: this.value, startTime: this.startTime, endTime: this.endTime, timezone: this.pinnedTimezone || this.tz, preset: this.presetKey || null },
        bubbles: true,
        composed: true,
      }),
    );
    if (close && !this.static) this.open = false;
  };
  private clear = () => {
    this.value = "";
    this.end = "";
    this.presetKey = "";
    this.announce = "Cleared";
    this.commit(false);
  };
  private label() {
    if (!this.value) return this.placeholder;
    if (this.single || !this.end) return fmt(this.value);
    const sameYear = this.value.slice(0, 4) === this.end.slice(0, 4);
    return `${fmt(this.value, !sameYear)} – ${fmt(this.end)}`;
  }
  private move(days: number, months = 0) {
    const d = toDate(this.focusDate) ?? new Date();
    const n = months ? new Date(d.getFullYear(), d.getMonth() + months, d.getDate()) : addDays(d, days);
    this.focusDate = iso(n);
    this.view = new Date(n.getFullYear(), n.getMonth(), 1);
    this.updateComplete.then(() => this.pop.querySelector<HTMLElement>('.cal-grid [tabindex="0"]')?.focus());
  }
  private onGridKey = (e: KeyboardEvent) => {
    const week = e.shiftKey ? 7 : 1;
    const map: Record<string, () => void> = {
      ArrowLeft: () => this.move(-week),
      ArrowRight: () => this.move(week),
      ArrowUp: () => this.move(-7),
      ArrowDown: () => this.move(7),
      PageUp: () => this.move(0, -1),
      PageDown: () => this.move(0, 1),
      Home: () => this.move(-(toDate(this.focusDate)?.getDay() ?? 0)),
      End: () => this.move(6 - (toDate(this.focusDate)?.getDay() ?? 0)),
      Enter: () => {
        const d = toDate(this.focusDate);
        if (d && !this.disabled(this.focusDate)) this.pick(d);
      },
    };
    const fn = map[e.key === " " ? "Enter" : e.key];
    if (!fn) return;
    e.preventDefault();
    fn();
  };
  private onPopKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      if (!this.static) this.open = false;
      return;
    }
    if (e.key !== "Tab") return;
    const items = Array.from(this.pop.querySelectorAll<HTMLElement>("input,select,button:not([disabled]),[tabindex='0']")).filter((el) => el.offsetParent !== null || this.static);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = this.shadowRoot?.activeElement;
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };
  private onPeriod = (e: Event) => {
    const key = (e.target as HTMLSelectElement).value;
    const p = this.presetList.find((x) => x.key === key);
    if (p) this.applyPreset(p, false);
    else this.presetKey = "";
  };
  render() {
    const y = this.view.getFullYear();
    const m = this.view.getMonth();
    const first = new Date(y, m, 1);
    const start = addDays(first, -first.getDay());
    const today = iso(new Date());
    const cells = Array.from({ length: 42 }, (_, i) => addDays(start, i));
    const sm = this.size === "small";
    const presets = this.presetList;
    const joined = this.compact || this.stacked || (this.allowClear && !!this.value);
    const trigger = html`<button class=${this.cls("btn", { "cal-trigger": true, sm })} type="button" aria-haspopup="dialog" aria-expanded=${this.open} @click=${() => {
      this.open = !this.open;
    }}>${glyph("calendar")}${this.label()}</button>`;
    const period =
      this.compact || this.stacked
        ? html`<select class=${this.cls("cal-period", { sm })} aria-label="Period" .value=${this.presetKey} @change=${this.onPeriod}><option value="">Custom</option>${presets.map(
            (p) => html`<option value=${p.key} ?selected=${p.key === this.presetKey}>${p.text}</option>`,
          )}</select>`
        : nothing;
    const clear =
      this.allowClear && this.value ? html`<button class=${this.cls("btn", { "cal-clear": true, sm })} type="button" aria-label="Clear" @click=${this.clear}>${glyph("x")}</button>` : nothing;
    const head = joined ? html`<div class=${this.cls("cal-join", { stacked: this.stacked, sm })}>${period}${trigger}${clear}</div>` : trigger;
    const form = this.single
      ? nothing
      : html`<div class="cal-form">
          <span class="form-label">Start</span>
          <div class="field"><input type="text" .value=${this.value} placeholder="YYYY-MM-DD" aria-label="Start date" @change=${(e: Event) => {
            this.value = (e.target as HTMLInputElement).value;
            this.presetKey = "";
          }}>${
            this.showTimeInput
              ? html`<input class="time" type="text" .value=${this.startTime} aria-label="Start time" @change=${(e: Event) => {
                  this.startTime = (e.target as HTMLInputElement).value;
                }}>`
              : nothing
          }</div>
          <span class="form-label">End</span>
          <div class="field"><input type="text" .value=${this.end} placeholder="YYYY-MM-DD" aria-label="End date" @change=${(e: Event) => {
            this.end = (e.target as HTMLInputElement).value;
            this.presetKey = "";
          }}>${
            this.showTimeInput
              ? html`<input class="time" type="text" .value=${this.endTime} aria-label="End time" @change=${(e: Event) => {
                  this.endTime = (e.target as HTMLInputElement).value;
                }}>`
              : nothing
          }</div>
          <button class="btn" type="button" @click=${() => this.commit()}>Apply <kbd class="kbd sm">↵</kbd></button>
          ${
            this.pinnedTimezone
              ? html`<span class="cal-tz" aria-label="Timezone">${this.pinnedTimezone}</span>`
              : html`<select aria-label="Timezone" .value=${this.tz} @change=${(e: Event) => {
                  this.tz = (e.target as HTMLSelectElement).value;
                }}>${[this.tz, ...ZONES.filter((z) => z !== this.tz)].map((z) => html`<option value=${z}>${z}</option>`)}</select>`
          }
        </div>`;
    const grid = html`<div class="cal-main">
        ${
          presets.length && !this.compact && !this.stacked
            ? html`<div class="cal-presets" role="group" aria-label="Presets">${presets.map((p) => html`<button class="btn" type="button" aria-pressed=${p.key === this.presetKey} @click=${() => this.applyPreset(p)}>${p.text}</button>`)}</div>`
            : nothing
        }
        <div class="cal-head"><h2 class="month" aria-live="polite">${this.view.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h2><button class="iconbtn" type="button" aria-label="Previous month" @click=${() => {
          this.view = new Date(y, m - 1, 1);
        }}>${glyph("back")}</button><button class="iconbtn next" type="button" aria-label="Next month" @click=${() => {
          this.view = new Date(y, m + 1, 1);
        }}>${glyph("arrow")}</button></div>
        <table class="cal-grid" role="grid" aria-multiselectable=${!this.single} @keydown=${this.onGridKey}><thead><tr>${DAYS.map((d) => html`<th abbr=${d} scope="col">${d[0]}</th>`)}</tr></thead><tbody>
          ${Array.from(
            { length: 6 },
            (_, w) =>
              html`<tr>${cells.slice(w * 7, w * 7 + 7).map((d) => {
                const v = iso(d);
                const out = d.getMonth() !== m;
                const inRange = !this.single && this.value && this.end && v > this.value && v < this.end;
                const sel = v === this.value || (!this.single && v === this.end);
                const dis = this.disabled(v);
                return html`<td class=${this.cls("", { out, far: out && w > 3, range: !!inRange, start: !this.single && v === this.value && !!this.end, end: !this.single && v === this.end, selected: sel && (this.single || !this.end), today: v === today })} role="gridcell" aria-selected=${sel} aria-disabled=${dis ? "true" : nothing}><span role="button" tabindex=${v === this.focusDate ? "0" : "-1"} aria-label=${d.toDateString()} @click=${() => {
                  if (!dis) this.pick(d);
                }}>${d.getDate()}</span></td>`;
              })}</tr>`,
          )}
        </tbody></table>
      </div>`;
    return html`${head}
      <div class=${this.cls("calendar", { sm, horizontal: this.horizontalLayout })} role="dialog" aria-label="Calendar" aria-modal=${this.static ? nothing : "true"} popover=${this.static ? nothing : "manual"} part="calendar" @keydown=${this.onPopKey}>
        ${form}${grid}
        <span class="sr" aria-live="polite">${this.announce}</span>
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-calendar": AcmeCalendar;
  }
}
