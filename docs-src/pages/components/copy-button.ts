// Docs page: Copy Button — mirrors https://vercel.com/geist/copy-button
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "copy-button",
  title: "Copy Button",
  lede: "A button that copies a string and swaps its icon to a check.",
  tags: ["acme-copy-button"],
  examples: [
    {
      h: "Default",
      html: `<div class="row"><acme-copy-button text="prj_WxDl2RuzJGJACJgC661Uj3BEEe5k" label="Copy project ID"></acme-copy-button><acme-copy-button size="small" text="dpl_9WjH8QFQySx7" label="Copy deployment ID"></acme-copy-button></div>`,
    },
  ],
};
