import type { Doc } from "../../site";

export const doc: Doc = {
  id: "tag",
  title: "Tag",
  tags: ["acme-tag"],
  lede: "A passive keyword or category label.",
  examples: [
    { h: "Keywords", html: '<div class="row"><acme-tag>TypeScript</acme-tag><acme-tag>Web components</acme-tag></div>' },
    { h: "Sizes", html: '<div class="row"><acme-tag size="small">Small</acme-tag><acme-tag>Medium</acme-tag><acme-tag size="large">Large</acme-tag></div>' },
    {
      h: "Removable tag",
      html: '<acme-h-stack id="removable-tag-example" gap="1"><acme-tag>TypeScript</acme-tag><acme-icon-button size="tiny" variant="tertiary" aria-label="Remove TypeScript"><acme-close-icon></acme-close-icon></acme-icon-button></acme-h-stack>',
      script: 'const example = root.querySelector("#removable-tag-example"); example.querySelector("acme-icon-button").addEventListener("click", () => { example.remove(); });',
    },
  ],
};
