import type { Doc } from "../../site";

export const doc: Doc = {
  id: "snippet",
  title: "Snippet",
  lede: "Copyable command text with optional prompts and semantic color variants.",
  tags: ["acme-snippet"],
  examples: [
    { h: "Command", html: '<acme-snippet text="bun add @acmelabs/design-system"></acme-snippet>' },
    { h: "Multiple lines", html: '<acme-snippet text=\'["cd project","bun install","bun run dev"]\'></acme-snippet>' },
    { h: "Output", html: '<acme-snippet prompt="false" text="https://example.com/releases"></acme-snippet>' },
    { h: "Small", html: '<acme-snippet size="small" text="bun run build"></acme-snippet>' },
    {
      h: "Variants",
      html: '<acme-v-stack gap="3"><acme-snippet variant="success" text="Deployment complete" prompt="false"></acme-snippet><acme-snippet variant="warning" text="Review the output" prompt="false"></acme-snippet><acme-snippet variant="error" text="Build failed" prompt="false"></acme-snippet></acme-v-stack>',
    },
    { h: "Theme scope", html: '<acme-theme appearance="dark"><acme-snippet text="bun run dev"></acme-snippet></acme-theme>' },
    {
      h: "Copy override",
      p: "The visible description and copied source can differ. An explicitly empty copy-text copies an empty string.",
      html: '<acme-snippet text="Copy the installation command" copy-text="bun add @acmelabs/design-system" prompt="false"></acme-snippet><output aria-live="polite"></output>',
      script:
        'root.querySelector("acme-snippet").addEventListener("acme-copy",()=>root.querySelector("output").textContent="Command copied");root.querySelector("acme-snippet").addEventListener("acme-error",()=>root.querySelector("output").textContent="Could not copy command");',
    },
    { h: "Leading and trailing content", html: '<acme-snippet text="bun run test"><acme-terminal-icon slot="start"></acme-terminal-icon><acme-badge slot="end">Local</acme-badge></acme-snippet>' },
    { h: "Text only", html: '<acme-snippet copyable="false" prompt="false" text="All checks passed"></acme-snippet>' },
  ],
  practices: {
    Data: [
      "Supply a string or an array of strings. Arrays display one command per entry and copy with newline separators.",
      "Prompt symbols are decorative and are excluded from copied data. All source text is escaped.",
      "Supply a replacement array when the source changes. Copy Button owns clipboard feedback and emits its result once.",
    ],
    Layout: [
      "The surrounding layout sets width. Long lines use the shared horizontal Scroll Area.",
      "Use Theme for appearance and the small or medium size for spacing. Start and end slots contain optional supporting content.",
    ],
    Accessibility: [
      "The copy action remains keyboard accessible. Listen for acme-error to show application feedback if clipboard access fails.",
      "Do not include secrets in examples intended to be shared or copied.",
    ],
  },
};
