import type { Doc } from "../../site";
export const doc: Doc = {
  id: "browser",
  title: "Browser",
  lede: "Decorative browser chrome around author-owned preview content.",
  tags: ["acme-browser"],
  examples: [
    {
      h: "Preview frame",
      html: '<acme-browser address="https://www.example.com" label="Project preview"><acme-box padding="6"><acme-heading as="h3">Delivery dashboard</acme-heading><acme-text>A preview of the project interface.</acme-text></acme-box></acme-browser>',
    },
    {
      h: "Interactive preview content",
      html: '<acme-browser address="https://example.com/settings" label="Settings preview"><acme-box padding="6"><acme-switch>Send notifications</acme-switch></acme-box></acme-browser>',
    },
    {
      h: "Long address",
      html: '<acme-browser address="https://example.com/projects/very-long-project-name/settings/notifications" label="Notifications preview"><acme-box padding="6">The frame follows its available width.</acme-box></acme-browser>',
    },
  ],
  practices: {
    Content: [
      "The default slot remains author-owned. Give screenshots useful alt text and preserve labels on interactive previews.",
      "The address is display text. The component does not load it, navigate to it or create an iframe.",
    ],
    Accessibility: [
      "Use label when the frame needs an accessible group name.",
      "The browser chrome has no focusable actions. Preview content keeps its own keyboard behavior.",
      "Only hide the whole component from accessibility APIs when all of its content is decorative.",
    ],
    Appearance: ["The surrounding layout sets the frame width. The chrome follows the current theme.", "Give images explicit dimensions or an aspect ratio to keep the preview stable while loading."],
  },
};
