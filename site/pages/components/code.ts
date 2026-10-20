import type { Doc } from "../../site";

export const doc: Doc = {
  id: "code",
  title: "Code",
  tags: ["acme-code"],
  lede: "Native inline code with optional syntax highlighting and shared typography inputs.",
  examples: [
    { h: "Inline source", html: "<p>Run <acme-code>bun run build</acme-code> to create the package.</p>" },
    { h: "Highlighted source", html: '<acme-code syntax="javascript">const ready = true;</acme-code>' },
    { h: "Escaped text", html: '<acme-code syntax="html">&lt;button type="button"&gt;Save&lt;/button&gt;</acme-code>' },
  ],
  practices: {
    "Keep code as text": ["Supply source as text. The renderer creates text/token spans and does not execute HTML or code.", "Use Code Block for multiline documents, line numbers and copy controls."],
  },
};
