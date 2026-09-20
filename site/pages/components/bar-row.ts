// Docs page: Bar Row (house component)
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "bar-row",
  title: "Bar Row",
  lede: "A label, a value, a bar, and the result under it. The allocation row from the finance references.",
  tags: ["acme-bar-row", "acme-bar-rows"],
  house: true,
  examples: [
    {
      h: "Default",
      html: `<acme-bar-rows style="display:block;max-width:420px"><acme-bar-row label="Equities" value="45%" percent="45"><span>Target 50%</span><acme-trend direction="up">+2.1%</acme-trend></acme-bar-row><acme-bar-row label="Bonds" value="30%" percent="30" hue="teal"><span>Target 30%</span><acme-trend>0.0%</acme-trend></acme-bar-row><acme-bar-row label="Cash" value="25%" percent="25" hue="amber"><span>Target 20%</span><acme-trend direction="down">−1.4%</acme-trend></acme-bar-row></acme-bar-rows>`,
    },
    {
      h: "Small, lined",
      html: `<acme-bar-rows lined style="display:block;max-width:420px"><acme-bar-row small label="iad1" value="62%" percent="62"></acme-bar-row><acme-bar-row small label="sfo1" value="28%" percent="28"></acme-bar-row><acme-bar-row small label="fra1" value="10%" percent="10"></acme-bar-row></acme-bar-rows>`,
    },
  ],
};
