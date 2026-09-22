import type { Doc } from "../../site";
const script = `const scope = root.querySelector("acme-theme"); const picker = root.querySelector("acme-theme-switcher"); picker.addEventListener("acme-request", event => { event.stopPropagation(); picker.value = event.detail.value; scope.appearance = event.detail.value; });`;
export const doc: Doc = {
  id: "theme-switcher",
  title: "Theme Switcher",
  lede: "Requests an appearance preference. The application updates its theme scope.",
  tags: ["acme-theme-switcher"],
  examples: [
    { h: "Scoped appearance", html: "<acme-theme><acme-theme-switcher></acme-theme-switcher><p>This section follows the selected appearance.</p></acme-theme>", script },
    { h: "Medium", html: '<acme-theme appearance="light"><acme-theme-switcher size="medium" value="light"></acme-theme-switcher></acme-theme>', script },
    { h: "Large", html: '<acme-theme appearance="dark"><acme-theme-switcher size="large" value="dark"></acme-theme-switcher></acme-theme>', script },
    { h: "Disabled", html: "<acme-theme-switcher disabled></acme-theme-switcher>" },
  ],
  practices: {
    Usage: [
      "Handle acme-request with action appearance, then update the switcher's value and the relevant Theme scope's appearance.",
      "The application owns preference persistence. A switcher does not write page settings or browser storage.",
      "Use small, medium or large sizes. Small is the default.",
      "Keep auto available when the application permits following the system preference.",
      "Translate themeSwitcher.label, themeSwitcher.auto, themeSwitcher.light and themeSwitcher.dark through configureMessages. The current Theme locale selects the messages.",
      "Without an application update, the control retains its previous selection. A canceled request does not save a preference.",
    ],
  },
};
