// Docs page: Theme Switcher — mirrors https://vercel.com/geist/theme-switcher
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "theme-switcher",
  title: "Theme Switcher",
  lede: "Switch between system, light and dark.",
  tags: ["acme-theme-switcher"],
  examples: [
    {
      h: "Default",
      p: "Every instance shares the theme signal; changing one updates all and persists the choice.",
      html: `<acme-theme-switcher></acme-theme-switcher>`,
    },
    {
      h: "Small",
      html: `<acme-theme-switcher small></acme-theme-switcher>`,
    },
    {
      h: "Disabled",
      html: `<acme-theme-switcher disabled></acme-theme-switcher>`,
    },
  ],
  practices: {
    "When to use": ["Once per app, in the footer or the settings; small in dense chrome. Never rebuilt from a Switch or three icon buttons."],
  },
};
