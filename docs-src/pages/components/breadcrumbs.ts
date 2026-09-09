// Docs page: Breadcrumbs — mirrors https://vercel.com/geist/breadcrumbs
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "breadcrumbs",
  title: "Breadcrumbs",
  lede: "Show the path to the current page and let the reader step back up it.",
  tags: ["acme-breadcrumbs"],
  examples: [
    {
      h: "Text",
      p: "Plain links and a final span with aria-current; the element inserts the separators.",
      html: `<acme-breadcrumbs><a href="#">Home</a><a href="#">Projects</a><span aria-current="page">coding-agent-template</span></acme-breadcrumbs>`,
    },
    {
      h: "Disabled item",
      html: `<acme-breadcrumbs><a href="#">Home</a><span class="disabled">Archive</span><span aria-current="page">2025</span></acme-breadcrumbs>`,
    },
    {
      h: "Menu type",
      p: "Each item is a 22px button on background-200.",
      html: `<acme-breadcrumbs variant="menu"><a href="#">acme-labs</a><a href="#">coding-agent-template</a><span aria-current="page">Settings</span></acme-breadcrumbs>`,
    },
  ],
};
