// Docs page: Text With Copy Button — mirrors https://vercel.com/geist/text-with-copy-button
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "text-with-copy-button",
  title: "Text With Copy Button",
  lede: "Text beside a button that copies it.",
  tags: ["acme-text-copy"],
  examples: [
    {
      h: "Default",
      html: `<acme-text-copy text="prj_WxDl2RuzJGJACJgC661Uj3BEEe5k"></acme-text-copy>`,
    },
    {
      h: "Ellipsis",
      html: `<acme-text-copy ellipsis text="prj_WxDl2RuzJGJACJgC661Uj3BEEe5k" style="display:block;max-width:200px"></acme-text-copy>`,
    },
  ],
};
