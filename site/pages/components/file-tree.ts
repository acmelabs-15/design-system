// Docs page: File Tree — mirrors https://vercel.com/geist/file-tree
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "file-tree",
  title: "File Tree",
  lede: "Display a hierarchical directory structure with expandable folders and files, useful for illustrating project layouts.",
  tags: ["acme-file-tree", "acme-folder", "acme-file"],
  examples: [
    {
      h: "Default",
      html: `<acme-file-tree><acme-folder name=".vercel" default-open><acme-folder name="output" default-open><acme-folder name="functions" default-open><acme-folder name="edge.func" default-open><acme-file name=".vc-config.json" href="/"></acme-file><acme-file name="index.js"></acme-file></acme-folder></acme-folder></acme-folder></acme-folder><acme-folder name="app"><acme-file name="main.tsx" type="edge-function"></acme-file><acme-file name="dashboard.tsx" type="lambda"></acme-file><acme-file name="dashboard.tsx" type="middleware"></acme-file></acme-folder></acme-file-tree>`,
    },
    {
      h: "Active File", census: true,
      p: "The current file reads semibold with a gray-1000 icon.",
      html: `<acme-file-tree><acme-folder name="app" default-open><acme-file name="main.tsx" type="lambda" href="/" active></acme-file><acme-file name="dashboard.tsx" type="middleware"></acme-file></acme-folder></acme-file-tree>`,
    },
    {
      h: "Card", census: true,
      p: "A card tree sits on the page background with the smallest shadow, radius 8, padding 24 and 16px text.",
      html: `<acme-file-tree card><acme-folder name="src" default-open><acme-file name="index.ts"></acme-file></acme-folder><acme-file name="package.json"></acme-file></acme-file-tree>`,
    },
  ],
};
