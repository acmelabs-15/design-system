// Docs page: Status Dot — mirrors https://vercel.com/geist/status-dot
import type { Doc } from "../../site";

const states = ["QUEUED", "BUILDING", "ERROR", "READY", "CANCELED"];
const dots = (label: boolean) => `<div class="vstack" style="gap:24px">${states.map((s) => `<acme-status-dot${label ? " label" : ""} state="${s}"></acme-status-dot>`).join("")}</div>`;

export const doc: Doc = {
  id: "status-dot",
  title: "Status Dot",
  lede: "Display an indicator of deployment status.",
  tags: ["acme-status-dot"],
  examples: [
    { h: "Default", html: dots(false) },
    { h: "Label", html: dots(true) },
  ],
  practices: {
    "When to use": [
      "Deployment lifecycle only. <code>state</code> takes <code>QUEUED</code>, <code>BUILDING</code>, <code>READY</code>, <code>ERROR</code>, <code>CANCELED</code> or <code>DELETED</code>.",
      "Other statuses (workflow runs, queue messages, sandboxes, cron jobs) use a Badge with the canonical state words, not a repurposed dot.",
      "A health summary with a number (uptime, hit rate) is a Gauge; in-flight work with a known total is a Progress.",
    ],
    Behavior: [
      "The dot changes colour with the state and goes neutral in a terminal state. Do not add a spinner next to it.",
      "Update the colour only when the ready state changes, not on every polling tick.",
      "Add a Relative Time Card when timing matters (Building · 12s ago); the dot alone says nothing about duration.",
    ],
    Content: [
      'The title is a fixed sentence per state ("This deployment is building."). In a list, name the entity in the row text next to the dot.',
      "Use <code>label</code> only when the dot stands alone; the element sentence-cases the state for you (Building, Ready, Error).",
      'Do not wrap the dot in prose such as "Status: Ready". The label already names the state.',
    ],
    Accessibility: [
      'The element sets its own <code>aria-label</code> (the state name) and <code>title</code> (the state sentence); do not replace them with a generic "status".',
      "When the dot sits next to text that already names the state, mark it <code>aria-hidden</code> so it is not read twice.",
      "Color is not the only signal: every state has its own title and label, so colorblind users get the same information.",
    ],
  },
};
