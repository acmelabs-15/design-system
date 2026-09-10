// Docs page: Checkbox — mirrors https://vercel.com/geist/checkbox
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "checkbox",
  title: "Checkbox",
  lede: "A control that switches between two options: checked or unchecked.",
  tags: ["acme-checkbox"],
  examples: [
    {
      h: "Default",
      p: "A controlled checkbox: the page holds the state and writes it back on every change.",
      html: `<acme-checkbox>Option 1</acme-checkbox>`,
      script: `let checked = false;
const box = root.querySelector('acme-checkbox');
box.addEventListener('acme-change', () => {
  checked = !checked;
  box.checked = checked;
});`,
    },
    {
      h: "Disabled",
      html: `<div class="vstack" style="gap:16px;align-items:stretch"><acme-checkbox disabled>Disabled</acme-checkbox><acme-checkbox checked disabled>Disabled Checked</acme-checkbox><acme-checkbox disabled indeterminate>Disabled Indeterminate</acme-checkbox></div>`,
    },
    {
      h: "Indeterminate",
      html: `<acme-checkbox indeterminate>Option 1</acme-checkbox>`,
    },
  ],
  practices: {
    "When to use": [
      "Multi-select inside a list: table-row pickers, multi-pick filters and opt-in preference groups.",
      "An acknowledgment where the user must confirm one statement (terms of service, an irreversible export).",
      "A single boolean setting such as dark mode or password protection is a Toggle; on/off reads clearer there than a lone checkbox.",
    ],
    Behavior: [
      "Indeterminate is a visual state, not a third value. A parent that knows the partial selection sets it, and clears it as soon as every child is fully checked or unchecked.",
      "Validation of a required acknowledgment runs on submit, not on blur, so checking and unchecking does not flash an error.",
      "A disabled checkbox still needs a Tooltip that names the reason; a gray box with no explanation reads as a bug.",
    ],
    Content: [
      "The group label above a fieldset is a Title Case noun such as Notifications or Required Permissions, with no colon.",
      "An acknowledgment label is a full sentence with a period: I agree to the Terms of Service.",
      "Indeterminate copy names the partial count next to the group label (3 of 5 selected). Never leave the dash state without a label.",
    ],
    Accessibility: [
      "Wrap related checkboxes in a fieldset with a legend, so screen readers announce the group name before each option.",
      'A row-select checkbox in a table has no visible label. Set aria-label="Select {row name}" so the row stays identifiable out of context.',
      "The click target already covers the label. Do not replace the label association with a custom wrapper that breaks the click region.",
    ],
  },
};
