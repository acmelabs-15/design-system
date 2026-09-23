import type { Doc } from "../../site";
const drawer = (placement: string) =>
  `<acme-drawer placement="${placement}" size="20rem"><acme-drawer-trigger slot="trigger">Open ${placement} drawer</acme-drawer-trigger><h2 slot="heading">${placement[0].toUpperCase() + placement.slice(1)} panel</h2><p slot="description">Details stay connected to the current page.</p><acme-field><span slot="label">Note</span><acme-input value="Retained note"></acme-input></acme-field><acme-drawer-close slot="footer">Close panel</acme-drawer-close></acme-drawer>`;
export const doc: Doc = {
  id: "drawer",
  title: "Drawer",
  lede: "A named edge panel with native dialog lifetime and directional motion.",
  tags: ["acme-drawer", "acme-drawer-trigger", "acme-drawer-close"],
  examples: [
    { h: "Logical edges", html: `<acme-h-stack gap="3" flex-wrap="wrap">${["start", "end", "top", "bottom"].map(drawer).join("")}</acme-h-stack>` },
    { h: "Right to left", html: `<div dir="rtl">${drawer("start")}</div>` },
    {
      h: "Nonmodal panel",
      html: '<acme-drawer modal="false" close-on-outside="false"><acme-drawer-trigger slot="trigger">Open persistent panel</acme-drawer-trigger><h2 slot="heading">Reference panel</h2><p>The page remains available while this panel is open.</p><acme-drawer-close slot="footer">Close reference panel</acme-drawer-close></acme-drawer>',
    },
  ],
  practices: {
    Behavior: [
      "placement defaults to end. Start and end follow the native text direction; top and bottom remain physical viewport edges.",
      "size accepts a CSS dimension for the movement axis. Omission uses the sizes.acme-drawer-size theme token, whose default is 24rem. The viewport bounds the result.",
      "Drawer uses the same open state, cancelable requests, focus targets and completion events as Dialog. It preserves author-owned content and form state.",
      "Use explicit triggers and close controls. Swipe dismissal is not part of this interface.",
      "Native modal isolation and scroll locking remain through the owned exit. Reduced motion completes immediately. Safe-area padding protects edge content.",
    ],
  },
};
