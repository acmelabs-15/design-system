// Docs page: Button — mirrors https://vercel.com/geist/button
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "button",
  title: "Button",
  lede: "Trigger an action or event, such as submitting a form or displaying a dialog.",
  tags: ["acme-button", "acme-button-group"],
  examples: [
    {
      h: "All types and sizes in comparison",
      html: `<div class="vstack"><div class="row"><acme-button size="small" variant="primary">Upload</acme-button><acme-button size="small" variant="error">Upload</acme-button><acme-button size="small" variant="warning">Upload</acme-button><acme-button size="small">Upload</acme-button><acme-button size="small" variant="tertiary">Upload</acme-button></div><div class="row"><acme-button variant="primary">Upload</acme-button><acme-button variant="error">Upload</acme-button><acme-button variant="warning">Upload</acme-button><acme-button>Upload</acme-button><acme-button variant="tertiary">Upload</acme-button></div><div class="row"><acme-button size="large" variant="primary">Upload</acme-button><acme-button size="large" variant="error">Upload</acme-button><acme-button size="large" variant="warning">Upload</acme-button><acme-button size="large">Upload</acme-button><acme-button size="large" variant="tertiary">Upload</acme-button></div></div>`,
    },
    {
      h: "Size",
      p: "small 32, medium 36, large 40 with an 8px radius.",
      html: `<div class="row"><acme-button size="small" variant="primary">Small</acme-button><acme-button variant="primary">Medium</acme-button><acme-button size="large" variant="primary">Large</acme-button></div>`,
    },
    {
      h: "Disabled and loading",
      p: "Disabled is gray-100 with gray-700 text; loading keeps the label and spins at the left.",
      html: `<div class="row"><acme-button variant="primary" disabled>Upload</acme-button><acme-button disabled>Upload</acme-button><acme-button variant="tertiary" disabled>Upload</acme-button><acme-button variant="primary" loading>Saving</acme-button><acme-button loading>Loading</acme-button></div>`,
    },
    {
      h: "Shapes",
      p: "Square and circle at small 32, medium 36, large 40; icon-only needs an aria-label.",
      html: `<div class="row"><acme-button shape="square" size="small" aria-label="Copy page"><svg class="ic" aria-hidden="true"><use href="#i-copy"/></svg></acme-button><acme-button shape="square" aria-label="Copy page"><svg class="ic" aria-hidden="true"><use href="#i-copy"/></svg></acme-button><acme-button shape="square" size="large" aria-label="Copy page"><svg class="ic" aria-hidden="true"><use href="#i-copy"/></svg></acme-button><acme-button shape="circle" size="small" aria-label="Notifications"><svg class="ic" aria-hidden="true"><use href="#i-bell"/></svg></acme-button><acme-button shape="circle" aria-label="Notifications"><svg class="ic" aria-hidden="true"><use href="#i-bell"/></svg></acme-button><acme-button shape="circle" size="large" aria-label="Notifications"><svg class="ic" aria-hidden="true"><use href="#i-bell"/></svg></acme-button></div>`,
    },
    {
      h: "Prefix and suffix",
      html: `<div class="row"><acme-button><svg class="ic" slot="prefix" aria-hidden="true"><use href="#i-download"/></svg>Export CSV</acme-button><acme-button>Continue<svg class="ic" slot="suffix" aria-hidden="true"><use href="#i-arrow"/></svg></acme-button><acme-button variant="tertiary"><svg class="ic" slot="prefix" aria-hidden="true"><use href="#i-plus"/></svg>Add Filter</acme-button></div>`,
    },
    {
      h: "Rounded with shadow",
      p: "The marketing pill: white, an inset ring, full radius.",
      html: `<acme-button rounded shadow>Get Started</acme-button>`,
    },
    {
      h: "Link",
      p: "An href renders an anchor with the same look.",
      html: `<acme-button variant="primary" href="#">Visit Deployment<svg class="ic" slot="suffix" aria-hidden="true"><use href="#i-ext"/></svg></acme-button>`,
    },
    {
      h: "Group",
      p: "Joined buttons share one border.",
      html: `<acme-button-group><acme-button>Day</acme-button><acme-button>Week</acme-button><acme-button>Month</acme-button></acme-button-group>`,
    },
  ],
  practices: {
    "When to use": [
      "Secondary for the supporting action, error for destructive confirmations. Primary, success, ghost and violet are not variants.",
      "Disable only when the action is impossible, and pair the disabled button with a tooltip that says why.",
    ],
    Content: ["Title Case, Verb + Noun: Deploy Project, Invite Member.", "A destructive button pairs 1:1 with its toast: Delete Project, then Project deleted. Mode switches end in Instead."],
  },
};
