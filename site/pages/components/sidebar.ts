import type { Doc } from "../../site";
export const doc: Doc = {
  id: "sidebar",
  title: "Sidebar",
  lede: "A desktop navigation region that becomes a Drawer on small screens.",
  tags: ["acme-sidebar", "acme-sidebar-trigger", "acme-sidebar-content"],
  examples: [
    {
      h: "Responsive navigation",
      html: '<acme-sidebar aria-label="Project navigation"><acme-sidebar-trigger slot="trigger">Toggle navigation</acme-sidebar-trigger><acme-sidebar-content><nav aria-label="Projects" style="display:grid;gap:16px;padding:16px"><a href="#overview">Overview</a><a href="#activity">Activity</a><label>Filter <input value="Retained across resizing" style="max-width:100%;box-sizing:border-box"></label><acme-drawer-close>Close navigation</acme-drawer-close></nav><nav slot="collapsed" aria-label="Compact projects" style="padding:12px"><a href="#overview" aria-label="Overview">O</a></nav></acme-sidebar-content></acme-sidebar>',
    },
    {
      h: "Fixed desktop region",
      html: '<acme-sidebar aria-label="Account navigation" collapsible="false" width="18rem"><acme-sidebar-trigger slot="trigger">Account navigation</acme-sidebar-trigger><acme-sidebar-content><nav aria-label="Account" style="display:grid;gap:16px;padding:16px"><a href="#profile">Profile</a><a href="#security">Security</a><acme-drawer-close>Close navigation</acme-drawer-close></nav></acme-sidebar-content></acme-sidebar>',
    },
  ],
  practices: {
    Layout: [
      "Use Sidebar Content for full content. Its optional collapsed slot supplies a compact desktop rail. Both sets of author nodes remain mounted; hidden content is inert.",
      "expanded controls desktop expansion. mobileOpen controls the mobile Drawer. The two states are independent. The default widths are 16rem and 3rem.",
      "mobileBelow uses configured responsive thresholds. Its default medium threshold is 37.5rem unless the application configures breakpoints before use. Placement uses logical start and end.",
      "Place the Sidebar in the application layout with Stack, Grid or Resizable. The application owns position, routing, current links and persistence.",
    ],
    Interaction: [
      "Give Sidebar an accessible name and include a named Sidebar Trigger in the trigger slot. The trigger exposes expanded state and opens the Drawer on small screens.",
      "A non-collapsible Sidebar keeps full desktop content; its trigger is unavailable on desktop but still opens the mobile Drawer.",
      "Use Drawer Close within the content for a mobile close action. Resize waits for an open Drawer to close before exposing desktop content.",
      "User actions emit acme-expanded-change { expanded } or acme-open-change { open }. Programmatic assignments do not emit change events. No built-in shortcut or stored preference is added.",
    ],
  },
};
