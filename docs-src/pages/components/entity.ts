// Docs page: Entity — mirrors https://vercel.com/geist/entity
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "entity",
  title: "Entity",
  lede: "A row of descriptive content with one or two controls at the right.",
  tags: ["acme-entity", "acme-entity-list"],
  examples: [
    {
      h: "Default",
      html: `<acme-entity><acme-avatar slot="left">er</acme-avatar><b>Evil Rabbit</b><span slot="description">Glenn Hitchcock (@gln)</span><span slot="right">Connected 1h ago</span></acme-entity>`,
    },
    {
      h: "List",
      html: `<acme-entity-list><acme-entity>GitHub Desktop on MacBook Pro<span slot="description">Last used just now</span><acme-button slot="right" size="small">Decline</acme-button></acme-entity><acme-entity>VS Code on Windows 11<span slot="description">Last used 10min ago</span><acme-button slot="right" size="small">Decline</acme-button></acme-entity><acme-entity>Terminal on Ubuntu 24.04<span slot="description">Last used 25min ago</span><acme-button slot="right" size="small">Decline</acme-button></acme-entity></acme-entity-list>`,
    },
    {
      h: "List with checkbox",
      html: `<acme-entity-list><acme-entity selectable selected label="GitHub Desktop">GitHub Desktop on MacBook Pro<span slot="description">Last used just now</span></acme-entity><acme-entity selectable label="VS Code">VS Code on Windows 11<span slot="description">Last used 10min ago</span></acme-entity></acme-entity-list>`,
    },
    {
      h: "Skeleton",
      html: `<acme-entity loading></acme-entity>`,
    },
  ],
  practices: {
    "When to use": ["Member rows, integration rows, domain rows. Table for sortable columns; Description for a static key/value block."],
    Content: ["Lead with an avatar or icon, a Title Case label, then sentence-case metadata; right-column buttons are Verb + Noun (Remove Member)."],
  },
};
