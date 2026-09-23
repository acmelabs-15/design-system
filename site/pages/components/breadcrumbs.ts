import type { Doc } from "../../site";
export const doc: Doc = {
  id: "breadcrumbs",
  title: "Breadcrumbs",
  lede: "The current page and its ordered navigation ancestry.",
  tags: ["acme-breadcrumbs", "acme-breadcrumb"],
  examples: [
    {
      h: "Current page",
      html: '<acme-breadcrumbs><acme-breadcrumb href="#home">Home</acme-breadcrumb><acme-breadcrumb href="#projects">Projects</acme-breadcrumb><acme-breadcrumb current>Design system</acme-breadcrumb></acme-breadcrumbs>',
    },
    { h: "Current link", html: '<acme-breadcrumbs><acme-breadcrumb href="#home">Home</acme-breadcrumb><acme-breadcrumb href="#current" current>Current page</acme-breadcrumb></acme-breadcrumbs>' },
    {
      h: "Unavailable ancestor",
      html: '<acme-breadcrumbs><acme-breadcrumb href="#restricted" disabled>Restricted project</acme-breadcrumb><acme-breadcrumb current>Document</acme-breadcrumb></acme-breadcrumbs>',
    },
    {
      h: "Custom separators",
      html: '<acme-breadcrumbs><acme-breadcrumb href="#home">Home<span slot="separator">/</span></acme-breadcrumb><acme-breadcrumb current>Settings</acme-breadcrumb></acme-breadcrumbs>',
    },
  ],
  practices: {
    Navigation: [
      "Use native href links for ancestors. Mark the current page with current; it exposes aria-current=page on its label or link.",
      "Breadcrumbs supplies the localized Breadcrumb navigation label. Use aria-label or aria-labelledby when the page contains multiple breadcrumb landmarks.",
      "The final separator is hidden automatically, including after member removal or reordering. The separator slot on each Breadcrumb accepts decorative custom content.",
      "A disabled link has no navigable href and is not a tab stop. It remains readable with its disabled state.",
      "For long paths, compose a Menu that exposes the complete ancestor labels. Do not remove access to hidden ancestors.",
    ],
  },
};
