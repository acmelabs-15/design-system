import type { Doc } from "../../site";

export const doc: Doc = {
  id: "theme",
  title: "Theme",
  lede: "A page or section scope for appearance, named theme, density and formatting locale.",
  tags: ["acme-theme"],
  examples: [
    {
      h: "Nested appearances",
      html: '<acme-theme appearance="dark"><p>Dark section</p><acme-theme appearance="light"><p>Light section</p><acme-button>Action</acme-button></acme-theme></acme-theme>',
    },
    {
      h: "Named theme",
      html: "<acme-theme><acme-button>Named theme</acme-button></acme-theme>",
      script: 'root.querySelector("acme-theme").theme = "docs-ocean";',
      code: 'registerTheme("ocean", { colors: { "ds-blue-700": "#0068d6" }, spacing: { 2: "0.75rem" } });\n\n<acme-theme theme="ocean"><acme-button>Named theme</acme-button></acme-theme>',
    },
    { h: "Density scope", html: '<acme-theme density="compact"><p>Compact roles; text size is unchanged.</p></acme-theme>' },
  ],
  practices: {
    Usage: [
      "Register named definitions before selecting them. A partial definition starts from the house theme.",
      "Omitted nested settings inherit. Removing an appearance, density or locale attribute restores inheritance.",
      "Explicit auto follows the system appearance. Explicit normal density overrides an inherited compact setting.",
      "Use ordinary CSS custom properties for local overrides. Native lang and dir remain native attributes.",
      "Applications own saved preferences; importing a component does not change document settings.",
    ],
  },
};
