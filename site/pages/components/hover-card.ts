import type { Doc } from "../../site";
export const doc: Doc = {
  id: "hover-card",
  title: "Hover Card",
  lede: "Supplementary previews that preserve the trigger’s own destination.",
  tags: ["acme-hover-card"],
  examples: [
    {
      h: "Profile preview",
      html: '<acme-hover-card><a href="#profile">Ada Lovelace</a><article slot="content"><acme-heading as="h3">Ada Lovelace</acme-heading><p>Mathematician and computing pioneer.</p><p>Read the profile for complete information.</p></article></acme-hover-card><p id="profile">Ada Lovelace was a mathematician and computing pioneer. This visible profile remains available without the preview.</p>',
    },
    {
      h: "Project preview",
      html: '<acme-hover-card side="right" align="center"><a href="#project">Design system</a><article slot="content"><strong>Design system</strong><p>Reusable components, shared styles and accessible behavior.</p><acme-badge>Active project</acme-badge></article></acme-hover-card><p id="project">The design system contains reusable components, shared styles and accessible behavior. The project is active.</p>',
    },
  ],
  practices: {
    Content: [
      "Keep previews supplementary. The trigger should link to a destination that contains the complete information, including for touch and keyboard users.",
      "Preview content is noninteractive. It remains inert; its text supplies an accessible description on the trigger. Use Toggle Tip for links, buttons and other interactive help.",
      "Do not put essential instructions only in the preview.",
    ],
    Interaction: [
      "Hover or focus opens after openDelay, 600ms by default. Leaving both trigger and preview closes after closeDelay, 300ms by default.",
      "Opening never moves focus into the preview or cancels native link activation. Touch keeps the destination action.",
      "Escape dismisses while focus stays on the trigger. Removing the trigger or disconnecting the component cleans up the overlay and timers.",
      "Preferred placement defaults to bottom/start with a 4px offset. The surface uses shadow4 and the trigger’s theme.",
    ],
  },
};
