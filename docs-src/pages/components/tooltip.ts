// Docs page: Tooltip — mirrors https://vercel.com/geist/tooltip
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "tooltip",
  title: "Tooltip",
  lede: "A floating label on hover or focus that adds context to an element.",
  tags: ["acme-tooltip"],
  examples: [
    {
      h: "Default",
      p: "Hover or focus the text.",
      html: `<div class="row" style="gap:32px"><acme-tooltip text="The Evil Rabbit Jumped over the Fence"><span class="text-copy-16" tabindex="0">Top</span></acme-tooltip><acme-tooltip side="bottom" text="The Evil Rabbit Jumped over the Fence"><span class="text-copy-16" tabindex="0">Bottom</span></acme-tooltip></div>`,
    },
    {
      h: "Static",
      p: "The bubble itself: gray-1000, 13px, padding 6 8, radius 8, max width 250.",
      html: `<div class="row" style="gap:16px;padding-top:40px"><acme-tooltip open text="The Evil Rabbit Jumped over the Fence"><span>Default</span></acme-tooltip><acme-tooltip open variant="success" text="Success"><span>Success</span></acme-tooltip><acme-tooltip open variant="error" text="Error"><span>Error</span></acme-tooltip><acme-tooltip open variant="warning" text="Warning"><span>Warning</span></acme-tooltip><acme-tooltip open variant="violet" text="Violet"><span>Violet</span></acme-tooltip></div>`,
    },
    {
      h: "Components",
      html: `<div class="row" style="gap:24px"><acme-tooltip side="bottom" text="Deploy to production"><acme-button size="small" variant="primary">Bottom</acme-button></acme-tooltip><acme-tooltip text="Left"><acme-badge tabindex="0">Left</acme-badge></acme-tooltip><acme-tooltip text="Press ⌘K"><span class="text-copy-16" tabindex="0">Shortcut</span></acme-tooltip></div>`,
    },
  ],
  practices: {
    "When to use": ["Explain why something exists, not what it is; Context Card for an entity preview; never wrap a labelled Input."],
    Behavior: ["Opens on hover and focus after ~150ms; Escape closes; primary actions stay outside."],
    Content: ["One sentence or fragment, sentence case, no period; never repeat the visible label or describe the click."],
  },
};
