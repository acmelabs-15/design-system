// Docs page: Command Menu — mirrors https://vercel.com/geist/command-menu
import type { Doc } from "../../site";

/** The opener shows the menu. */
const open = `root.querySelector("acme-button").addEventListener("click", () => root.querySelector("acme-command-menu").show());`;
const button = `<acme-button>Open Command Menu</acme-button>`;
const item = (label: string, extra = "") => `<acme-command-item${extra}>${label}</acme-command-item>`;
const group = (heading: string, items: string) => `<acme-command-group heading="${heading}">${items}</acme-command-group>`;
const country = (name: string, code: string) => item(name, ` suffix`).replace(" suffix>", `><p class="text-copy-14" slot="end" style="color:var(--ds-gray-700)">${code}</p>`);
const check = `<svg viewBox="0 0 16 16" width="16" height="16" slot="end" style="color:var(--ds-gray-700)" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-4.4-2.5-1.1-1.1L7 7.9 5.5 6.4 4.4 7.5 7 10.1l4.6-4.6Z"/></svg>`;
const icon = `<svg viewBox="0 0 16 16" width="16" height="16" slot="start" aria-hidden="true"><path fill="currentColor" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Z"/></svg>`;

const groups = `${group("Suggestions", item("Figma Import"))}${group("Commands", `${item("Import Extension")}${item("Manage Extensions")}`)}${group("Collaboration", item("Flags Explorer"))}`;
const divided = `${item("Item 1")}${item("Item 2")}<acme-command-divider></acme-command-divider>${item("Item 3")}${group("Group 1", `${item("Grouped Item 1")}${item("Grouped Item 2")}`)}`;
const suffixed = `${group("Group 1", `${country("United States of America", "USA")}${country("Spain", "ESP")}${country("France", "FRA")}`)}${group("Group 2", `${country("Austria", "AUT")}${item("Switzerland", "").replace("</acme-command-item>", `${check}</acme-command-item>`)}${country("Germany", "GER")}`)}`;
const menu = (inner: string, attrs = "") => `<acme-command-menu placeholder="What do you need?"${attrs}>${inner}</acme-command-menu>`;

export const doc: Doc = {
  id: "command-menu",
  title: "Command Menu",
  lede: "Launch a set of actions as a full-screen overlay.",
  tags: ["acme-command-menu", "acme-command-group", "acme-command-item", "acme-command-divider"],
  examples: [
    { h: "Default", html: `${button}${menu(groups)}`, script: open },
    { h: "With divider", html: `${button}${menu(divided)}`, script: open },
    { h: "With suffix", html: `${button}${menu(suffixed)}`, script: open },
    // The states below exist for the parity census only: the census config's `prepare` step opens them and types the queries.
    {
      h: "Open",
      census: true,
      p: "The Default menu open: the faded overlay, the 640px dialog 15% from the top with the input block and the list of three groups; the first row is highlighted.",
      html: menu(groups, ` id="sk-open"`),
    },
    { h: "Open with divider", census: true, p: "The With divider menu open: three loose rows with a divider, then a group.", html: menu(divided, ` id="sk-divider"`) },
    { h: "Open with suffix", census: true, p: "The With suffix menu open: every row ends on a suffix, a 14px gray-700 paragraph or a gray-700 icon.", html: menu(suffixed, ` id="sk-suffix"`) },
    { h: "Filtered", census: true, p: "The Default menu narrowed by the query “ext”: the two rows that score stay, the other groups hide.", html: menu(groups, ` id="sk-filtered"`) },
    { h: "Empty", census: true, p: "No row matches the query “zzz”: the centred empty message with the query in gray-1000.", html: menu(groups, ` id="sk-empty"`) },
    {
      h: "Nested page",
      census: true,
      p: "A second page open: the crumbs of the page stack above the searchbox, the page's placeholder, the page's rows.",
      html: menu(
        `<acme-command-group heading="Projects" page="Projects">${item("acme-site")}${item("acme-api")}${item("acme-docs")}</acme-command-group>`,
        ` id="sk-pages" pages='[{"label":"Home"},{"label":"Projects","placeholder":"Search projects…"}]'`,
      ),
    },
    {
      h: "Prefix, keybind and disabled",
      census: true,
      p: "Rows with a 20px prefix box, a keybind (kbd chips, hidden until the chips' box is hovered with a fine pointer), and a disabled row.",
      html: menu(
        group("Actions", `${item(`${icon}Deploy Project`, ` keybind="Meta D"`)}${item(`${icon}Invite Team Member`, ` keybind="Meta I"`)}${item(`${icon}Archive Project`, " disabled")}`),
        ` id="sk-affixes" label="Actions"`,
      ),
    },
    {
      h: "Loading",
      census: true,
      p: "The menu while its rows load: the shimmering bar along the bottom edge of the input block.",
      html: menu(group("Recent", item("Figma Import")), ` id="sk-loading" loading`),
    },
  ],
  practices: {
    "When to use": [
      "The Command Menu is the global, keyboard-first palette that finds resources and runs actions across the app.",
      "A menu opened from a visible trigger on one resource is a Menu; a right click on a row is a Context Menu.",
      "Split items into pages (Projects, Team Settings) once a flat list would pass about 30 items or mix resource types.",
    ],
    Behavior: [
      "⌘K on macOS and Ctrl+K elsewhere open it; the binding is global and never reused for an in-page filter.",
      "It opens on the root page and keeps the query when the user steps back from a sub-page.",
      "Focus stays inside the overlay while open and returns to the element that had it on close.",
      "An empty input shows recent or default items, so the menu is useful before the first keystroke.",
    ],
    Content: [
      "Items are Title Case verb phrases (Deploy Project, Invite Team Member); a command acts, so navigation phrasing such as Go to project page is out.",
      "A page label is Title Case and names the scope (Projects, Team Settings).",
      "A page placeholder is sentence case, action-oriented and ends with … (Search projects…); a bare Search… names no scope.",
      "A group heading is Title Case, one or two words (Actions, Recent).",
    ],
    Accessibility: [
      'The result count is aria-live="polite", so a screen reader hears the list narrow as the user types.',
      "Up and Down move the highlight, Enter activates, Escape closes; Backspace in an empty input pops the page stack.",
      "An item's shortcut is shown as a Kbd, so sighted users find it and a screen reader announces it as a label.",
    ],
  },
};
