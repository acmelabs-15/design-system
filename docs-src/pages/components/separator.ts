// Docs page: Separator — mirrors https://vercel.com/geist/separator
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "separator",
  title: "Separator",
  lede: "A visual divider between sections, horizontal or vertical.",
  tags: ["acme-separator"],
  examples: [
    {
      h: "Horizontal",
      html: `<div><h3 class="text-label-16">Section 1</h3><p class="text-copy-14" style="color:var(--text-2)">This is the first section.</p><acme-separator></acme-separator><h3 class="text-label-16">Section 2</h3><p class="text-copy-14" style="color:var(--text-2)">This is the second section.</p></div>`,
    },
    {
      h: "Vertical",
      html: `<div class="row" style="gap:16px;height:32px"><span class="text-copy-14">Home</span><acme-separator vertical></acme-separator><span class="text-copy-14">Services</span><acme-separator vertical></acme-separator><span class="text-copy-14">Contact</span></div>`,
    },
  ],
};
