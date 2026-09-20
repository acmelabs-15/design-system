// Docs page: Tile (house component)
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "tile",
  title: "Tile",
  lede: "Small figures in a tinted box; the closed state of a fold.",
  tags: ["acme-tile", "acme-tiles"],
  house: true,
  examples: [
    {
      h: "Default",
      html: `<acme-tiles><acme-tile label="Months">6.6</acme-tile><acme-tile label="Cash" qualifier="today">$8,429</acme-tile><acme-tile label="Burn" qualifier="/mo">$6,000</acme-tile><acme-tile label="Plain" plain>—</acme-tile></acme-tiles>`,
    },
    {
      h: "Large",
      html: `<acme-tiles><acme-tile large label="Requests">12.4k</acme-tile><acme-tile large label="Errors">0.2%</acme-tile></acme-tiles>`,
    },
  ],
};
