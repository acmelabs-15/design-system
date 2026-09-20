// Docs page: Key Value (house component)
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "kv",
  title: "Key Value",
  lede: "A key-value row with a hairline: the key with a sub line, an optional when, the value and its conversion.",
  tags: ["acme-kv"],
  house: true,
  examples: [
    {
      h: "Rows",
      html: `<div style="max-width:420px"><acme-kv when="Sep 30">Rent<span slot="sub">Monthly</span><span slot="value">$1,200</span></acme-kv><acme-kv when="Oct 3" soon>Insurance<span slot="sub">Quarterly</span><span slot="value">€310</span><span slot="conv">≈ $338</span></acme-kv><acme-kv>Runway<span slot="value">6.6 mo</span></acme-kv></div>`,
    },
  ],
};
