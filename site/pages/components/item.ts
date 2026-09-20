// Docs page: Item (house component)
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "item",
  title: "Item",
  lede: "The list row: a lead, a title and meta, an amount and tags, actions.",
  tags: ["acme-item"],
  house: true,
  examples: [
    {
      h: "Rows",
      html: `<ul aria-label="Transactions"><li><acme-item amount="−$1,200.00"><svg slot="lead" class="ic" width="16" height="16" aria-hidden="true" focusable="false"><use href="#i-card"/></svg>Rent<span slot="meta">Sep 1 · Housing</span></acme-item></li><li><acme-item amount="+$8,400.00"><svg slot="lead" class="ic" width="16" height="16" aria-hidden="true" focusable="false"><use href="#i-dollar"/></svg>Severance<span slot="meta">Sep 5 · Income</span><div slot="tags" class="row"><acme-tag>net</acme-tag></div></acme-item></li><li><acme-item href="#" amount="−$62.10"><svg slot="lead" class="ic" width="16" height="16" aria-hidden="true" focusable="false"><use href="#i-wifi"/></svg>Internet<span slot="meta">Sep 8 · Utilities</span><acme-button slot="actions" size="small" variant="tertiary" aria-label="Edit Internet transaction">Edit</acme-button></acme-item></li></ul>`,
    },
    {
      h: "Large amount",
      html: `<acme-item large amount="$62,450"><acme-avatar slot="lead" letter="PK"></acme-avatar>Cash today<span slot="meta">Across 3 accounts</span><acme-badge slot="title-extra" variant="green" contrast="low">Healthy</acme-badge></acme-item>`,
    },
  ],
};
