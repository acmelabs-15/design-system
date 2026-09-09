// Docs page: Input — mirrors https://vercel.com/geist/input
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "input",
  title: "Input",
  lede: "Retrieve text input from a user.",
  tags: ["acme-input"],
  examples: [
    {
      h: "Size",
      html: `<div class="row" style="gap:16px;align-items:flex-start"><acme-input size="small" placeholder="Small" aria-label="Small" style="width:194px"></acme-input><acme-input placeholder="Medium" aria-label="Medium" style="width:194px"></acme-input><acme-input size="large" placeholder="Large" aria-label="Large" style="width:221px"></acme-input></div>`,
    },
    {
      h: "Prefix and suffix",
      html: `<div class="vstack" style="gap:16px;max-width:340px"><acme-input prefix="https://" suffix=".com" placeholder="Default" aria-label="URL"></acme-input><acme-input prefix="vercel/" placeholder="Default" aria-label="Repository"></acme-input></div>`,
    },
    {
      h: "Disabled",
      html: `<acme-input placeholder="Disabled with placeholder" disabled style="max-width:194px"></acme-input>`,
    },
    {
      h: "Error",
      html: `<acme-input type="email" value="long-error@gmail.com" error="An error message." style="max-width:194px"></acme-input>`,
    },
    {
      h: "Label and helper",
      html: `<acme-input label="Label" placeholder="Label" helper="Helper text." style="max-width:194px"></acme-input>`,
    },
    {
      h: "Rounded prefix and suffix",
      html: `<acme-input rounded prefix="www." suffix=".com" placeholder="Label example" aria-label="Domain" style="max-width:340px"></acme-input>`,
    },
  ],
  practices: {
    Behavior: ["Validate on blur, not on every keystroke; trim whitespace before submit; keep the field focusable while saving."],
    Content: [
      "Labels are short Title Case nouns; placeholders show an example value, never an instruction.",
      "Helper text is one sentence with a period; validation names the field and the constraint and skips please.",
    ],
  },
};
