// Docs page: File Tree — mirrors https://vercel.com/geist/file-tree
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "file-tree",
  title: "File Tree",
  lede: "A hierarchical directory structure with expandable folders and files.",
  tags: ["acme-file-tree"],
  examples: [
    {
      h: "Default",
      html: `<acme-file-tree data='[{"name":".vercel","open":true,"children":[{"name":"output","open":true,"children":[{"name":"functions","open":true,"children":[{"name":"edge.func","open":true,"children":[{"name":".vc-config.json","href":"#"},{"name":"index.js","href":"#","current":true}]}]}]}]},{"name":"app","children":[{"name":"page.tsx","href":"#"}]},{"name":"package.json","href":"#"}]'></acme-file-tree>`,
    },
  ],
  practices: {
    "When to use": ["Illustrating a project layout; rows are 28px mono, each level indents 16px behind a guide line."],
  },
};
