// Docs page: Textarea — mirrors https://vercel.com/geist/textarea
import type { Doc } from "../../site";

const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
const sizes = ["small", "medium", "large"];

export const doc: Doc = {
  id: "textarea",
  title: "Textarea",
  lede: "Retrieve multi-line user input.",
  tags: ["acme-textarea"],
  examples: [
    { h: "Default", html: `<acme-textarea aria-label="Default" placeholder="${lorem}" min-height="100"></acme-textarea>` },
    { h: "Disabled", html: `<acme-textarea aria-label="Disabled" disabled placeholder="${lorem}" min-height="100"></acme-textarea>` },
    {
      h: "Error",
      html: `<div class="vstack" style="gap:32px">${sizes.map((s) => `<acme-textarea aria-label="With error (${s})" value="${lorem}" error="There has been an error." size="${s}" min-height="100"></acme-textarea>`).join("")}</div>`,
    },
    {
      h: "Sizes",
      html: `<div class="vstack" style="gap:24px">${sizes.map((s) => `<acme-textarea aria-label="Textarea" value="${lorem}" size="${s}" min-height="100"></acme-textarea>`).join("")}</div>`,
    },
    { h: "Read Only", html: `<acme-textarea aria-label="Read only" value="${lorem}" readonly min-height="100"></acme-textarea>` },
    { h: "Rows", html: `<acme-textarea aria-label="Textarea with fixed rows" placeholder="Textarea with fixed number of rows" rows="5"></acme-textarea>` },
  ],
  practices: {
    "Best Practices": [
      "Use a Textarea for content that wraps to several lines (commit messages, descriptions, notes); an Input takes one value such as a name or a domain.",
      "Set a generous default <code>rows</code> and let the field grow only when the surface has vertical room; never push the primary actions below the fold.",
      "Validate on blur and pass a string to <code>error</code> to show the inline message; it replaces the helper text while the field is invalid.",
      "Trim leading and trailing whitespace on submit so a field of empty lines does not pass a required check.",
      "Labels are short Title Case nouns (Description, Release Notes); a placeholder shows an example value, not an instruction such as Enter a description.",
      "A validation message names the field and the constraint, ends with a period and skips please: Description is required. Release notes can’t exceed 500 characters.",
      "Helper text is one sentence in sentence case with a period, rendered as a sibling linked through <code>aria-describedby</code>.",
    ],
  },
};
