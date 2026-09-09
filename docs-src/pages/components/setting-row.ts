// Docs page: Setting Row (house component)
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "setting-row",
  title: "Setting Row",
  lede: "A title and description with a control at the right; rows stack behind hairlines.",
  tags: ["acme-setting-row", "acme-setting-rows"],
  house: true,
  examples: [
    {
      h: "Rows",
      html: `<acme-setting-rows><acme-setting-row heading="Password Protection">Require a password on every preview deployment.<acme-toggle slot="control" checked aria-label="Password Protection"></acme-toggle></acme-setting-row><acme-setting-row heading="Production Branch">The branch that deploys to production.<acme-select slot="control" options='["main","release"]' aria-label="Branch"></acme-select></acme-setting-row><acme-setting-row heading="Transfer Project">Move this project to another team.<acme-button slot="control" size="small">Transfer</acme-button></acme-setting-row></acme-setting-rows>`,
    },
  ],
};
