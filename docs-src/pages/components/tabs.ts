// Docs page: Tabs — mirrors https://vercel.com/geist/tabs
import type { Doc } from "../../site";

const fruit = (extra = "", mango = "") =>
  `<acme-tabs value="apple"${extra}><acme-tab value="apple">Apple</acme-tab><acme-tab value="orange">Orange</acme-tab><acme-tab value="mango"${mango}>Mango</acme-tab></acme-tabs>`;

export const doc: Doc = {
  id: "tabs",
  title: "Tabs",
  lede: "Display tab content.",
  tags: ["acme-tabs", "acme-tab", "acme-tab-panel"],
  examples: [
    { h: "Default", html: fruit() },
    { h: "Disabled", html: fruit(" disabled") },
    { h: "Disable specific tabs", html: fruit("", ' disabled tooltip="Mangos are not allowed"') },
    {
      h: "With icons",
      html: `<acme-tabs value="github"><acme-tab value="github"><svg class="ic" width="16" height="16" slot="icon" aria-hidden="true"><use href="#i-github"/></svg>GitHub</acme-tab><acme-tab value="gitlab"><svg class="ic" width="16" height="16" slot="icon" aria-hidden="true"><use href="#i-gitlab"/></svg>GitLab</acme-tab><acme-tab value="bitbucket"><svg class="ic" width="16" height="16" slot="icon" aria-hidden="true" style="color:#2684ff"><use href="#i-bitbucket"/></svg>Bitbucket</acme-tab></acme-tabs>`,
    },
    {
      h: "Secondary",
      html: `<acme-tabs variant="secondary" value="github"><acme-tab value="github">GitHub</acme-tab><acme-tab value="gitlab">GitLab</acme-tab><acme-tab value="bitbucket" disabled>Bitbucket</acme-tab></acme-tabs>`,
    },
  ],
  practices: {
    "When to use": [
      "Use Tabs to move between sibling views inside one page: Overview, Logs, Settings.",
      "Navigation between unrelated pages is a sub-menu, not Tabs. Tabs say the views share scope, URL parent and data.",
      "Cap a row at 5–7 tabs on desktop and 3–4 on mobile. Past that, merge views or move secondary ones into a Menu.",
    ],
    Behavior: [
      "Selecting a tab is instant; no network confirmation and no toast on change.",
      "Reflect the active tab in the URL (query param or path) so deep links and refresh restore it.",
      "Disable a single tab only for permission or empty-state reasons, and give it a <code>tooltip</code> that names the constraint.",
    ],
    Content: [
      "A tab title is Title Case, 1–2 words, and names the destination noun (Overview, Logs, Settings). Verbs belong on buttons; View Logs is wrong on a tab.",
      "A tab tooltip is sentence case and explains the constraint (Only visible to project owners.), not the tab's purpose.",
      "No counts in the title (Logs (12)); use a badge and drop it at zero.",
    ],
    Accessibility: [
      "Left and Right arrows move focus across tabs; Enter and Space activate. Do not override them with global shortcuts.",
      'Label the tablist with <code>aria-label</code> when no visible heading sits above it (aria-label="Sections").',
      "Keep a visible focus ring on the active tab; never remove focus styles for polish.",
    ],
  },
};
