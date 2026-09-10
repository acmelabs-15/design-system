// Docs page: Note — mirrors https://vercel.com/geist/note
import type { Doc } from "../../site";

const upgrade = `<acme-button slot="action" size="small" variant="primary">Upgrade</acme-button>`;
const link = `Check <a href="#">the documentation</a> to learn more.`;
const col = (inner: string) => `<div class="vstack" style="gap:24px">${inner}</div>`;
// The six-note set every hue section shows: plain, with action, with link and action, then the same three filled.
const set = (v: string) =>
  col(
    `<acme-note variant="${v}">This note details some ${v} information.</acme-note>` +
      `<acme-note variant="${v}">This note details some ${v} information.${upgrade}</acme-note>` +
      `<acme-note variant="${v}">This note details some success information. ${link}${upgrade}</acme-note>` +
      `<acme-note variant="${v}" fill>This filled note details some ${v} information.</acme-note>` +
      `<acme-note variant="${v}" fill>This filled note details some ${v} information.${upgrade}</acme-note>` +
      `<acme-note variant="${v}" fill>This filled note details some success information. ${link}${upgrade}</acme-note>`,
  );

export const doc: Doc = {
  id: "note",
  title: "Note",
  lede: "A short inline message that needs attention or adds context beside the thing it describes.",
  tags: ["acme-note"],
  examples: [
    { h: "Default", html: `<acme-note>A default note.</acme-note>` },
    { h: "Sizes", html: `<div class="row-md" style="gap:24px;align-items:flex-start"><acme-note size="small">A small note.</acme-note><acme-note>A medium note.</acme-note></div>` },
    {
      h: "Action",
      html: `<div class="vstack" style="gap:24px;align-items:flex-start"><acme-note>This note details some information.${upgrade}</acme-note><acme-note>This note details a large amount information that could potentially wrap into two or more lines, forcing the height of the Note to be larger.${upgrade}</acme-note></div>`,
    },
    { h: "Success", html: set("success") },
    { h: "Error", html: set("error") },
    { h: "Warning", html: set("warning") },
    { h: "Secondary", html: set("secondary") },
    { h: "Violet", html: set("violet") },
    { h: "Cyan", html: set("cyan") },
    {
      h: "Disabled",
      html: col(
        `<acme-note disabled fill variant="warning">This note details a warning.${upgrade}</acme-note><acme-note disabled fill variant="warning">This filled note details some success information. ${link}${upgrade}</acme-note>`,
      ),
    },
    { h: "Label", html: `<acme-note><span slot="label">Region Change:</span>Changing this region restarts all functions.</acme-note>` },
    {
      h: "Custom icon",
      html: col(
        `<acme-note><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" slot="icon" aria-hidden="true"><use href="#i-sparkles"/></svg>A custom icon replaces the variant’s default.</acme-note><acme-note no-icon>Pass a null icon to render no icon at all.</acme-note>`,
      ),
    },
  ],
  practices: {
    "When to use": [
      "A Note gives inline feedback next to the field, card or section it is about: a region-change warning above a region picker, a rate-limit notice beside a usage gauge.",
      "A page-level or system-wide message with a call to action is a Banner; a transient acknowledgment is a Toast; a destructive confirmation is a Modal.",
      "Pick the variant by meaning: <code>error</code> for a problem the user must fix, <code>warning</code> for a consequence to acknowledge, <code>success</code> for a passed check, <code>secondary</code> for neutral information.",
    ],
    Behavior: [
      "A Note stays until the state behind it changes. It has no dismiss control; one would compete with the message.",
      "One Note per concept. Three Notes stacked on a card point at a page structure problem, not a copy problem.",
      "The optional action slot holds one inline call to action, never a second button.",
    ],
    Content: [
      "The label is a one- or two-word Title Case prefix that names the topic: <code>Region Change</code>, <code>Rate Limit</code>, <code>Plan Limit</code>. Hedges such as <code>Heads Up</code>, <code>FYI</code> and <code>Note</code> go.",
      "The content is one active-voice sentence that names the impact: <code>Changing this region restarts all functions.</code>",
      "There is no <code>info</code> variant. Leave <code>variant</code> unset for the default info icon, or use <code>secondary</code> for neutral copy.",
      "A single-fragment label takes no period; a full sentence in the body does.",
    ],
  },
};
