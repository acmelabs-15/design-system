// Docs page: Collapse — mirrors https://vercel.com/geist/collapse
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "collapse",
  title: "Collapse",
  lede: "Reveal or hide a section of content behind a title.",
  tags: ["acme-collapse"],
  examples: [
    {
      h: "Default",
      p: "The small form: 48px rows, 16/24 at weight 500.",
      html: `<div><acme-collapse heading="Advanced Settings" open>Root directory, build command and output directory for this project.</acme-collapse><acme-collapse heading="Environment Variables">Values are encrypted at rest.</acme-collapse></div>`,
    },
    {
      h: "Large",
      p: "84px rows with a 24/36 title.",
      html: `<div><acme-collapse large heading="What is Fluid Compute?" open>Fluid compute runs several requests on one function instance and bills active CPU only.</acme-collapse><acme-collapse large heading="How is usage measured?">Per active CPU millisecond, per region.</acme-collapse></div>`,
    },
  ],
  practices: {
    Behavior: [
      "One open at a time when exclusive, several when independent; closed by default; never nested more than one level.",
      "Content stays in the DOM when closed; the trigger carries aria-expanded.",
    ],
    Content: ["Title Case topic names (Advanced Settings); no destructive primary action inside."],
  },
};
