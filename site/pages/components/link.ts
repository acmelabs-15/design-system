import type { Doc } from "../../site";
export const doc: Doc = {
  id: "link",
  title: "Link",
  house: true,
  tags: ["acme-link"],
  lede: "Native navigation with text styling and optional start/end content.",
  examples: [
    { h: "Navigation", html: '<acme-link href="#navigation">Read the details</acme-link>' },
    { h: "Underline", html: '<acme-link href="#underline" underline="always">Always underlined</acme-link>' },
    { h: "Disabled", html: '<acme-link href="#disabled" disabled>Unavailable destination</acme-link>' },
  ],
  practices: {
    "Use a real destination": [
      "Link renders a native anchor. It does not own a router or emit a second navigation event.",
      "Disabled links have no active href and suppress click/auxiliary activation while retaining disabled link semantics.",
      "Use Button for an action that is not navigation.",
    ],
  },
};
