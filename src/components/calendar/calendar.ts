import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base.js";
import { fieldCss } from "../../shared/field.styles.js";
import { buttonCss } from "../button/button.styles.js";
import { kbdCss } from "../kbd/kbd.styles.js";
import { calendarCss } from "./calendar.styles.js";

/** Geist Calendar: a date or range picker in a popover behind a secondary button. Values are ISO dates. */
@customElement("acme-calendar")
export class AcmeCalendar extends AcmeElement {
  static styles = [
    sharedCss,
    calendarCss,
    fieldCss,
    buttonCss,
    kbdCss,
    css`:host{display:inline-block;position:relative} .calendar{position:absolute;top:calc(100% + 10px);left:0;z-index:20;display:none} :host([open]) .calendar{display:flex} :host([static]) .calendar{display:flex;position:static} .field{margin:0}`,
  ];
  @property({ type: Boolean }) range = false;
  @property() value = "";
  @property() end = "";
  @property() min = "";
  @property() max = "";
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean, reflect: true }) static = false;
  @property({ type: Boolean }) time = false;
  @property() placeholder = "Select Date";
  @property({ type: Array }) presets: { label: string; days: number }[] = [];
  private view = new Date();
  private onDoc = (e: Event) => {
    if (!e.composedPath().includes(this)) this.open = false;
  };
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this.onDoc);
    if (this.value) this.view = new Date(this.value);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this.onDoc);
  }
  private iso(d: Date) {
    return d.toISOString().slice(0, 10);
  }
  private pick(d: Date) {
    const v = this.iso(d);
    if (!this.range) {
      this.value = v;
      this.commit();
      return;
    }
    if (!this.value || (this.value && this.end)) {
      this.value = v;
      this.end = "";
    } else if (v < this.value) {
      this.end = this.value;
      this.value = v;
    } else this.end = v;
    this.requestUpdate();
  }
  private commit() {
    this.dispatchEvent(new CustomEvent("acme-change", { detail: { value: this.value, end: this.end }, bubbles: true, composed: true }));
    if (!this.static) this.open = false;
  }
  private label() {
    const f = (s: string) => new Date(`${s}T00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    if (!this.value) return this.placeholder;
    return this.range && this.end ? `${f(this.value)} – ${f(this.end)}` : f(this.value);
  }
  render() {
    const y = this.view.getFullYear(),
      m = this.view.getMonth();
    const first = new Date(y, m, 1);
    const start = new Date(y, m, 1 - first.getDay());
    const today = this.iso(new Date());
    const cells = Array.from({ length: 42 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
    const disabled = (v: string) => (this.min && v < this.min) || (this.max && v > this.max);
    return html`<button class="btn" aria-haspopup="dialog" aria-expanded=${this.open} @click=${() => {
      this.open = !this.open;
    }}>${glyph("calendar")}${this.label()}</button>
      <div class="calendar" role="dialog" aria-label="Calendar" part="calendar">
        ${
          this.range
            ? html`<div class="cal-form"><span class="form-label">Start</span><div class="field"><input type="text" .value=${this.value} aria-label="Start date" @change=${(e: Event) => {
                this.value = (e.target as HTMLInputElement).value;
              }}>${this.time ? html`<input class="time" type="text" value="12:00 AM" aria-label="Start time">` : nothing}</div><span class="form-label">End</span><div class="field"><input type="text" .value=${this.end} aria-label="End date" @change=${(
                e: Event,
              ) => {
                this.end = (e.target as HTMLInputElement).value;
              }}>${this.time ? html`<input class="time" type="text" value="11:59 PM" aria-label="End time">` : nothing}</div><button class="btn" @click=${this.commit}>Apply <kbd class="kbd sm">↵</kbd></button></div>`
            : nothing
        }
        ${
          this.presets.length
            ? html`<div class="cal-presets">${this.presets.map(
                (p) =>
                  html`<button class="btn sm" @click=${() => {
                    const e = new Date(),
                      s = new Date();
                    s.setDate(e.getDate() - p.days);
                    this.value = this.iso(s);
                    this.end = this.iso(e);
                    this.commit();
                  }}>${p.label}</button>`,
              )}</div>`
            : nothing
        }
        <div class="cal-head"><span class="month">${this.view.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span><button class="iconbtn" aria-label="Previous" @click=${() => {
          this.view = new Date(y, m - 1, 1);
          this.requestUpdate();
        }}>${glyph("back")}</button><button class="iconbtn" aria-label="Next" @click=${() => {
          this.view = new Date(y, m + 1, 1);
          this.requestUpdate();
        }}>${glyph("arrow")}</button></div>
        <table class="cal-grid" role="grid" aria-multiselectable=${this.range}><thead><tr>${["S", "M", "T", "W", "T", "F", "S"].map((d, i) => html`<th abbr=${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][i]}>${d}</th>`)}</tr></thead><tbody>
          ${Array.from(
            { length: 6 },
            (_, w) =>
              html`<tr>${cells.slice(w * 7, w * 7 + 7).map((d) => {
                const v = this.iso(d);
                const out = d.getMonth() !== m;
                const inRange = this.range && this.value && this.end && v > this.value && v < this.end;
                const sel = v === this.value || v === this.end;
                return html`<td class=${this.cls("", { out, far: out && w > 3, range: !!inRange, start: this.range && v === this.value && !!this.end, end: this.range && v === this.end, selected: sel && !(this.range && this.end), today: v === today })} role="gridcell" aria-selected=${sel} aria-disabled=${disabled(v) ? "true" : nothing}><span role="button" tabindex="-1" aria-label=${d.toDateString()} @click=${() => {
                  if (!disabled(v)) this.pick(d);
                }}>${d.getDate()}</span></td>`;
              })}</tr>`,
          )}
        </tbody></table>
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-calendar": AcmeCalendar;
  }
}
