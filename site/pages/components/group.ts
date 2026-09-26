import type { Doc } from "../../site";

export const doc: Doc = {
  id: "group",
  title: "Group",
  tags: ["acme-group"],
  lede: "Arrange content with an optional outer outline. Explicit participants can share appearance defaults and attached edges.",
  examples: [
    { h: "Outer outline", html: `<acme-group outline padding="2" gap="4"><span>Draft</span><span>Saved</span></acme-group>` },
    { h: "Vertical arrangement", html: `<acme-group orientation="vertical" align-items="stretch" outline padding="4" gap="2"><span>Account</span><span>Workspace</span></acme-group>` },
    {
      h: "Responsive orientation",
      html: `<acme-group orientation='{"compact":"vertical","expanded":"horizontal"}' outline padding="4"><span>Overview</span><span>Activity</span><span>Settings</span></acme-group>`,
    },
  ],
  practices: {
    "Keep behavior with its owner": [
      "Group owns arrangement and presentation. Selection, forms, disabled state and keyboard behavior stay with the controls or their semantic owner.",
      "Use Stack when only ordinary spacing/alignment is needed.",
      "Native elements and unrelated components are not automatically treated as attached controls.",
    ],
    "Use explicit participation": [
      "Compatible participants can inherit size and variant. Explicit child values win. Nested Groups start fresh.",
      "Attachment uses direct visible participants in DOM order. Nonparticipating visible content breaks an attached run. CSS order is not supported for attached members.",
      "Outline and attachment are independent. Common border, padding and radius inputs override the outline defaults.",
    ],
  },
};
