// Docs page: Note — mirrors https://vercel.com/geist/note
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "note",
  title: "Note",
  lede: "Display text that requires attention or provides additional information.",
  tags: ["acme-note"],
  examples: [
    {
      h: "Default",
      html: `<acme-note>A default note.</acme-note>`,
    },
    {
      h: "Size",
      html: `<div class="vstack"><acme-note size="small">A small note.</acme-note><acme-note>A medium note.</acme-note><acme-note size="large">A large note.</acme-note></div>`,
    },
    {
      h: "Action",
      html: `<acme-note>This note details something that needs an action.<acme-button slot="action" size="small" variant="primary">Upgrade</acme-button></acme-note>`,
    },
    {
      h: "Variants",
      html: `<div class="vstack"><acme-note variant="success">This note details something positive. <a href="#">Learn more</a></acme-note><acme-note variant="error">This note details an error.</acme-note><acme-note variant="warning">This note details a warning.</acme-note><acme-note variant="secondary">This note is secondary.</acme-note><acme-note variant="violet">This note is violet.</acme-note><acme-note variant="cyan">This note is cyan.</acme-note></div>`,
    },
    {
      h: "Fill",
      html: `<div class="vstack"><acme-note variant="success" fill>Filled success.</acme-note><acme-note variant="error" fill>Filled error.</acme-note><acme-note variant="warning" fill>Filled warning.</acme-note><acme-note variant="secondary" fill>Filled secondary.</acme-note></div>`,
    },
    {
      h: "Label",
      html: `<acme-note><b slot="label" class="label">Region Change:</b>Changing this region restarts all functions.</acme-note>`,
    },
    {
      h: "Disabled",
      html: `<acme-note disabled>This note details a warning that no longer applies.<acme-button slot="action" size="small">Upgrade</acme-button></acme-note>`,
    },
  ],
  practices: {
    "When to use": [
      "Inline contextual feedback beside the field, card or section it describes. Banner for page-level, Toast for transient, Modal for destructive confirmations.",
      "Error for a problem to fix, warning for a consequence to acknowledge, success for a passed check, secondary for neutral information; there is no info variant.",
    ],
    Behavior: ["Persistent until the state changes; no dismiss control; one Note per concept; a single inline CTA."],
    Content: ["A 1–2 word Title Case label names the topic (Region Change); the body is one active sentence naming the impact."],
  },
};
