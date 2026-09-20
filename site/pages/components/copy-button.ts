// Docs page: Copy Button — mirrors https://vercel.com/geist/copy-button
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "copy-button",
  title: "Copy Button",
  lede: "A button that copies a given string to the clipboard and shows that it did.",
  tags: ["acme-copy-button"],
  examples: [
    {
      h: "Default",
      html: `<acme-copy-button text-to-copy="lipsum" label="copy text"></acme-copy-button>`,
    },
  ],
};
