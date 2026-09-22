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
      html: `<ul aria-label="Transactions"><li><acme-item amount="−$1,200.00"><acme-credit-card-icon slot="lead" class="ic" focusable="false" size="16px"></acme-credit-card-icon>Rent<span slot="meta">Sep 1 · Housing</span></acme-item></li><li><acme-item amount="+$8,400.00"><acme-attach-money-icon slot="lead" class="ic" focusable="false" size="16px"></acme-attach-money-icon>Severance<span slot="meta">Sep 5 · Income</span><div slot="tags" class="row"><acme-tag>net</acme-tag></div></acme-item></li><li><acme-item href="#" amount="−$62.10"><acme-wifi-icon slot="lead" class="ic" focusable="false" size="16px"></acme-wifi-icon>Internet<span slot="meta">Sep 8 · Utilities</span><acme-button slot="actions" size="small" variant="tertiary" aria-label="Edit Internet transaction">Edit</acme-button></acme-item></li></ul>`,
    },
    {
      h: "Large amount",
      html: `<acme-item large amount="$62,450"><acme-avatar slot="lead" initials="PK" label="Peter Kloss"></acme-avatar>Cash today<span slot="meta">Across 3 accounts</span><acme-badge slot="title-extra" variant="green" contrast="low">Healthy</acme-badge></acme-item>`,
    },
  ],
};
