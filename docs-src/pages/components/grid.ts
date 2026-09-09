// Docs page: Grid — mirrors https://vercel.com/geist/grid
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "grid",
  title: "Grid",
  lede: "Display elements in a grid with visible guide lines.",
  tags: ["acme-grid", "acme-grid-cell", "acme-grid-cross"],
  examples: [
    {
      h: "Basic grid",
      html: `<acme-grid columns="3"><acme-grid-cell>1</acme-grid-cell><acme-grid-cell>2</acme-grid-cell><acme-grid-cell>3</acme-grid-cell><acme-grid-cell>4</acme-grid-cell><acme-grid-cell>5</acme-grid-cell><acme-grid-cell>6</acme-grid-cell></acme-grid>`,
    },
    {
      h: "Solid cells",
      p: "A solid cell occludes the guides it overlaps.",
      html: `<acme-grid columns="3"><acme-grid-cell solid span="2">1 + 2</acme-grid-cell><acme-grid-cell>3</acme-grid-cell><acme-grid-cell>4</acme-grid-cell><acme-grid-cell solid span="2">5 + 6</acme-grid-cell></acme-grid>`,
    },
    {
      h: "Hidden guides",
      html: `<div class="vstack" style="gap:24px"><acme-grid columns="6" hide-guides="row"><acme-grid-cell></acme-grid-cell><acme-grid-cell></acme-grid-cell><acme-grid-cell></acme-grid-cell><acme-grid-cell></acme-grid-cell><acme-grid-cell></acme-grid-cell><acme-grid-cell></acme-grid-cell></acme-grid><acme-grid columns="6" hide-guides="column"><acme-grid-cell></acme-grid-cell><acme-grid-cell></acme-grid-cell><acme-grid-cell></acme-grid-cell><acme-grid-cell></acme-grid-cell><acme-grid-cell></acme-grid-cell><acme-grid-cell></acme-grid-cell></acme-grid></div>`,
    },
    {
      h: "Dashed grid with cross and page",
      html: `<acme-grid columns="1" dashed page><acme-grid-cross slot="cross" style="left:0;top:0"></acme-grid-cross><acme-grid-cross slot="cross" style="right:-11px;top:0;transform:translate(0,-50%)"></acme-grid-cross><acme-grid-cell>Content here</acme-grid-cell></acme-grid>`,
    },
    {
      h: "Debug",
      html: `<acme-grid columns="5" debug><acme-grid-cell></acme-grid-cell><acme-grid-cell></acme-grid-cell><acme-grid-cell></acme-grid-cell><acme-grid-cell></acme-grid-cell><acme-grid-cell></acme-grid-cell></acme-grid>`,
    },
  ],
  practices: {
    "When to use": ["Marketing pages, docs landings and feature breakdowns where the rule lines are part of the design; plain CSS grid for app content."],
    Behavior: ["Set columns and rows at every breakpoint; solid cells for opaque tiles; hide guides only when it helps; never nest more than one level; guides are aria-hidden."],
  },
};
