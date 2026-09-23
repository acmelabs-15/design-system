import type { Doc } from "../../site";
export const doc: Doc = {
  id: "tooltip",
  title: "Tooltip",
  lede: "Short noninteractive help on pointer hover and keyboard focus.",
  tags: ["acme-tooltip"],
  examples: [
    { h: "Description", html: '<acme-tooltip content="Save your changes."><acme-button>Save</acme-button></acme-tooltip>' },
    { h: "Simple formatting", html: '<acme-tooltip><acme-button variant="secondary">Search</acme-button><span slot="content">Search this page <acme-kbd>/</acme-kbd></span></acme-tooltip>' },
    {
      h: "Placement",
      html: '<acme-h-stack flex-wrap="wrap"><acme-tooltip side="bottom" content="Below the trigger"><acme-button variant="secondary">Bottom</acme-button></acme-tooltip><acme-tooltip side="right" align="start" content="Beside the trigger"><acme-button variant="secondary">Right</acme-button></acme-tooltip></acme-h-stack>',
    },
    { h: "Delayed hover", html: '<acme-tooltip open-delay="300" content="A short delay prevents accidental previews."><acme-button variant="secondary">Hover briefly</acme-button></acme-tooltip>' },
  ],
  practices: {
    Content: [
      "Give the trigger its own accessible name. Tooltip adds a description and preserves existing descriptions; it does not name an unlabeled control.",
      "Use content for text or the content slot for simple noninteractive formatting. Text is preserved, including punctuation.",
      "Use Hover Card for supplementary previews. Use Toggle Tip for interactive help or information that must be available through explicit activation.",
    ],
    Interaction: [
      "Native focus opens the tooltip. No extra wrapper tab stop is added. Disabled native buttons keep their native focus behavior.",
      "The pointer can move onto the bubble. Escape dismisses without moving focus; leaving both trigger and bubble closes after closeDelay.",
      "The default openDelay is 0ms and closeDelay is 100ms. Delayed work is canceled on departure, disabled state and disconnection.",
      "Touch does not hijack the trigger action. Provide essential help in visible content or Toggle Tip.",
      "side and align select preferred placement; the surface flips and shifts to stay within the viewport. Plain Tooltip has no shadow.",
    ],
  },
};
