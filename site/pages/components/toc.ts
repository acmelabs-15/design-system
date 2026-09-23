import type { Doc } from "../../site";

const example = (id: string, variant = "line") =>
  `<acme-h-stack align="start" gap="6"><acme-toc source="#${id}" variant="${variant}" offset="16px"></acme-toc><article id="${id}" style="height:240px;overflow:auto;flex:1;min-width:0;border:1px solid var(--ds-gray-alpha-400);padding:16px"><section style="min-height:280px"><h2 id="${id}-overview">Overview</h2><p>Use real headings and stable IDs for document navigation.</p></section><section style="min-height:280px"><h3 id="${id}-details">Details</h3><p>Scroll this article or follow a link.</p></section><section style="min-height:280px"><acme-heading as="h2" id="${id}-next">Next steps</acme-heading><p>Registered Heading components are discovered too.</p></section></article></acme-h-stack>`;
export const doc: Doc = {
  id: "toc",
  title: "Table of Contents",
  lede: "Native fragment links with an observed current section.",
  tags: ["acme-toc"],
  examples: [
    { h: "Scrollable article", html: example("toc-article"), script: 'const toc=root.querySelector("acme-toc");toc.scrollRoot=root.querySelector("article");' },
    { h: "Numbered links", html: example("toc-numbered", "numbers"), script: 'const toc=root.querySelector("acme-toc");toc.scrollRoot=root.querySelector("article");' },
    {
      h: "Explicit entries",
      html: example("toc-explicit", "minimal"),
      script:
        'const toc=root.querySelector("acme-toc");toc.scrollRoot=root.querySelector("article");toc.items=[{id:"toc-explicit-overview",href:"#toc-explicit-overview",label:"Start here",level:2},{id:"toc-explicit-next",href:"#toc-explicit-next",label:"Continue",level:2}];',
    },
  ],
  practices: {
    Targets: [
      "Supply stable IDs on headings. Missing or duplicate target IDs are reported and omitted; Table of Contents never creates IDs in your content.",
      "source accepts an Element or a selector in the author tree. When omitted, discovery uses that tree. Native headings and registered Heading targets are supported; arbitrary private shadow trees are not searched.",
      "levels selects discovered heading levels; the default is [2, 3]. Supplying items replaces discovery, including an explicit empty array. Each item requires id, href, label and level. Links must identify a target in the same document and source.",
    ],
    Navigation: [
      "scrollRoot selects a scrolling element; the default is document scrolling. offset is a CSS length that leaves clearance above the target, including for sticky headers.",
      "Links keep native href behavior. Ordinary activation updates the fragment, focuses the heading and scrolls to it. Modified clicks retain browser behavior. Reduced motion disables smooth scrolling.",
      "current is a read-only observed ID. acme-current-change reports { current }; it does not own application routing. The current link exposes aria-current=location.",
      "line, minimal and numbers change presentation. Use aria-label when the page contains multiple tables of contents.",
    ],
  },
};
