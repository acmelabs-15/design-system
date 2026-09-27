import type { Doc } from "../../site";

export const doc: Doc = {
  id: "copy-button",
  title: "Copy Button",
  tags: ["acme-copy-button"],
  lede: "Copies an exact string and confirms success after the clipboard operation finishes.",
  examples: [
    { h: "Icon action", html: '<acme-copy-button value="Example text" aria-label="Copy example"></acme-copy-button>' },
    { h: "Visible label", html: '<acme-copy-button value="bun install" variant="secondary">Copy command</acme-copy-button>' },
    { h: "Feedback duration", html: '<acme-copy-button value="Example" copied-duration="1500">Copy</acme-copy-button>' },
  ],
  practices: {
    Behavior: [
      "value is the exact clipboard text. The component owns its readonly copied state.",
      "copy() resolves after success and rejects on failure. acme-copy reports success; acme-error reports a clipboard failure without copied data.",
      "Default labels come from configureMessages using copy.copy, copy.copied and copy.error. Applications can supply their own visible label or accessible name.",
    ],
  },
};
