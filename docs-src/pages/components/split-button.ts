// Docs page: Split Button — mirrors https://vercel.com/geist/split-button
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "split-button",
  title: "Split Button",
  lede: "A primary action coupled with a dropdown of close variants.",
  tags: ["acme-split-button"],
  examples: [
    {
      h: "Sizes and types",
      html: `<div class="vstack" style="gap:16px"><div class="row" style="gap:16px"><acme-split-button size="small">Save<acme-menu-item slot="items">Save</acme-menu-item><acme-menu-item slot="items">Save as Draft</acme-menu-item></acme-split-button><acme-split-button>Save<acme-menu-item slot="items">Save</acme-menu-item><acme-menu-item slot="items">Save as Draft</acme-menu-item></acme-split-button><acme-split-button size="large">Save<acme-menu-item slot="items">Save</acme-menu-item><acme-menu-item slot="items">Save as Draft</acme-menu-item></acme-split-button></div><div class="row" style="gap:16px"><acme-split-button variant="secondary" size="small">Save<acme-menu-item slot="items">Save</acme-menu-item></acme-split-button><acme-split-button variant="secondary">Save<acme-menu-item slot="items">Save</acme-menu-item></acme-split-button><acme-split-button variant="secondary" size="large">Save<acme-menu-item slot="items">Save</acme-menu-item></acme-split-button></div></div>`,
    },
  ],
  practices: {
    "When to use": ["One clear default with 1–4 close variants (Deploy, Deploy to Preview). The first menu item mirrors the primary label exactly. Primary and secondary types only."],
  },
};
