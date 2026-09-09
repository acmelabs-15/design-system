// Docs page: Banner — mirrors https://vercel.com/geist/banner
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "banner",
  title: "Banner",
  lede: "A full-width message that announces important information.",
  tags: ["acme-banner"],
  examples: [
    {
      h: "Default",
      html: `<acme-banner style="display:block;margin:-24px"><b>Vercel Ship 2026</b> is on Sep 24. Save your seat.<acme-button slot="action">Register Now</acme-button></acme-banner>`,
    },
  ],
};
