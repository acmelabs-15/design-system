import type { Doc } from "../../site";
export const doc: Doc = {
  id: "heading",
  title: "Heading",
  house: true,
  tags: ["acme-heading"],
  lede: "A native heading level with an independent visual size. The host ID remains the document fragment target.",
  examples: [
    { h: "Default heading", html: "<acme-heading>Delivery details</acme-heading>" },
    { h: "Level and size", html: '<acme-heading as="h3" size="20px">A section within the page</acme-heading>' },
    { h: "Stable target", html: '<acme-heading id="delivery-details" as="h2">Delivery details</acme-heading><p><a href="#delivery-details">Link to this heading</a></p>' },
  ],
  practices: {
    "Use a meaningful hierarchy": [
      "Choose h1 through h6 by document structure. Changing size does not change the semantic level.",
      "Supply stable IDs for TOC targets. Heading does not invent IDs.",
      "getHeadingElement() returns the native heading after updateComplete. Registered heading discovery does not inspect arbitrary private roots.",
    ],
  },
};
