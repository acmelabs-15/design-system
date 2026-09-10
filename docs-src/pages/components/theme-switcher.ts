// Docs page: Theme Switcher — mirrors https://vercel.com/geist/theme-switcher
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "theme-switcher",
  title: "Theme Switcher",
  lede: "A control that switches between light and dark themes.",
  tags: ["acme-theme-switcher"],
  examples: [
    { h: "Default", html: `<acme-theme-switcher></acme-theme-switcher>` },
    { h: "Small", html: `<acme-theme-switcher small></acme-theme-switcher>` },
    { h: "Disabled", html: `<acme-theme-switcher disabled></acme-theme-switcher>` },
  ],
  practices: {
    "Best Practices": [
      "Use the Theme Switcher for the canonical Light / System / Dark control. Place it once per app, in the footer or the settings, not on every page.",
      "Pass <code>small</code> in dense chrome (footers, dropdowns); the default size belongs on a settings page with room around it.",
      "Every instance reads and writes the shared theme store, which sets <code>data-theme</code> on the root element and remembers the choice; do not mirror its state elsewhere.",
      "Set <code>disabled</code> only for a read-only preview of the control itself, or when the app forces one theme.",
      "Do not rebuild a theme picker from a Switch or three icon buttons. The element already carries the icons, an <code>aria-label</code> per option and System detection.",
      "The element composes its own option labels (System, Light, Dark); leave them alone so they stay consistent across surfaces.",
    ],
  },
};
