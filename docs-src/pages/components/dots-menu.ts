// Docs page: Dots Menu — mirrors https://vercel.com/geist/dots-menu
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "dots-menu",
  title: "Dots Menu",
  lede: "An overflow menu behind a three-dot icon.",
  tags: ["acme-dots-menu", "acme-menu-item"],
  examples: [
    {
      h: "Default",
      p: "Click the dots.",
      html: `<div style="display:flex;justify-content:flex-end;min-height:160px"><acme-dots-menu label="Deployment actions"><acme-menu-item>View Build Logs</acme-menu-item><acme-menu-item>View Projects</acme-menu-item><acme-menu-item disabled>View Analytics</acme-menu-item></acme-dots-menu></div>`,
    },
  ],
};
