import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { boolish } from "../../base";
import { AcmeFormattingElement } from "../../shared/formatting-element";
import { atomState } from "../../shared/atom-state";
import { relativeInstant, relativeDateAttribute, relativeState, type RelativeDate } from "../../shared/relative-time";

/** Locale-sensitive elapsed time with a native absolute datetime.
 * @csspart root - The native time element, present for valid dates.
 */
export class AcmeRelativeTime extends AcmeFormattingElement {
  @atomState() private instant?: number;
  @property({ noAccessor: true, converter: relativeDateAttribute })
  get date(): RelativeDate | undefined {
    return this.instant;
  }
  set date(value: RelativeDate | undefined) {
    const previous = this.instant;
    this.instant = relativeInstant(value);
    this.requestUpdate("date", previous);
  }
  @atomState() @property({ noAccessor: true, useDefault: true }) numeric: Intl.RelativeTimeFormatNumeric = "auto";
  @atomState() @property({ noAccessor: true, useDefault: true }) format: Intl.RelativeTimeFormatStyle = "long";
  @atomState() @property({ noAccessor: true, attribute: "auto-update", converter: boolish, useDefault: true }) autoUpdate = true;
  private nextChange?: number;
  private timer?: { view: Window; id: number };
  private stop(): void {
    if (this.timer) {
      this.timer.view.clearTimeout(this.timer.id);
    }
    this.timer = undefined;
  }
  private schedule(): void {
    this.stop();
    const view = this.ownerDocument.defaultView;
    if (!view || !this.isConnected || !this.autoUpdate || this.nextChange === undefined) {
      return;
    }
    const remaining = this.nextChange - Date.now();
    this.timer = {
      view,
      id: view.setTimeout(
        () => {
          this.timer = undefined;
          if (!this.isConnected || !this.autoUpdate) {
            return;
          }
          if (this.nextChange !== undefined && Date.now() < this.nextChange) {
            this.schedule();
          } else {
            this.requestUpdate();
          }
        },
        Math.max(0, Math.min(2147483647, remaining)),
      ),
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.requestUpdate();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.stop();
  }
  updated() {
    this.schedule();
  }
  render() {
    this.nextChange = undefined;
    if (this.instant === undefined || !Number.isFinite(this.instant)) {
      this.diagnostic(this.instant === undefined ? "missing-relative-date" : "invalid-relative-date");
      return nothing;
    }
    try {
      const state = relativeState(this.instant, Date.now(), this.numeric),
        text = new Intl.RelativeTimeFormat(this.formatLocale, { numeric: this.numeric, style: this.format }).format(state.value, state.unit);
      this.nextChange = state.nextChange;
      this.clearDiagnostic();
      return html`<time part="root" datetime=${new Date(this.instant).toISOString()}>${text}</time>`;
    } catch {
      this.diagnostic("invalid-relative-format");
      return nothing;
    }
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-relative-time": AcmeRelativeTime;
  }
}
