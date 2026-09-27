import type { Doc } from "../../site";

export const doc: Doc = {
  id: "list",
  title: "List",
  tags: ["acme-list"],
  lede: "Style native ordered, unordered and nested lists while keeping their content yours.",
  examples: [
    { h: "Unordered", html: '<acme-list spacing="2"><ul><li>One component name per concept</li><li>Shared building blocks</li><li>Native HTML meaning</li></ul></acme-list>' },
    {
      h: "Ordered and nested",
      html: '<acme-list><ol start="3" reversed><li>Review the findings</li><li>Build the component<ul><li>Use shared state</li><li>Verify native behavior</li></ul></li><li value="1">Run acceptance checks</li></ol></acme-list>',
    },
    {
      h: "Custom markers",
      html: '<acme-list marker="custom"><ul><li><acme-check-icon data-acme-list-part="marker" aria-hidden="true" size="16px"></acme-check-icon>Tests pass</li><li><acme-check-icon data-acme-list-part="marker" aria-hidden="true" size="16px"></acme-check-icon>Documentation matches</li></ul></acme-list>',
    },
    { h: "Responsive spacing", html: '<acme-list spacing=\'{"compact":2,"expanded":4}\'><ul><li>Compact screens use less spacing.</li><li>Expanded screens use more spacing.</li></ul></acme-list>' },
    {
      h: "Independent actions",
      html: '<acme-list marker="none"><ul aria-label="Projects"><li><acme-link href="#alpha">Alpha</acme-link> <acme-button variant="secondary" size="small">Manage Alpha</acme-button></li><li><acme-link href="#beta">Beta</acme-link> <acme-button variant="secondary" size="small">Manage Beta</acme-button></li></ul></acme-list>',
    },
  ],
  practices: {
    Content: [
      "Supply one native ul or ol with native li children. Use start, reversed and value for native ordered numbering. Keep names and list-specific attributes on the native list.",
      "List retains your nodes and events. It adds no selection state, roving focus or listbox behavior.",
      "For custom markers, put decorative content in a data-acme-list-part=marker element and mark it aria-hidden. List preserves an explicit list role when native markers are hidden.",
      "Use native ul/ol/li selectors or data-acme-list-part attributes to style native content. The wrapper exposes the root shadow part.",
    ],
  },
};
