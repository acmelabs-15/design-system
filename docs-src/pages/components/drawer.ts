// Docs page: Drawer — mirrors https://vercel.com/geist/drawer
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "drawer",
  title: "Drawer",
  lede: "Content in a separate view that slides up from the bottom on small viewports.",
  tags: ["acme-drawer"],
  examples: [
    {
      h: "Default",
      p: "Shown static here; in a page it is fixed to the bottom over a 40% black scrim.",
      html: `<acme-drawer static heading="A drawer title">Drawer body</acme-drawer>`,
    },
    {
      h: "With actions",
      html: `<acme-drawer static heading="Filter Logs">Narrow the list to one status or route.<div slot="actions" class="row"><acme-button variant="primary">Apply Filters</acme-button><acme-button>Cancel</acme-button></div></acme-drawer>`,
    },
  ],
  practices: {
    "When to use": ["Small viewports only; Modal or Sheet on desktop; never for a destructive confirmation."],
    Behavior: ["Tap-outside and swipe-down dismiss; body scroll locked; focus trapped and returned; Escape and the system back gesture close it."],
  },
};
