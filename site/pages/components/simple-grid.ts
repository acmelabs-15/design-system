import type { Doc } from "../../site";
export const doc: Doc = {
  id: "simple-grid",
  title: "Simple Grid",
  tags: ["acme-simple-grid"],
  lede: "Create equal columns or fit as many minimum-width columns as the available space allows.",
  examples: [
    {
      h: "Column counts",
      html: `<acme-simple-grid columns='{"compact":1,"medium":2,"large":3}' gap="4"><acme-box padding="4" background-color="var(--ds-gray-100)">First</acme-box><acme-box padding="4" background-color="var(--ds-gray-100)">Second</acme-box><acme-box padding="4" background-color="var(--ds-gray-100)">Third</acme-box></acme-simple-grid>`,
    },
    {
      h: "Minimum width",
      html: `<acme-simple-grid min-child-width="min(100%, 12rem)" gap="4"><acme-box padding="4" background-color="var(--ds-gray-100)">First</acme-box><acme-box padding="4" background-color="var(--ds-gray-100)">Second</acme-box><acme-box padding="4" background-color="var(--ds-gray-100)">Third</acme-box></acme-simple-grid>`,
    },
  ],
  practices: {
    "Choose one sizing mode": [
      "minChildWidth takes priority for the whole component. Clear it with undefined or remove its attribute to restore column-count mode.",
      "A skipped responsive position does not fall back to columns. Before a minimum-width branch applies, native implicit grid behavior applies.",
      "Minimum widths remain true minima. Use min(100%, 12rem) when the minimum must fit a narrower container.",
      "An omitted columns value stays undefined. Simple Grid does not add an implicit columns=1 override.",
      "Numeric minimum widths select size tokens, including zero. Column counts must be positive integers.",
    ],
  },
};
