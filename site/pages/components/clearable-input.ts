// Docs page: Clearable Input — mirrors https://vercel.com/geist/clearable-input
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "clearable-input",
  title: "Clearable Input",
  lede: "A text input with a clear button; Escape resets the value too.",
  tags: ["acme-clearable-input"],
  examples: [
    {
      h: "Default",
      html: `<acme-clearable-input aria-label="Demo clearable input" placeholder="Enter some text..."></acme-clearable-input>`,
    },
    {
      h: "With Label",
      html: `<acme-clearable-input label="Email" placeholder="Enter your email..."></acme-clearable-input>`,
    },
    {
      h: "With Cmdk",
      html: `<acme-clearable-input aria-label="Search with cmdk" cmdk placeholder="Search..."></acme-clearable-input>`,
    },
    {
      h: "Disabled",
      html: `<acme-clearable-input aria-label="Disabled clearable input" disabled placeholder="Enter some text..." value="Some text"></acme-clearable-input>`,
    },
    {
      h: "With Clear Callback",
      html: `<div class="vstack" style="gap:8px"><acme-clearable-input aria-label="Clearable input with callback" placeholder="Enter some text and clear..."></acme-clearable-input><p class="text-copy-14" style="color:var(--ds-gray-900)">Cleared <output>0</output> times</p></div>`,
      script: "let count = 0;\nroot.querySelector('acme-clearable-input').addEventListener('acme-clear', () => {\n  root.querySelector('output').textContent = String(++count);\n});",
    },
  ],
};
