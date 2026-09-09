// Docs page: Metric List (house component)
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "metric-list",
  title: "Metric List",
  lede: "A column of selectable metric cards with a grade threshold.",
  tags: ["acme-metric-list", "acme-metric"],
  house: true,
  examples: [
    {
      h: "Default",
      html: `<acme-metric-list value="lcp" style="display:block;max-width:280px"><acme-metric value="lcp" label="LCP" unit="s" grade="good">1.2</acme-metric><acme-metric value="inp" label="INP" unit="ms" grade="mid">240</acme-metric><acme-metric value="cls" label="CLS" grade="bad">0.31</acme-metric></acme-metric-list>`,
    },
  ],
};
