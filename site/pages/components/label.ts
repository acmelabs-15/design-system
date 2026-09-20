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
      html: `<acme-label for="test-input" value="This is a label"></acme-label>`,
    },
    {
      h: "With Input",
      p: "with-input adds the spacing above the input; for focuses the input on click.",
      html: `<acme-label for="test-input" value="Email Address" with-input></acme-label>
<acme-input id="test-input" placeholder="Enter email address..."></acme-input>`,
    },
    {
      h: "Bypass Casing",
      p: "bypass-casing keeps the text as written.",
      html: `<acme-label bypass-casing for="test-input" value="Email address" with-input></acme-label>
<acme-input id="test-input" placeholder="Enter email address..."></acme-input>`,
    },
  ],
};
