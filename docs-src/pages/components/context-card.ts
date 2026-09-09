// Docs page: Context Card — mirrors https://vercel.com/geist/context-card
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "context-card",
  title: "Context Card",
  lede: "A floating card on hover or focus, richer than a tooltip.",
  tags: ["acme-context-card"],
  examples: [
    {
      h: "Default",
      p: "White, radius 6, the tooltip material, a 14×7 stem, about 150 ms of entry delay. Hover the trigger.",
      html: `<acme-context-card><acme-pill href="#">coding-agent-template</acme-pill><div slot="content"><p class="text-label-14" style="font-weight:500">coding-agent-template</p><p class="text-copy-13" style="color:var(--text-2)">acme-labs · Production</p><acme-description title="Last Deployed" style="margin-top:12px">2h ago</acme-description><acme-description title="Region">iad1</acme-description><acme-button size="small" style="margin-top:12px">View Project</acme-button></div></acme-context-card>`,
    },
    {
      h: "Static",
      p: "The card itself, pinned open.",
      html: `<acme-context-card open static><span class="text-copy-14">Hover me</span><div slot="content">The Evil Rabbit Jumped over the Fence</div></acme-context-card>`,
    },
  ],
  practices: {
    Content: ["A Title Case entity name, one identifying line, then 2–4 Label: value rows with Title Case keys and an em dash for unknowns; at most one primary action."],
    Behavior: ["Never nested in a tooltip; the trigger may be a link, button or badge."],
  },
};
