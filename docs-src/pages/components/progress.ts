// Docs page: Progress — mirrors https://vercel.com/geist/progress
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "progress",
  title: "Progress",
  lede: "Display progress relative to a limit or a task.",
  tags: ["acme-progress"],
  examples: [
    {
      h: "Default",
      html: `<acme-progress value="30" aria-label="Upload"></acme-progress>`,
    },
    {
      h: "Themed",
      html: `<div class="vstack" style="gap:24px"><acme-progress variant="success" value="100"></acme-progress><acme-progress variant="error" value="10"></acme-progress><acme-progress variant="warning" value="40"></acme-progress><acme-progress variant="secondary" value="70"></acme-progress></div>`,
    },
    {
      h: "With stops",
      html: `<acme-progress variant="success" value="30" stops="[25,50,75]"></acme-progress>`,
    },
    {
      h: "Heights",
      html: `<div class="vstack" style="gap:24px"><acme-progress value="60" height="4"></acme-progress><acme-progress value="60"></acme-progress><acme-progress value="60" height="24"></acme-progress></div>`,
    },
  ],
  practices: {
    "When to use": ["Determinate work with a knowable total: uploads, setup steps, batch deletions. Spinner for short waits, Loading Dots inline, Gauge for a quota."],
    Content: ["Pair the bar with text naming the work and the units: Uploading 12 of 30 files."],
  },
};
