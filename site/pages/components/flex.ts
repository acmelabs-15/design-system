import type { Doc } from "../../site";

export const doc: Doc = {
  id: "flex",
  title: "Flex",
  house: true,
  lede: "Arrange content with native flex layout. Direction, alignment, wrapping and gaps support responsive values.",
  tags: ["acme-flex"],
  examples: [
    {
      h: "Alignment",
      html: `<acme-flex align-items="center" justify-content="space-between" gap="4"><h3>Deliveries</h3><acme-button>New delivery</acme-button></acme-flex>`,
    },
    {
      h: "Responsive direction",
      html: `<acme-flex flex-direction='{"compact":"column","expanded":"row"}' gap="4"><acme-box padding="4" background-color="var(--ds-gray-100)">First item</acme-box><acme-box padding="4" background-color="var(--ds-gray-100)">Second item</acme-box></acme-flex>`,
    },
    {
      h: "Wrapping",
      html: `<acme-flex flex-wrap="wrap" gap="2"><acme-button>Overview</acme-button><acme-button>Activity</acme-button><acme-button>Settings</acme-button></acme-flex>`,
    },
    {
      h: "Inline arrangement",
      html: `<acme-flex as="nav" aria-label="Related pages" display="inline-flex" gap="4"><a href="#alignment">Alignment</a><a href="#wrapping">Wrapping</a></acme-flex>`,
    },
  ],
  practices: {
    "Use native concepts": [
      "Use flexDirection, flexWrap, alignItems, alignContent and justifyContent. Properties use camelCase; HTML attributes use kebab-case.",
      "Numeric gaps select spacing tokens. Use a CSS string for a literal length.",
      "Keep meaningful source order. Reversed layouts change visual order, not reading or keyboard order.",
    ],
    "Choose the right container": [
      "Use Flex for direct arrangement control. Stack adds spacing defaults and optional separators. Group adds attachment and compatible child defaults.",
      "Changing as changes the native meaning while preserving the flex arrangement. Use display=inline-flex for inline placement.",
    ],
  },
};
