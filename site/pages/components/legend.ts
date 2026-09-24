import type { Doc } from "../../site";
export const doc: Doc = {
  id: "legend",
  title: "Legend",
  lede: "Readable labels for application-owned series and colors.",
  tags: ["acme-legend", "acme-legend-item"],
  examples: [
    {
      h: "Horizontal",
      html: '<acme-legend><acme-legend-item value="edge" label="Edge" color="var(--chart-1)"></acme-legend-item><acme-legend-item value="serverless" label="Serverless" color="var(--chart-2)"></acme-legend-item></acme-legend>',
    },
    {
      h: "Vertical",
      html: '<acme-legend orientation="vertical"><acme-legend-item value="requests" label="Requests" color="var(--chart-1)"></acme-legend-item><acme-legend-item value="errors" label="Errors" color="var(--chart-4)"></acme-legend-item></acme-legend>',
    },
    {
      h: "Independent visibility controls",
      html: '<acme-legend><acme-legend-item value="requests" color="var(--chart-1)"><acme-checkbox checked>Requests</acme-checkbox></acme-legend-item><acme-legend-item value="errors" color="var(--chart-4)"><acme-checkbox checked>Errors</acme-checkbox></acme-legend-item></acme-legend>',
    },
  ],
  practices: {
    Ownership: [
      "Legend is passive. Checkbox or Toggle Button owns any selection behavior and emits its usual events.",
      "value identifies the series. label or authored content names it. color affects only the decorative swatch.",
      "Use the native hidden attribute to hide an item. The component does not infer application visibility rules.",
    ],
  },
};
