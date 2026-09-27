import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { statSurfaceCss } from "../../generated/shared/stat-surface.styles";
import { atomState } from "../../shared/atom-state";
import { numberAttribute, optionalString } from "../../shared/attributes";
import { message, messageCatalogs } from "../../shared/messages";
import { numberOptionsSnapshot } from "../../shared/number-options";
import { StatBinding } from "../../shared/stat-context";
import { StoreSelector } from "../../shared/store-connection";
/** A change whose direction and favorable meaning are explicitly separate.
 * @slot - Authored change text instead of formatted value.
 * @csspart root - Change definition.
 * @csspart change - Visible change layout.
 * @csspart indicator - Decorative direction icon.
 */
export class AcmeStatChange extends AcmeElement {
  static styles = [sharedCss, statSurfaceCss];
  @atomState() private orientation: "up" | "down" | "flat" | undefined;
  /** Supply the direction explicitly; omission does not infer it from a value. */
  @property({ noAccessor: true, converter: optionalString }) get direction() {
    return this.orientation;
  }
  set direction(value: "up" | "down" | "flat" | undefined) {
    if (value !== undefined && !["up", "down", "flat"].includes(value)) {
      throw new TypeError("Invalid Stat direction");
    }
    const previous = this.orientation;
    this.orientation = value;
    this.requestUpdate("direction", previous);
  }
  @atomState() private meaning: "positive" | "negative" | "neutral" = "neutral";
  /** @default "neutral" */
  @property({ noAccessor: true, useDefault: true }) get sentiment() {
    return this.meaning;
  }
  set sentiment(value: "positive" | "negative" | "neutral") {
    if (!["positive", "negative", "neutral"].includes(value)) {
      throw new TypeError("Invalid Stat sentiment");
    }
    const previous = this.meaning;
    this.meaning = value;
    this.requestUpdate("sentiment", previous);
  }
  @atomState() @property({ noAccessor: true, type: Number, converter: numberAttribute }) value?: number;
  @atomState() private numberOptions: Readonly<Intl.NumberFormatOptions> = Object.freeze({});
  /** Native number-format options; omission uses ordinary number formatting. @default {} */
  @property({ noAccessor: true, attribute: false }) get formatOptions() {
    return this.numberOptions;
  }
  set formatOptions(value: Intl.NumberFormatOptions | undefined) {
    const previous = this.numberOptions;
    this.numberOptions = numberOptionsSnapshot(value);
    this.requestUpdate("formatOptions", previous);
  }
  private readonly binding = new StatBinding(this);
  private readonly localeUpdates = new StoreSelector(this, () => this.themeContext.scope.effective);
  private readonly messageUpdates = new StoreSelector(this, () => messageCatalogs);
  private indicator() {
    return this.direction === "up"
      ? html`<acme-arrow-upward-icon size="1em"></acme-arrow-upward-icon>`
      : this.direction === "down"
        ? html`<acme-arrow-downward-icon size="1em"></acme-arrow-downward-icon>`
        : this.direction === "flat"
          ? html`<acme-horizontal-rule-icon size="1em"></acme-horizontal-rule-icon>`
          : nothing;
  }
  render() {
    const locale = this.themeContext.scope.effective.get().locale;
    const direction = this.direction ? message(locale, "stat.direction." + this.direction, { up: "Up", down: "Down", flat: "Unchanged" }[this.direction]) : "";
    const sentiment = message(locale, "stat.sentiment." + this.sentiment, { positive: "Favorable", negative: "Unfavorable", neutral: "Neutral" }[this.sentiment]);
    return html`<dd part="root" data-kind="change" ?hidden=${this.binding.loading}><span part="change" data-sentiment=${this.sentiment}><span class="sr">${[direction, sentiment].filter(Boolean).join(", ")}: </span><span part="indicator" aria-hidden="true">${this.indicator()}</span><slot>${this.value !== undefined ? html`<acme-format-number .value=${this.value} .options=${this.formatOptions}></acme-format-number>` : nothing}</slot></span></dd>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-stat-change": AcmeStatChange;
  }
}
