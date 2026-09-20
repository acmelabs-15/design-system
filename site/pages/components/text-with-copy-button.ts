// Docs page: Text With Copy Button — mirrors https://vercel.com/geist/text-with-copy-button
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "text-with-copy-button",
  title: "Text With Copy Button",
  lede: "Display text alongside a button that copies the text to the clipboard.",
  tags: ["acme-text-copy"],
  examples: [
    {
      h: "Default",
      html: `<acme-text-copy ellipsis success-message="Copied to clipboard" text-label="Copy" text-to-copy="lipsum"></acme-text-copy>`,
    },
    {
      h: "With Small and Tertiary",
      html: `<acme-text-copy ellipsis success-message="Copied hashed digest to clipboard" text-label="Copy config digest" text-to-copy="edgeConfigData.digest"></acme-text-copy>`,
    },
  ],
};
