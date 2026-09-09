// Docs page: Snippet — mirrors https://vercel.com/geist/snippet
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "snippet",
  title: "Snippet",
  lede: "A copyable command for the command line.",
  tags: ["acme-snippet"],
  examples: [
    {
      h: "Default",
      html: `<acme-snippet text="npm init next-app" style="display:block;max-width:300px"></acme-snippet>`,
    },
    {
      h: "Inverted",
      html: `<acme-snippet variant="dark" text="npm init next-app" style="display:block;max-width:300px"></acme-snippet>`,
    },
    {
      h: "Multi line",
      html: `<acme-snippet lines='["cd project","now"]'></acme-snippet>`,
    },
    {
      h: "No prompt",
      html: `<acme-snippet prompt="false" text="https://vercel.com/acme-labs" style="display:block;max-width:300px"></acme-snippet>`,
    },
    {
      h: "Variants",
      html: `<div class="vstack" style="max-width:300px"><acme-snippet variant="success" text="npm init next-app"></acme-snippet><acme-snippet variant="error" text="npm init next-app"></acme-snippet><acme-snippet variant="warning" text="npm init next-app"></acme-snippet></div>`,
    },
  ],
  practices: {
    Content: [
      "One runnable command per snippet; the component renders the prompt, so the text never starts with $.",
      "No prompt for URLs, JSON and verbatim output; Code Block for longer scripts; inline code for tokens.",
    ],
  },
};
