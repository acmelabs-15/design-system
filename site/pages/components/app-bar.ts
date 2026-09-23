import type { Doc } from "../../site";
export const doc: Doc = {
  id: "app-bar",
  title: "App Bar",
  lede: "A header with explicit identity, navigation and actions.",
  tags: ["acme-app-bar", "acme-app-bar-start", "acme-app-bar-content", "acme-app-bar-end"],
  examples: [
    {
      h: "Header regions",
      html: '<acme-app-bar><acme-app-bar-start><strong>ACME</strong></acme-app-bar-start><acme-app-bar-content><acme-link href="#overview">Overview</acme-link><acme-link href="#activity">Activity</acme-link></acme-app-bar-content><acme-app-bar-end><acme-button size="small">Create</acme-button></acme-app-bar-end></acme-app-bar>',
    },
    {
      h: "Breadcrumbs and actions",
      html: '<acme-app-bar><acme-breadcrumbs><acme-breadcrumb href="#">Projects</acme-breadcrumb><acme-breadcrumb current>Design system</acme-breadcrumb></acme-breadcrumbs><acme-toolbar slot="end" aria-label="Project actions"><acme-button variant="secondary" size="small">Share</acme-button><acme-button variant="secondary" size="small">Export</acme-button><acme-button size="small">Save</acme-button></acme-toolbar></acme-app-bar>',
    },
    {
      h: "Sizes",
      html: '<acme-v-stack gap="4"><acme-app-bar size="small">Small header</acme-app-bar><acme-app-bar>Medium header</acme-app-bar><acme-app-bar size="large">Large header</acme-app-bar></acme-v-stack>',
    },
    { h: "Optional theme control", html: '<acme-app-bar><strong slot="start">Workspace</strong><acme-theme-switcher slot="end" size="small"></acme-theme-switcher></acme-app-bar>' },
  ],
  practices: {
    Composition: [
      "Use start, default and end slots, or the corresponding optional parts. Theme switching, routing, identity and actions remain explicit content.",
      "placement=static is the default. placement=sticky uses the --acme-app-bar-offset CSS property, which defaults to 0px. Account for the header height in content scroll offsets.",
      "Medium preserves the existing 52px header baseline through --bar-h. Small and large differ by one spacing-2 step; content can make the header taller.",
      "Use Toolbar for related action controls that need shared keyboard movement. Use ordinary layout and native navigation for links and filters.",
      "A header inside a dialog is not a page banner. Give actual page navigation its own accessible name.",
    ],
  },
};
