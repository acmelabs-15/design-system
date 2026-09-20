// Docs page: Error Card — mirrors https://vercel.com/geist/error-card
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "error-card",
  title: "Error Card",
  lede: "A card used to communicate an error state with a title and message.",
  tags: ["acme-error-card"],
  examples: [
    {
      h: "Default",
      html: `<acme-error-card heading="No credits left" error='{"message":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod"}'></acme-error-card>`,
    },
    {
      h: "Retry", census: true,
      p: "<code>retry</code> appends the Retry control under the title; a click on it dispatches <code>acme-retry</code>. <code>retry-label</code> names it for assistive technology.",
      html: `<acme-error-card heading="Couldn't load deployments" retry retry-label="Retry loading deployments"></acme-error-card>`,
      script: `root.querySelector("acme-error-card").addEventListener("acme-retry", () => console.log("retry"));`,
    },
  ],
};
