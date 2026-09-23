import type { Doc } from "../../site";
export const doc: Doc = {
  id: "toggle-tip",
  title: "Toggle Tip",
  lede: "Interactive help opened by click, tap or keyboard activation.",
  tags: ["acme-toggle-tip"],
  examples: [
    {
      h: "Interactive help",
      html: '<acme-toggle-tip><span slot="trigger">How billing works</span><acme-heading as="h3">Billing details</acme-heading><p>Your plan renews each month.</p><a href="#billing-guide">Read the billing guide</a></acme-toggle-tip>',
    },
    {
      h: "Retained content",
      html: '<acme-toggle-tip><span slot="trigger">Add a reference</span><label>Reference <input value=""></label><p>The field remains mounted when this help closes.</p></acme-toggle-tip>',
    },
  ],
  practices: {
    Content: [
      "The trigger slot supplies label content for the component’s native Button. Do not put another button or link inside that label.",
      "The default slot accepts interactive content. The surface is a named nonmodal dialog, with an explicit Close control.",
      "Use aria-label when the trigger label does not also describe the help surface. Essential instructions can live here because activation works with pointer, touch and keyboard.",
    ],
    Interaction: [
      "Keyboard activation moves focus to the first interactive element, or the surface when none exists. Pointer activation keeps native focus behavior.",
      "Escape, outside interaction and the Close control dismiss. Focus returns to the trigger when it remains inside the closing content; a newly focused outside control keeps focus.",
      "closeOnEscape and closeOnOutside are independently configurable. Cancel acme-request with action=close to prevent a user dismissal.",
      "Programmatic open assignments are silent. User changes emit acme-open-change { open, reason }. Content stays mounted through close and reopen.",
      "The surface uses shared native overlay coordination, Floating UI placement, Lit Motion and shadow5.",
    ],
  },
};
