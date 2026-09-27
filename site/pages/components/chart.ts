import type { Doc } from "../../site";

const data = JSON.stringify([
  { month: "Jan", edge: 42, serverless: 18 },
  { month: "Feb", edge: 58, serverless: 21 },
  { month: "Mar", edge: 76, serverless: 30 },
  { month: "Apr", edge: 64, serverless: 27 },
  { month: "May", edge: 81, serverless: 35 },
  { month: "Jun", edge: 94, serverless: 38 },
]);
const series = JSON.stringify([
  { key: "edge", label: "Edge", color: "var(--chart-1)" },
  { key: "serverless", label: "Serverless", color: "var(--chart-2)" },
]);
const legend =
  '<acme-legend slot="legend"><acme-legend-item value="edge" label="Edge" color="var(--chart-1)"></acme-legend-item><acme-legend-item value="serverless" label="Serverless" color="var(--chart-2)"></acme-legend-item></acme-legend>';
export const doc: Doc = {
  id: "chart",
  title: "Chart",
  lede: "Named line, grouped bar and area charts with keyboard inspection and an exact-value table.",
  tags: ["acme-chart"],
  examples: [
    {
      h: "Line",
      html: `<acme-chart label="Monthly requests by execution type" x="month" points height="240px" series='${series}' data='${data}'><acme-heading slot="header" as="h3">Monthly requests</acme-heading>${legend}</acme-chart>`,
    },
    {
      h: "Grouped bars",
      p: "Multiple series are placed beside each other. They are not silently stacked.",
      html: `<acme-chart type="bar" label="Monthly requests by execution type" x="month" height="240px" series='${series}' data='${data}'>${legend}</acme-chart>`,
    },
    { h: "Area", html: `<acme-chart type="area" label="Monthly requests by execution type" x="month" height="240px" grid="false" series='${series}' data='${data}'>${legend}</acme-chart>` },
    {
      h: "Missing values and zero",
      html: '<acme-chart label="Daily delivery failures" x="day" series=\'[{"key":"failures","label":"Failures"}]\' data=\'[{"day":"Mon","failures":0},{"day":"Tue","failures":2},{"day":"Wed","failures":null},{"day":"Thu","failures":1},{"day":"Fri","failures":0}]\' points></acme-chart>',
    },
    {
      h: "Application activation",
      p: "Inspection is always available. Set interactive to request an application action when a point is activated.",
      html: `<acme-chart interactive label="Choose a month to inspect requests" x="month" series='${series}' data='${data}'></acme-chart><output aria-live="polite"></output>`,
      script:
        'root.querySelector("acme-chart").addEventListener("acme-request",event=>{if(event.detail.action==="point")root.querySelector("output").textContent="Requested "+event.detail.seriesKey+", row "+(event.detail.index+1);});',
    },
    {
      h: "Dates and formatting",
      html: '<acme-chart label="Revenue by UTC date" height="240px"></acme-chart>',
      script:
        'const chart=root.querySelector("acme-chart");chart.series=[{key:"revenue",label:"Revenue",formatter:value=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(value)}];chart.data=[{x:new Date("2026-01-01T00:00:00Z"),revenue:1200},{x:new Date("2026-02-01T00:00:00Z"),revenue:1900},{x:new Date("2026-03-01T00:00:00Z"),revenue:1750}];',
    },
    {
      h: "Application-owned series visibility",
      html: `<acme-checkbox checked aria-label="Show serverless requests">Show serverless requests</acme-checkbox><acme-chart label="Monthly visible request series" x="month" series='${series}' data='${data}'></acme-chart>`,
      script: `const all=${series};root.querySelector("acme-checkbox").addEventListener("acme-change",event=>root.querySelector("acme-chart").series=event.detail.checked?all:all.slice(0,1));`,
    },
    {
      h: "Empty data",
      html: '<acme-chart label="Requests awaiting data"><acme-empty-state slot="empty"><acme-empty-state-content><acme-heading as="h3">No requests yet</acme-heading></acme-empty-state-content></acme-empty-state></acme-chart>',
    },
  ],
  practices: {
    Data: [
      "Supply immutable replacement data and series arrays. Each series has a unique key and readable label.",
      "Numeric x values use a continuous scale; Date objects use a UTC time scale. Strings remain categories. The chart preserves input order.",
      "Missing, null and nonfinite measurements create gaps. Numeric strings are rejected. Zero remains a real value.",
      "Use explicit series colors when filtering or reordering series. The application owns data preparation and visibility.",
    ],
    Accessibility: [
      "Provide a meaningful label with metric, entities and time scope. Header content can provide visible context.",
      "Arrow keys inspect points. View data exposes the values without hover. Custom formatters return plain text.",
      "The tooltip slot supplements the point values with noninteractive authored content. Open Dialog or another application surface from an opt-in activation request when actions are needed.",
    ],
    Appearance: [
      "Chart palette tokens follow the current theme. Custom colors need their own contrast check.",
      "Height accepts a CSS dimension. Plot geometry updates immediately; disclosure uses the shared motion implementation.",
    ],
  },
};
