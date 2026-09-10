// Docs page: Item (house component)
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "item",
  title: "Item",
  lede: "The list row: a lead, a title and meta, an amount and tags, actions.",
  tags: ["acme-item", "acme-items"],
  house: true,
  examples: [
    {
      h: "Rows",
      html: `<acme-items boxed><acme-item amount="−$1,200.00"><acme-ricon slot="lead" hue="blue"><svg class="ic" width="16" height="16" aria-hidden="true"><use href="#i-card"/></svg></acme-ricon>Rent<span slot="meta">Sep 1 · Housing</span></acme-item><acme-item amount="+$8,400.00"><acme-ricon slot="lead" hue="green"><svg class="ic" width="16" height="16" aria-hidden="true"><use href="#i-dollar"/></svg></acme-ricon>Severance<span slot="meta">Sep 5 · Income</span><acme-tags slot="tags"><acme-tag>net</acme-tag></acme-tags></acme-item><acme-item href="#" amount="−$62.10"><acme-ricon slot="lead" hue="amber"><svg class="ic" width="16" height="16" aria-hidden="true"><use href="#i-wifi"/></svg></acme-ricon>Internet<span slot="meta">Sep 8 · Utilities</span><acme-button slot="actions" size="small" variant="tertiary">Edit</acme-button></acme-item></acme-items>`,
    },
    {
      h: "Striped, large amount",
      html: `<acme-items striped><acme-item large amount="$62,450"><acme-avatar slot="lead" letter="PK"></acme-avatar>Cash today<span slot="meta">Across 3 accounts</span><acme-badge slot="end" hue="green" subtle>Healthy</acme-badge></acme-item></acme-items>`,
    },
  ],
};
