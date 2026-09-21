import type { Doc } from "../../site";

export const doc: Doc = {
  id: "box",
  title: "Box",
  house: true,
  lede: "A semantic container with responsive spacing, sizing and surface styles. Use ordinary CSS for rules outside its focused property set.",
  tags: ["acme-box"],
  examples: [
    {
      h: "Semantic surface",
      html: `<acme-box as="section" aria-label="Delivery details" padding="4" border-width="1px" border-style="solid" border-color="var(--ds-gray-200)" border-radius="8px"><h3>Delivery</h3><p>The next delivery arrives on Friday.</p></acme-box>`,
    },
    {
      h: "Responsive spacing",
      p: "Numeric values select spacing tokens. Strings such as 20px are literal CSS lengths. JSON attributes and JavaScript properties use the same responsive rules.",
      html: `<acme-box padding='{"compact":4,"expanded":8}' background-color="var(--ds-gray-100)"><p>Spacing follows the window's selected size band.</p></acme-box>`,
    },
    {
      h: "Inline content",
      p: "The span form keeps native inline wrapping. Use it with phrasing content.",
      html: `<p>This sentence contains <acme-box as="span" color="var(--ds-blue-900)">an inline phrase that can wrap with the surrounding text</acme-box>.</p>`,
    },
    {
      h: "Container queries",
      p: "The ancestor defines the query container. Box queries that ancestor, not its own width.",
      html: `<div style="container-type:inline-size;container-name:example"><acme-box responsive-target="container" responsive-container="example" padding='{"compact":2,"medium":4}' background-color="var(--ds-gray-100)">This spacing follows the example container.</acme-box></div>`,
    },
  ],
  practices: {
    "Choose a native meaning": [
      "Use as for div, span, section, article, main, nav, aside, header or footer. The default is div.",
      "Role and accessible naming describe the native inner root. IDs, classes, inline styles and data attributes stay on the host.",
    ],
    "Keep inputs predictable": [
      "Style getters return authored values. An absent style input reads undefined; CSS supplies defaults.",
      "Use styleInputs in Lit when shorthand and longhand declaration order matters. Keep the expression present and pass styleInputs({}) to clear its owned inputs.",
      "Use Flex, Stack or Grid when arranging children. Box does not accept a flex or grid display mode.",
    ],
  },
};
