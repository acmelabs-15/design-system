import type { Doc } from "../../site";

const items =
  '<acme-timeline-item><time slot="date" datetime="2026-09-21">September 21</time><h3 slot="heading">Order placed</h3><p slot="description">Your order is confirmed.</p></acme-timeline-item><acme-timeline-item><time slot="date" datetime="2026-09-22">September 22</time><h3 slot="heading">Shipped</h3><p slot="description">Your order is on the way.</p></acme-timeline-item><acme-timeline-item><time slot="date" datetime="2026-09-23">September 23</time><h3 slot="heading">Delivered</h3><p slot="description">Your order has arrived.</p></acme-timeline-item>';
export const doc: Doc = {
  id: "timeline",
  title: "Timeline",
  lede: "Ordered events with authored dates, indicators and rich content.",
  tags: ["acme-timeline", "acme-timeline-item"],
  examples: [
    { h: "Delivery history", html: `<acme-timeline aria-label="Delivery history">${items}</acme-timeline>` },
    { h: "Horizontal", html: `<acme-timeline aria-label="Delivery history" orientation="horizontal">${items}</acme-timeline>` },
    {
      h: "Custom indicator",
      html: '<acme-timeline aria-label="Build history"><acme-timeline-item><acme-check-icon slot="indicator" size="20px"></acme-check-icon><h3 slot="heading">Build complete</h3><p>The latest version is ready.</p><acme-button variant="secondary">View build</acme-button></acme-timeline-item></acme-timeline>',
    },
  ],
  practices: {
    Content: [
      "Timeline is an ordered list. Keep event order in the document; do not use visual CSS order to change chronology.",
      "Use real time elements or the date-format components for dates. Choose heading levels that fit the page. The component does not parse a date string or choose a heading level.",
      "Indicators and connectors are decorative. Put status meaning in the visible heading or description. Actions remain ordinary links or buttons.",
      "Use Steps for interactive progression. Timeline has no selected value or navigation event.",
    ],
  },
};
