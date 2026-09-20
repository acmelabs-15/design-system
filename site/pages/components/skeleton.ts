// Docs page: Skeleton — mirrors https://vercel.com/geist/skeleton
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "skeleton",
  title: "Skeleton",
  lede: "Show a placeholder shape while another component loads.",
  tags: ["acme-skeleton"],
  examples: [
    {
      h: "Default with set width",
      html: `<acme-skeleton width="160"></acme-skeleton>`,
    },
    {
      h: "Default with box height",
      html: `<acme-skeleton box-height="42" width="160"></acme-skeleton>`,
    },
    {
      h: "Wrapping children",
      p: "Without a fixed size the skeleton takes the size of its children.",
      html: `<div class="vstack" style="gap:16px;align-items:flex-start"><acme-skeleton><acme-button>Hidden by skeleton</acme-button></acme-skeleton><acme-skeleton show="false"><acme-button>Not hidden by skeleton</acme-button></acme-skeleton></div>`,
    },
    {
      h: "Wrapping children with fixed size",
      p: "The skeleton hides once children are present, and the size stays reserved.",
      html: `<div class="vstack" style="gap:16px;align-items:flex-start"><acme-skeleton height="100" width="100%"></acme-skeleton><acme-skeleton height="100" width="100%"><acme-button>Not hidden by Skeleton</acme-button></acme-skeleton></div>`,
    },
    {
      h: "Pill",
      html: `<acme-skeleton pill width="48"></acme-skeleton>`,
    },
    {
      h: "Rounded",
      html: `<acme-skeleton box-height="48" height="48" rounded width="48"></acme-skeleton>`,
    },
    {
      h: "Squared",
      html: `<acme-skeleton box-height="48" height="48" squared width="48"></acme-skeleton>`,
    },
    {
      h: "No animation",
      html: `<acme-skeleton animated="false" height="100" width="100%"></acme-skeleton>`,
    },
    {
      h: "Button",
      html: `<div class="vstack" style="gap:16px"><div class="vstack" style="gap:8px"><p class="text-label-14">Without button prop (default):</p><acme-skeleton height="32" width="120"><acme-button>Loading...</acme-button></acme-skeleton></div><div class="vstack" style="gap:8px"><p class="text-label-14">With button prop (extends animation by 1px):</p><acme-skeleton button height="32" width="120"><acme-button>Loading...</acme-button></acme-skeleton></div><div class="vstack" style="gap:8px"><p class="text-label-14">Multiple buttons loading:</p><div class="row"><acme-skeleton button><acme-button>Save</acme-button></acme-skeleton><acme-skeleton button><acme-button variant="secondary">Cancel</acme-button></acme-skeleton></div></div></div>`,
    },
  ],
  practices: {
    "When to use": [
      "Show a Skeleton when async data fills a layout you already know: table rows, card grids, profile blocks, sidebars.",
      "Use Spinner for one in-flight action, Loading Dots for an inline wait with no end in sight, and Progress when the total is known.",
      "A Skeleton is not decoration and not an empty state. When there is no data to load, render an Empty State.",
    ],
    Behavior: [
      "Set <code>width</code> and <code>height</code> to the final content so nothing shifts when data lands. A 200×20 block that becomes an 80×16 string reads as a glitch.",
      "Pick <code>pill</code>, <code>rounded</code> or <code>squared</code> to mirror the shape that follows: avatars pill, buttons and chips rounded, image tiles squared.",
      "When the skeleton wraps children, keep the size stable so the swap does not reflow the content around it.",
    ],
    Accessibility: [
      'Put <code>aria-busy="true"</code> on the loading region and announce completion with <code>aria-live="polite"</code> on the destination, not on the skeleton.',
      'Turn the shimmer off with <code>animated="false"</code> on low-power surfaces; the sweep also stops under <code>prefers-reduced-motion</code>.',
      "Skeletons are decorative. Keep focusable controls out of them while loading.",
    ],
  },
};
