// Docs page: Banner — mirrors https://vercel.com/geist/banner
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "banner",
  title: "Banner",
  lede: "A prominent message that spans the full width of its container to announce important information.",
  tags: ["acme-banner"],
  examples: [
    {
      h: "Default",
      p: "The wide row shows from 961px; below it one button holds the whole message. A page styles the row through ::part(banner) and the mobile button through ::part(mobile).",
      html: `<style>.padded::part(banner){padding:16px}</style><acme-banner class="padded" href="#" button="Read more"><b>Big News</b> – New components finally available</acme-banner>`,
    },
  ],
};
