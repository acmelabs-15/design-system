import type { Doc } from "../../site";
export const doc: Doc = {
  id: "spinner",
  title: "Spinner",
  tags: ["acme-spinner"],
  lede: "Indeterminate activity with a decorative or named status presentation.",
  examples: [
    { h: "Named status", html: '<acme-spinner label="Loading projects"></acme-spinner>' },
    {
      h: "Sizes",
      html: '<div class="row"><acme-spinner size="small"></acme-spinner><acme-spinner size="medium"></acme-spinner><acme-spinner size="large"></acme-spinner><acme-spinner size="extraLarge"></acme-spinner><acme-spinner size="extraExtraLarge"></acme-spinner></div>',
    },
    { h: "Color", html: '<acme-spinner label="Loading" style="color:var(--ds-blue-900)"></acme-spinner>' },
    { h: "Surrounding status", html: '<span role="status">Loading projects <acme-spinner></acme-spinner></span>' },
  ],
  practices: {
    Accessibility: [
      "An empty label makes the Spinner decorative. Supply a translated label when it owns the status announcement.",
      "Use one status owner. A loading Button owns its busy state and keeps its accessible name.",
      "Reduced motion keeps a static activity indicator. It does not suggest completion.",
    ],
    Sizing: [
      "small, medium, large, extraLarge and extraExtraLarge use 12, 16, 20, 24 and 32 CSS pixels at the default root font size.",
      "Use CSS color for local customization. The component creates no input value or user-change event.",
    ],
  },
};
