// Docs page: Tabs — mirrors https://vercel.com/geist/tabs
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "tabs",
  title: "Tabs",
  lede: "Switch between sibling views inside a single page.",
  tags: ["acme-tabs", "acme-tab", "acme-tab-panel"],
  examples: [
    {
      h: "Default",
      html: `<acme-tabs value="apple" aria-label="Fruit"><acme-tab value="apple">Apple</acme-tab><acme-tab value="orange">Orange</acme-tab><acme-tab value="mango">Mango</acme-tab></acme-tabs>`,
    },
    {
      h: "With panels",
      html: `<acme-tabs value="overview" aria-label="Project"><acme-tab value="overview">Overview</acme-tab><acme-tab value="logs">Logs</acme-tab><acme-tab-panel slot="panels" value="overview"><p class="text-copy-14" style="padding:16px 0">The overview panel.</p></acme-tab-panel><acme-tab-panel slot="panels" value="logs"><p class="text-copy-14" style="padding:16px 0">The logs panel.</p></acme-tab-panel></acme-tabs>`,
    },
    {
      h: "Disabled",
      html: `<acme-tabs value="apple" aria-label="Fruit"><acme-tab value="apple" disabled>Apple</acme-tab><acme-tab value="orange" disabled>Orange</acme-tab><acme-tab value="mango" disabled>Mango</acme-tab></acme-tabs>`,
    },
    {
      h: "Disable specific tabs",
      html: `<acme-tabs value="apple" aria-label="Fruit"><acme-tab value="apple">Apple</acme-tab><acme-tab value="orange">Orange</acme-tab><acme-tab value="mango" disabled tooltip="Only visible to project owners.">Mango</acme-tab></acme-tabs>`,
    },
    {
      h: "With icons",
      html: `<acme-tabs value="github" aria-label="Git provider"><acme-tab value="github"><svg class="ic" slot="icon" aria-hidden="true"><use href="#i-github"/></svg>GitHub</acme-tab><acme-tab value="gitlab"><svg class="ic" slot="icon" aria-hidden="true"><use href="#i-branch"/></svg>GitLab</acme-tab><acme-tab value="bitbucket"><svg class="ic" slot="icon" aria-hidden="true"><use href="#i-commit"/></svg>Bitbucket</acme-tab></acme-tabs>`,
    },
    {
      h: "Secondary",
      html: `<acme-tabs secondary value="github" aria-label="Git provider"><acme-tab value="github">GitHub</acme-tab><acme-tab value="gitlab">GitLab</acme-tab><acme-tab value="bitbucket" disabled>Bitbucket</acme-tab></acme-tabs>`,
    },
  ],
  practices: {
    "When to use": ["Sibling views inside one page (Overview, Logs, Settings); a sub-menu for unrelated pages. Cap at 5–7 on desktop."],
    Behavior: ["Selection is instant and lives in the URL; a disabled tab gets a tooltip naming the constraint; Left/Right move focus."],
    Content: ["Title Case 1–2 word nouns; no counts in the title, a badge slot instead."],
  },
};
