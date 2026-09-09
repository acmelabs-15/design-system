// Docs page: Code — mirrors https://vercel.com/geist/code
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "code",
  title: "Code",
  lede: "Inline code and a code block for a snippet with highlighting.",
  tags: ["acme-code", "acme-code-block"],
  examples: [
    {
      h: "Inline",
      html: `<p class="text-copy-14">Set <acme-code>VERCEL_ENV</acme-code> to <acme-code>production</acme-code> before the build.</p>`,
    },
    {
      h: "Block",
      html: `<acme-code-block language="ts">const res = await fetch("/api/tasks");
if (!res.ok) throw new Error("Failed to load tasks.");</acme-code-block>`,
    },
  ],
};
