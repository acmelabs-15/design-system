// Docs page: Split Button — mirrors https://vercel.com/geist/split-button
import type { Doc } from "../../site";

const SIZES = ["small", "medium", "large"] as const;
const VARIANTS = ["primary", "secondary"] as const;
const saveItems = `<acme-split-button-item slot="items" description="Save changes">Save</acme-split-button-item><acme-split-button-item slot="items" description="Save changes and create a new production deployment">Save + Redeploy</acme-split-button-item>`;
const icon = (name: string) => `<svg class="ic" width="18" height="18" style="width:18px;height:18px" slot="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const saveItemsWithIcons = `<acme-split-button-item slot="items" description="Save changes">${icon("floppy")}Save</acme-split-button-item><acme-split-button-item slot="items" description="Save changes and create a new production deployment">${icon("arrow-circle-up")}Save + Redeploy</acme-split-button-item>`;
const split = (variant: string, size: string, items: string) =>
  `<acme-split-button variant="${variant}"${size === "medium" ? "" : ` size="${size}"`} menu-button-label="Select save method" menu-width="264">Save${items}</acme-split-button>`;
const grid = (items: string, rowGap: number) =>
  `<div class="vstack" style="gap:32px;align-items:flex-start">${VARIANTS.map((v) => `<div class="row" style="gap:${rowGap}px;align-items:stretch;flex-wrap:nowrap">${SIZES.map((s) => split(v, s, items)).join("")}</div>`).join("")}</div>`;
const alerts = `for (const b of root.querySelectorAll('acme-split-button')) {
  b.addEventListener('acme-click', () => alert('Clicked Saved'));
  b.addEventListener('acme-select', e => alert('Clicked ' + e.target.textContent.trim()));
}`;

export const doc: Doc = {
  id: "split-button",
  title: "Split Button",
  lede: "A button with one primary action and a dropdown menu of further actions.",
  tags: ["acme-split-button", "acme-split-button-item"],
  examples: [
    {
      h: "Default",
      p: "The primary action is also the first item in the menu.",
      html: grid(saveItems, 16),
      script: alerts,
    },
    {
      h: "Menu Alignment",
      html: `<div class="row" style="gap:32px;align-items:flex-start">${split("primary", "medium", saveItems)}<acme-split-button menu-alignment="bottom-end" menu-button-label="Select save method" menu-width="264">Save${saveItems}</acme-split-button></div>`,
      script: alerts,
    },
    {
      h: "Icon",
      html: `<acme-split-button variant="secondary" size="small" menu-button-label="Copy page" menu-width="240">Copy page<acme-split-button-item slot="items" description="Open this page in v0">${icon("v0")}Open in v0</acme-split-button-item><acme-split-button-item slot="items" description="Open this page in ChatGPT">${icon("openai")}Open in ChatGPT</acme-split-button-item></acme-split-button>`,
      script: `const b = root.querySelector('acme-split-button');
b.addEventListener('acme-click', () => console.log('Copy page'));
b.addEventListener('acme-select', e => console.log(e.target.textContent.trim()));`,
    },
    {
      h: "Title with Icon",
      html: grid(saveItemsWithIcons, 4),
      script: alerts,
    },
  ],
  practices: {
    "Best Practices": [
      "Use a Split Button when one action is the clear default and one to four close variants belong next to it, like <code>Deploy</code> with <code>Deploy to Preview</code>. Unrelated actions go in a Menu.",
      "Repeat the primary action as the first menu item so keyboard and screen-reader users see the same options. The visible label and the first item match exactly.",
      "Only <code>primary</code> and <code>secondary</code> are allowed. The destructive variants are blocked on purpose: a delete hidden in a dropdown is a sharp edge.",
      "Every item label is Title Case, Verb + Noun: <code>Deploy to Production</code>, <code>Promote to Production</code>, <code>Rollback Deployment</code>. Destructive items sit at the bottom behind a divider.",
      "Set <code>menu-button-label</code> to a sentence that names the action set, like <code>More deploy options</code>. It becomes the <code>aria-label</code> of the chevron button and is the only label a screen reader hears for it.",
      'The default <code>menu-alignment="bottom-start"</code> puts the menu under the primary button. Use <code>bottom-end</code> only when the button sits flush with the right edge of its container.',
    ],
  },
};
