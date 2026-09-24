import { createAtom } from "@tanstack/lit-store";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { sparklineSurfaceCss } from "../../generated/components/sparkline/sparkline-surface.styles";
import { atomState } from "../../shared/atom-state";
import { optionalString } from "../../shared/attributes";
import { chartDefinition } from "../../shared/chart-definition";
import { ChartSurface } from "../../shared/chart-surface";
import { message, messageCatalogs } from "../../shared/messages";
import { StoreSelector } from "../../shared/store-connection";
/** Compact measured values. Omitted label makes the graphic decorative.
 * @csspart root - Sparkline container.
 * @csspart line - Value path.
 * @csspart fill - Decorative area beneath the path.
 */
export class AcmeSparkline extends AcmeElement {
  static styles = [sharedCss, sparklineSurfaceCss];
  @atomState() private data: readonly (number | null)[] = Object.freeze([]);
  /** @default [] */
  @property({ noAccessor: true, type: Array, useDefault: true }) get values() {
    return this.data;
  }
  set values(value: readonly (number | null)[]) {
    if (!Array.isArray(value) || value.some((item) => item !== null && typeof item !== "number")) throw new TypeError("Sparkline values require numbers or null gaps");
    const previous = this.data;
    this.data = Object.freeze([...value]);
    this.requestUpdate("values", previous);
  }
  @atomState() @property({ noAccessor: true, useDefault: true }) label = "";
  @atomState() private trend: "up" | "down" | "flat" | undefined;
  @property({ noAccessor: true, converter: optionalString }) get direction() {
    return this.trend;
  }
  set direction(value: "up" | "down" | "flat" | undefined) {
    if (value !== undefined && !["up", "down", "flat"].includes(value)) throw new TypeError("Invalid Sparkline direction");
    const previous = this.trend;
    this.trend = value;
    this.requestUpdate("direction", previous);
  }
  @atomState() private meaning: "positive" | "negative" | "neutral" = "neutral";
  /** @default "neutral" */
  @property({ noAccessor: true, useDefault: true }) get sentiment() {
    return this.meaning;
  }
  set sentiment(value: "positive" | "negative" | "neutral") {
    if (!["positive", "negative", "neutral"].includes(value)) throw new TypeError("Invalid Sparkline sentiment");
    const previous = this.meaning;
    this.meaning = value;
    this.requestUpdate("sentiment", previous);
  }
  private readonly prepared = createAtom(() =>
    chartDefinition({
      data: this.values.map((value, index) => ({ x: index, value })),
      series: [{ key: "value", label: this.label || "Value", color: "currentColor" }],
      x: "x",
      type: "line",
      points: false,
      grid: false,
      tooltip: false,
      sparkline: true,
    }),
  );
  private readonly updates = new StoreSelector(this, () => this.prepared);
  private readonly messages = new StoreSelector(this, () => messageCatalogs);
  private readonly plot = new ChartSurface(
    this,
    () => this.renderRoot?.querySelector<HTMLElement>("[part=root]") ?? undefined,
    () =>
      this.values.some((value) => typeof value === "number" && Number.isFinite(value))
        ? {
            definition: this.prepared.get().definition,
            height: 40,
            ariaLabel: this.label,
            ariaDescription: this.description,
            tabIndex: -1,
            onRender: ({ surface }) => {
              surface.element.setAttribute("aria-hidden", String(!this.label));
              surface.element.querySelectorAll(".ts-chart__line path,.ts-chart__line polyline").forEach((node) => node.setAttribute("part", "line"));
              surface.element.querySelectorAll(".ts-chart__area path,.ts-chart__area polygon").forEach((node) => node.setAttribute("part", "fill"));
            },
          }
        : undefined,
  );
  private get description() {
    const locale = this.themeContext.scope.effective.get().locale;
    const direction = this.direction ? message(locale, "stat.direction." + this.direction, { up: "Up", down: "Down", flat: "Unchanged" }[this.direction]) : "";
    const sentiment = message(locale, "stat.sentiment." + this.sentiment, { positive: "Favorable", negative: "Unfavorable", neutral: "Neutral" }[this.sentiment]);
    return [direction, sentiment].filter(Boolean).join(", ");
  }
  render() {
    return html`<span part="root" data-sentiment=${this.sentiment}></span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-sparkline": AcmeSparkline;
  }
}
