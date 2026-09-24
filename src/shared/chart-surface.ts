import type { ChartRendererHost, ChartRendererHostOptions, ChartValue } from "@tanstack/charts";
import { mountChartRenderer } from "@tanstack/charts/renderer";
import { createSvgChartRenderer } from "@tanstack/charts/svg/renderer";
import type { ReactiveController, ReactiveElement } from "lit";
import type { ChartDatum } from "./chart-data";
export type ChartSurfaceOptions = Omit<ChartRendererHostOptions<ChartDatum, ChartValue, number>, "renderer">;
/** Owns one typed chart renderer and releases every engine resource with its host. */
export class ChartSurface implements ReactiveController {
  private readonly renderer = createSvgChartRenderer<ChartDatum, ChartValue, number>();
  private chart?: ChartRendererHost<ChartDatum, ChartValue, number>;
  private container?: HTMLElement;
  constructor(
    private host: ReactiveElement,
    private target: () => HTMLElement | undefined,
    private options: () => ChartSurfaceOptions | undefined,
  ) {
    host.addController(this);
  }
  hostUpdated() {
    if (!this.host.isConnected) return;
    const target = this.target(),
      options = this.options();
    if (!target || !options) {
      this.clear();
      return;
    }
    if (target !== this.container) this.clear();
    this.container = target;
    const complete = { ...options, renderer: this.renderer };
    if (this.chart) this.chart.update(complete);
    else this.chart = mountChartRenderer(target, complete);
  }
  private clear() {
    this.chart?.destroy();
    this.chart = undefined;
    this.container = undefined;
  }
  hostDisconnected() {
    this.clear();
  }
}
