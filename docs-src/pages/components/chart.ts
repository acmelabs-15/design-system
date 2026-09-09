// Docs page: Chart (house component)
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "chart",
  title: "Chart",
  lede: "A chart frame: the plot is a slotted inline SVG; the frame draws the head, the legend and the tooltip.",
  tags: ["acme-chart", "acme-legend", "acme-legend-item"],
  house: true,
  examples: [
    {
      h: "Line chart",
      html: `<acme-chart height="160"><acme-panel-head slot="head" heading="Requests" sub="Last 7 days"></acme-panel-head><svg viewBox="0 0 600 160" preserveAspectRatio="none" style="width:100%;height:100%"><polyline fill="none" stroke="var(--chart-1)" stroke-width="2" points="0,120 100,90 200,100 300,60 400,70 500,30 600,40"/><polyline fill="none" stroke="var(--chart-2)" stroke-width="2" points="0,140 100,130 200,120 300,110 400,100 500,90 600,80"/></svg><acme-legend slot="legend"><acme-legend-item series="1" value="12.4k">Edge</acme-legend-item><acme-legend-item series="2" value="3.1k">Serverless</acme-legend-item></acme-legend></acme-chart>`,
    },
    {
      h: "Legend list",
      html: `<acme-legend list><acme-legend-item hue="green" value="82%">Ready</acme-legend-item><acme-legend-item hue="amber" value="12%">Building</acme-legend-item><acme-legend-item hue="red" value="6%">Error</acme-legend-item></acme-legend>`,
    },
  ],
};
