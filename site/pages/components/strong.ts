import type { Doc } from "../../site";
export const doc: Doc = {
  id: "strong",
  title: "Strong",
  tags: ["acme-strong"],
  lede: "Native semantic importance for inline content.",
  examples: [{ h: "Importance", html: "<p><acme-strong>Save your work</acme-strong> before leaving this page.</p>" }],
  practices: { "Preserve semantics": ["Strong expresses importance. Use Heading for document structure and Button for actions."] },
};
