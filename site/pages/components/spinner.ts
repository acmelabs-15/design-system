// Docs page: Spinner — mirrors https://vercel.com/geist/spinner
import type { Doc } from "../../site";

const colorRow = (label: string, color = "") => `<div class="row" style="gap:16px"><span style="width:96px">${label}</span><acme-spinner${color ? ` color="${color}"` : ""}></acme-spinner></div>`;

export const doc: Doc = {
  id: "spinner",
  title: "Spinner",
  lede: "Shows an action running in the background. Unlike Loading Dots, use it as feedback to something the user did: a button, a pagination step, a retry.",
  tags: ["acme-spinner"],
  examples: [
    {
      h: "Default size",
      html: `<acme-spinner></acme-spinner>`,
    },
    {
      h: "Sizes",
      html: `<div class="row" style="gap:16px;align-items:flex-end"><acme-spinner size="sm"></acme-spinner><acme-spinner size="md"></acme-spinner><acme-spinner size="lg"></acme-spinner><acme-spinner size="xl"></acme-spinner><acme-spinner size="2xl"></acme-spinner><acme-spinner size="3xl"></acme-spinner><acme-spinner size="4xl"></acme-spinner></div>`,
    },
    {
      h: "Colors",
      html: `<div class="vstack" style="gap:16px">${colorRow("Default:")}${colorRow("Red:", "var(--ds-red-700)")}${colorRow("Green:", "var(--ds-green-700)")}${colorRow("Blue:", "var(--ds-blue-700)")}</div>`,
    },
  ],
  practices: {
    "When to use": [
      "Use a Spinner for a wait of about one to three seconds with no known end, tied to one action: a submit button, an inline icon refresh, a row-level retry.",
      "On a submit button, set the Button <code>loading</code> attribute so the spinner, the size and the busy state stay in step. Do not place a Spinner inside a button by hand.",
      "Use Skeleton when async data fills a known layout, Loading Dots for inline copy, and Progress when the total work is known.",
    ],
    Behavior: [
      "Mount the Spinner only once the action starts. A spinner that is rendered early and toggled shows a partial rotation at idle and reads as jank.",
      "Pair any wait over about a second with copy that names the work (<code>Verifying…</code>, <code>Deploying…</code>) so the user knows what blocks.",
      "Match the Spinner size to the type or icon next to it, not to the parent container.",
    ],
    Accessibility: [
      'Set <code>aria-busy="true"</code> on the element that wraps the in-flight action so screen readers announce the change.',
      "Keep the trigger focusable while it loads. Swapping it for a separate spinner element drops keyboard focus.",
      "Honor <code>prefers-reduced-motion</code> and do not stack extra animation around the Spinner.",
    ],
  },
};
