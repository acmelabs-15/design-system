// Docs page: Status Dot — mirrors https://vercel.com/geist/status-dot
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "status-dot",
  title: "Status Dot",
  lede: "An indicator of deployment status.",
  tags: ["acme-status-dot"],
  examples: [
    {
      h: "Default",
      html: `<div class="row" style="gap:24px"><acme-status-dot state="queued"></acme-status-dot><acme-status-dot state="building"></acme-status-dot><acme-status-dot state="error"></acme-status-dot><acme-status-dot state="ready"></acme-status-dot><acme-status-dot state="canceled"></acme-status-dot></div>`,
    },
    {
      h: "Label",
      html: `<div class="vstack" style="gap:24px"><acme-status-dot state="queued" label></acme-status-dot><acme-status-dot state="building" label></acme-status-dot><acme-status-dot state="error" label></acme-status-dot><acme-status-dot state="ready" label></acme-status-dot><acme-status-dot state="canceled" label></acme-status-dot></div>`,
    },
  ],
  practices: {
    "When to use": ["Deployment lifecycle only: QUEUED, BUILDING, READY, ERROR, CANCELED, DELETED. Other statuses use a Badge."],
    Behavior: ["The dot animates while building or queued and goes static in a terminal state; no separate spinner beside it."],
    Content: ["The label sentence-cases the state; never wrap it in Status: Ready."],
  },
};
