// Docs page: Label — mirrors https://vercel.com/geist/label
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "label",
  title: "Label",
  lede: "Accessible text label for form controls.",
  tags: ["acme-label"],
  examples: [
    {
      h: "Default",
      html: `<acme-label>This is a label</acme-label>`,
    },
    {
      h: "With input",
      p: "Input carries its own label; use acme-label for a control that has none.",
      html: `<acme-input label="Email Address" type="email" placeholder="Enter email address..." style="max-width:280px"></acme-input>`,
    },
    {
      h: "Bypass casing",
      html: `<acme-label bypass-casing>Email address</acme-label>`,
    },
  ],
};
