// Docs page: Code Block — mirrors https://vercel.com/geist/code-block
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "code-block",
  title: "Code Block",
  lede: "Multi-line source with a filename, line numbers and highlighted lines.",
  tags: ["acme-code-block"],
  examples: [
    {
      h: "With filename",
      html: `<acme-code-block filename="app/page.tsx" language="tsx" line-numbers highlight-lines="[2]">export default function Page() {
  return <main>Hello</main>;
}</acme-code-block>`,
    },
    {
      h: "Line numbers only",
      html: `<acme-code-block line-numbers>runtime: "nodejs20.x"
regions: ["iad1"]</acme-code-block>`,
    },
  ],
  practices: {
    Content: ["Always name the language; highlight only the lines under discussion.", "Show the filename when there is a paste destination; snippets stay runnable and never prefix $."],
  },
};
