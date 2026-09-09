// Docs page: Scroller — mirrors https://vercel.com/geist/scroller
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "scroller",
  title: "Scroller",
  lede: "Display an overflowing list of items along one axis with edge fades.",
  tags: ["acme-scroller"],
  examples: [
    {
      h: "Horizontal",
      html: `<acme-scroller><div style="flex:none;width:232px;height:120px;border-radius:6px;background:var(--ds-gray-1000);color:var(--ds-background-100);display:grid;place-items:center;font-weight:500">1</div><div style="flex:none;width:232px;height:120px;border-radius:6px;background:var(--ds-gray-1000);color:var(--ds-background-100);display:grid;place-items:center;font-weight:500">2</div><div style="flex:none;width:232px;height:120px;border-radius:6px;background:var(--ds-gray-1000);color:var(--ds-background-100);display:grid;place-items:center;font-weight:500">3</div><div style="flex:none;width:232px;height:120px;border-radius:6px;background:var(--ds-gray-1000);color:var(--ds-background-100);display:grid;place-items:center;font-weight:500">4</div><div style="flex:none;width:232px;height:120px;border-radius:6px;background:var(--ds-gray-1000);color:var(--ds-background-100);display:grid;place-items:center;font-weight:500">5</div><div style="flex:none;width:232px;height:120px;border-radius:6px;background:var(--ds-gray-1000);color:var(--ds-background-100);display:grid;place-items:center;font-weight:500">6</div><div style="flex:none;width:232px;height:120px;border-radius:6px;background:var(--ds-gray-1000);color:var(--ds-background-100);display:grid;place-items:center;font-weight:500">7</div><div style="flex:none;width:232px;height:120px;border-radius:6px;background:var(--ds-gray-1000);color:var(--ds-background-100);display:grid;place-items:center;font-weight:500">8</div></acme-scroller>`,
    },
    {
      h: "With buttons",
      html: `<acme-scroller buttons label="customer logos"><div style="flex:none;width:160px;height:80px;border-radius:6px;background:var(--comp);display:grid;place-items:center;font-weight:500">1</div><div style="flex:none;width:160px;height:80px;border-radius:6px;background:var(--comp);display:grid;place-items:center;font-weight:500">2</div><div style="flex:none;width:160px;height:80px;border-radius:6px;background:var(--comp);display:grid;place-items:center;font-weight:500">3</div><div style="flex:none;width:160px;height:80px;border-radius:6px;background:var(--comp);display:grid;place-items:center;font-weight:500">4</div><div style="flex:none;width:160px;height:80px;border-radius:6px;background:var(--comp);display:grid;place-items:center;font-weight:500">5</div><div style="flex:none;width:160px;height:80px;border-radius:6px;background:var(--comp);display:grid;place-items:center;font-weight:500">6</div><div style="flex:none;width:160px;height:80px;border-radius:6px;background:var(--comp);display:grid;place-items:center;font-weight:500">7</div><div style="flex:none;width:160px;height:80px;border-radius:6px;background:var(--comp);display:grid;place-items:center;font-weight:500">8</div></acme-scroller>`,
    },
  ],
};
