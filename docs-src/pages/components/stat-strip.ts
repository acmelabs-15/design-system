// Docs page: Stat Strip (house component)
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "stat-strip",
  title: "Stat Strip",
  lede: "Selectable figures across the top of a chart card; the selected one drives the chart.",
  tags: ["acme-stat-strip", "acme-strip-item"],
  house: true,
  examples: [
    {
      h: "Default",
      html: `<acme-stat-strip value="visitors"><acme-strip-item value="visitors" label="Visitors">2,847</acme-strip-item><acme-strip-item value="views" label="Page Views">9,120</acme-strip-item><acme-strip-item value="bounce" label="Bounce Rate">41%</acme-strip-item></acme-stat-strip>`,
    },
  ],
};
