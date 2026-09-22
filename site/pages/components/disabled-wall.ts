import type { Doc } from "../../site";
export const doc: Doc = {
  id: "disabled-wall",
  title: "Disabled Wall",
  tags: ["acme-disabled-wall"],
  lede: "A visual overlay for a positioned content region.",
  examples: [
    {
      h: "Covered surface",
      html: '<div style="position:relative;padding:24px;border:1px solid var(--ds-gray-300);border-radius:8px"><div inert>Preview content is unavailable.</div><acme-disabled-wall></acme-disabled-wall></div>',
    },
  ],
  practices: {
    Semantics: [
      "Use Fieldset for native form disability. A visual overlay does not own form values or validation.",
      "Use native inert on covered content when the application also needs to suppress focus and interaction. Provide an explanation outside that content.",
    ],
  },
};
