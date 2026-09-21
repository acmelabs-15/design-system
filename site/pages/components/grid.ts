import type { Doc } from "../../site";
export const doc: Doc = {
  id: "grid",
  title: "Grid",
  house: true,
  tags: ["acme-grid"],
  lede: "Use native grid tracks, named areas and placement. Use Simple Grid for equal columns or automatic fitting.",
  examples: [
    {
      h: "Tracks",
      html: `<acme-grid grid-template-columns="repeat(3, minmax(0, 1fr))" gap="4"><acme-box padding="4" background-color="var(--ds-gray-100)">First</acme-box><acme-box padding="4" background-color="var(--ds-gray-100)">Second</acme-box><acme-box padding="4" background-color="var(--ds-gray-100)">Third</acme-box></acme-grid>`,
    },
    {
      h: "Named areas",
      html: `<acme-grid grid-template-columns="12rem minmax(0, 1fr)" grid-template-areas='"nav content"' gap="4"><acme-box as="nav" grid-area="nav" aria-label="Example navigation">Navigation</acme-box><acme-box as="section" grid-area="content">Main content</acme-box></acme-grid>`,
    },
    {
      h: "Responsive tracks",
      html: `<acme-grid grid-template-columns='{"compact":"minmax(0, 1fr)","expanded":"16rem minmax(0, 1fr)"}' gap="4"><acme-box as="aside">Related content</acme-box><acme-box>Main content</acme-box></acme-grid>`,
    },
    {
      h: "Placement",
      html: `<acme-grid grid-template-columns="repeat(3, minmax(0, 1fr))" gap="2"><acme-box grid-column="span 2" padding="4" background-color="var(--ds-gray-100)">Spans two tracks</acme-box><acme-box padding="4" background-color="var(--ds-gray-100)">One track</acme-box></acme-grid>`,
    },
  ],
  practices: {
    "Use native structure": [
      "Children remain owned by their author. Use ordinary content or a layout primitive with gridArea/gridColumn/gridRow for placement.",
      "Visual placement does not change reading or tab order. Keep meaningful DOM order.",
      "Advanced track syntax follows browser support. Subgrid across the retained host/root boundary is not advertised as supported.",
    ],
  },
};
