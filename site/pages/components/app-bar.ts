// Docs page: App Bar (house component)
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "app-bar",
  title: "App Bar",
  lede: "The sticky top bar: brand left, section links middle, tools right, with the theme switcher built in.",
  tags: ["acme-appbar"],
  house: true,
  examples: [
    {
      h: "Default",
      html: `<acme-appbar name="Runway" meta="ledger" style="margin:-24px;position:static"><svg class="ic" width="16" height="16" slot="logo" aria-hidden="true"><use href="#i-chart"/></svg><a href="#" aria-current="true">Overview</a><a href="#">Cash</a><a href="#">Plan</a></acme-appbar>`,
    },
    {
      h: "With crumbs and tools",
      html: `<acme-appbar name="ACME" no-theme style="margin:-24px;position:static"><svg class="ic" width="16" height="16" slot="logo" aria-hidden="true"><use href="#i-chart"/></svg><acme-breadcrumbs slot="crumbs" variant="menu"><a href="#">acme-labs</a><span aria-current="page">design-system</span></acme-breadcrumbs><acme-button slot="tools" size="small">Feedback</acme-button><acme-avatar slot="tools" size="24" letter="PK"></acme-avatar></acme-appbar>`,
    },
  ],
};
