// Docs page: Browser — mirrors https://vercel.com/geist/browser
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "browser",
  title: "Browser",
  lede: "Marketing chrome around a screenshot, never live UI.",
  tags: ["acme-browser"],
  examples: [
    {
      h: "Default",
      html: `<acme-browser address="https://vercel.com/acme-labs/coding-agent-template"><div style="display:grid;place-items:center;min-height:160px;color:var(--text-2);font-size:14px">A screenshot goes here</div></acme-browser>`,
    },
  ],
  practices: {
    "When to use": ["A captured screen, not an interactive surface; decorative and aria-hidden, with the accessible name on the inner image."],
  },
};
