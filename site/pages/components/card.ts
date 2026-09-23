import type { Doc } from "../../site";
export const doc: Doc = {
  id: "card",
  title: "Card",
  tags: ["acme-card", "acme-card-header", "acme-card-body", "acme-card-footer"],
  lede: "One surface for related content, with optional header, body and footer regions.",
  examples: [
    {
      h: "Sections",
      html: '<acme-card><acme-card-header><acme-heading as="h3" size="20px">Project overview</acme-heading><acme-text>Shared components and clear interfaces.</acme-text></acme-card-header><acme-card-body>The body accepts text, forms, lists and other content.</acme-card-body><acme-card-footer><acme-button>Open project</acme-button><acme-button variant="secondary">Manage</acme-button></acme-card-footer></acme-card>',
    },
    {
      h: "Variants",
      html: `<acme-simple-grid columns='{"compact":1,"expanded":3}' gap="4"><acme-card><acme-card-body>Default</acme-card-body></acme-card><acme-card variant="outline"><acme-card-body>Outline</acme-card-body></acme-card><acme-card variant="subtle"><acme-card-body>Subtle</acme-card-body></acme-card></acme-simple-grid>`,
    },
    {
      h: "Sizes",
      html: '<acme-stack gap="4"><acme-card size="small"><acme-card-body>Small</acme-card-body></acme-card><acme-card><acme-card-body>Medium</acme-card-body></acme-card><acme-card size="large"><acme-card-body>Large</acme-card-body></acme-card></acme-stack>',
    },
    {
      h: "Inset media",
      html: '<acme-card variant="outline"><acme-card-body><acme-inset side="block-start"><div style="height:120px;background:var(--ds-blue-300);display:grid;place-items:center">Media</div></acme-inset><acme-heading as="h3" size="20px" style="margin-top:16px">One content surface</acme-heading><acme-text>Inset reads the section padding and corner radius.</acme-text></acme-card-body></acme-card>',
    },
    {
      h: "Linked surface with independent action",
      html: '<acme-card id="linked-card" as="article" variant="outline"><acme-card-body><acme-heading as="h3" size="20px"><a href="#project-record"><span aria-hidden="true" style="position:absolute;inset:0"></span>Project record</a></acme-heading><acme-text>The link covers the surface. The secondary action remains independent.</acme-text><acme-button id="card-manage" variant="secondary" style="position:relative;z-index:1">Manage project</acme-button><output id="card-action-result"></output></acme-card-body></acme-card>',
      script: 'root.querySelector("#card-manage").addEventListener("click",()=>{root.querySelector("#card-action-result").textContent="Manage selected";});',
    },
    {
      h: "Custom theme hooks",
      html: '<acme-card variant="outline" style="--acme-card-padding:32px;--acme-card-radius:16px"><acme-card-body>Padding and radius remain consistent with an Inset in this surface.</acme-card-body></acme-card>',
    },
  ],
  practices: {
    Composition: [
      "Card owns the surface. Use Card Body for padded content. Header and Footer are optional regions; compose Heading and Text for their meaning.",
      "Keep independent controls outside the main link. The stretched-link example uses one real anchor and a separate action above its hit area.",
      "Card has no selected, open or activation state. Use Radio Card or Checkbox Card when the surface represents a selection.",
      "Use as=section or as=article when that meaning fits the content. Choose heading levels for the surrounding document.",
      "Section padding follows size and --acme-card-padding. Use --acme-card-radius to keep the surface and inset media corners in agreement.",
    ],
  },
};
