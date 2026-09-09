// Docs page: Filter (house component)
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "filter",
  title: "Filter",
  lede: "The Vercel filter chips: a pill that names a key and value with a remove, a dashed suggestion, and the add trigger.",
  tags: ["acme-filter", "acme-filters"],
  house: true,
  examples: [
    {
      h: "Filter row",
      html: `<acme-filters><acme-filter add><svg class="ic" slot="icon" aria-hidden="true"><use href="#i-filter"/></svg>Add Filter</acme-filter><acme-filter key="Status" value="Error" removable></acme-filter><acme-filter key="Author" value="loriensleafs" suggest></acme-filter></acme-filters>`,
    },
  ],
};
