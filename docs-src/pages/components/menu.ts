// Docs page: Menu — mirrors https://vercel.com/geist/menu
import type { Doc } from "../../site";

const item = (text: string, attrs = "") => `<acme-menu-item slot="items"${attrs ? ` ${attrs}` : ""}>${text}</acme-menu-item>`;
/** A 16px filled icon, sized by its attributes like the reference's icons: `accessibility` (a person in a ring) or `dots` (three dots). */
const PATHS = {
  accessibility:
    "M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm0 1.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13ZM8 3a1.25 1.25 0 1 0 0 2.5A1.25 1.25 0 0 0 8 3ZM4.5 6.25a.75.75 0 0 0 0 1.5H6.5V9l-1.2 3a.75.75 0 1 0 1.4.55L8 9.5l1.3 3.05a.75.75 0 1 0 1.4-.55L9.5 9V7.75h2a.75.75 0 0 0 0-1.5h-7Z",
  dots: "M3 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z",
};
const icon = (name: keyof typeof PATHS, slot = "") =>
  `<svg viewBox="0 0 16 16" width="16" height="16"${slot ? ` slot="${slot}"` : ""} fill="currentColor" aria-hidden="true"><path d="${PATHS[name]}"/></svg>`;
const trigger = (text: string, attrs = "") => `<acme-menu-button slot="trigger"${attrs ? ` ${attrs}` : ""}>${text}</acme-menu-button>`;
const dotsTrigger = trigger(icon("dots"), 'aria-label="Menu" shape="square" size="small" svg-only variant="secondary"');
const box = (h: number, inner: string, extra = "") => `<div style="min-height:${h}px;position:relative${extra}">${inner}</div>`;
/** Opens every menu in the example, so the page shows the state the reference reaches on a click. */
const openAll = "for (const m of root.querySelectorAll('acme-menu')) m.open = true;";

const five = `${item("One")}${item("Two")}${item("Three")}${item("Test for Link", 'href="https://vercel.com"')}${item("Delete", 'type="error"')}`;
const standard = `<acme-menu width="200">${trigger("Actions")}${five}</acme-menu>`;
const chevron = `<acme-menu width="200">${trigger("Actions", 'show-chevron variant="secondary"')}${five}</acme-menu>`;
const disabled = `<acme-menu width="200">${trigger("Actions")}${item("One")}${item("Two")}${item("Three", "disabled")}${item("Delete", 'type="error"')}${item("Delete Forever", 'disabled type="error"')}</acme-menu>`;
const locked = (tooltip: boolean) =>
  `<acme-menu width="200">${trigger("Actions")}${item("View Details")}${item("Edit")}${
    tooltip
      ? `<acme-tooltip slot="items" text="You do not have the permissions to delete." style="display:flex;width:100%"><acme-menu-item locked>Delete</acme-menu-item></acme-tooltip>`
      : item("Delete", "locked")
  }</acme-menu>`;
const links = `<acme-menu width="200">${trigger("Links")}${item("One", 'href="/design/menu#custom-trigger"')}${item("Two", 'href="#"')}${item("Three", 'href="#"')}</acme-menu>`;
const custom = `<acme-menu width="200">${trigger('<acme-avatar size="30" username="evilrabbit"></acme-avatar>', 'variant="unstyled"')}${item("One")}${item("Two")}${item("Three")}</acme-menu>`;
const prefixSuffix = `<div class="row" style="gap:24px;align-items:stretch;flex-wrap:nowrap"><acme-menu>${dotsTrigger}${item(`${icon("accessibility", "prefix")}Left`)}${item(`${icon("accessibility", "prefix")}Center`)}${item(`${icon("accessibility", "prefix")}Right`)}</acme-menu><acme-menu>${dotsTrigger}${item(`Left${icon("accessibility", "suffix")}`)}${item(`Center${icon("accessibility", "suffix")}`)}${item(`Right${icon("accessibility", "suffix")}`)}</acme-menu></div>`;
const position = `<acme-menu position="left-start" width="200">${trigger("Left Start")}${item("One")}${item("Two")}</acme-menu>`;
const section = `<acme-menu width="200">${trigger("Actions")}<acme-menu-section slot="items" title="Section"><acme-menu-item>One</acme-menu-item><acme-menu-item>Two</acme-menu-item></acme-menu-section>${item("Three")}${item("Locked", "locked")}<acme-menu-divider slot="items"></acme-menu-divider>${item("Delete", 'type="error"')}</acme-menu>`;

export const doc: Doc = {
  id: "menu",
  title: "Menu",
  lede: "A dropdown menu opened from a button, with typeahead and keyboard navigation.",
  tags: ["acme-menu", "acme-menu-button", "acme-menu-item", "acme-menu-section", "acme-menu-divider"],
  examples: [
    { h: "Default", p: "The trigger is an acme-menu-button, a Button, in the trigger slot.", html: box(60, standard) },
    { h: "With chevron", html: box(60, chevron) },
    { h: "Disabled items", html: box(60, disabled) },
    { h: "Locked items", p: "locked marks an action that needs more permissions: the item renders disabled with a lock suffix.", html: box(60, locked(true)) },
    { h: "Link items", html: box(60, links) },
    { h: "Custom trigger", p: 'variant="unstyled" wraps the trigger content in a bare button.', html: box(60, custom) },
    { h: "Prefix and suffix", p: "The prefix and suffix slots of an item take an icon.", html: box(60, prefixSuffix) },
    { h: "Menu position", p: "position sets the side and the alignment; the menu flips when the window bounds would clip it.", html: box(60, position, ";display:flex;justify-content:flex-end") },
    { h: "With section", html: box(60, section) },
    { h: "Open", census: true, p: "The default menu open: the trigger pressed, the list 200 wide under it, a link item and an error item.", html: box(250, standard), script: openAll },
    { h: "Open with chevron", census: true, p: "The secondary chevron trigger open: the chevron turned, the list under it.", html: box(250, chevron), script: openAll },
    { h: "Open disabled items", census: true, p: "A disabled item and a disabled error item read gray-700.", html: box(250, disabled), script: openAll },
    { h: "Open locked items", census: true, p: "The locked item is a disabled item with a gray-700 lock suffix.", html: box(180, locked(false)), script: openAll },
    { h: "Open link items", census: true, p: "Every row is an anchor inside a presentational list item.", html: box(180, links), script: openAll },
    { h: "Open custom trigger", census: true, p: "The unstyled avatar trigger open.", html: box(180, custom), script: openAll },
    { h: "Open prefix and suffix", census: true, p: "An icon trigger reads gray-400 while open; the list is the default 150 wide.", html: box(180, prefixSuffix), script: openAll },
    {
      h: "Open menu position", census: true,
      p: "The left-start menu open: the list to the left of the trigger, their top edges level.",
      html: box(120, position, ";display:flex;justify-content:flex-end"),
      script: openAll,
    },
    { h: "Open with section", census: true, p: "A titled group, a locked item, a divider and an error item.", html: box(300, section), script: openAll },
    {
      h: "Chevron on the default variant", census: true,
      p: "The chevron on the default variant: the trigger keeps its own hover fill, and the chevron stays gray.",
      html: box(60, `<acme-menu width="200">${trigger("Actions", "show-chevron")}${item("One")}${item("Two")}</acme-menu>`),
    },
  ],
  practices: {
    "When to use": [
      "Menu is a visible trigger that opens a list of actions on one resource: a dots menu on a row, a dropdown on a primary entity.",
      "Right-click or long-press on a row is Context Menu. Global commands behind ⌘K are Command Menu. Two related primary actions are a split button, not a buried secondary action.",
      "Cap a Menu at about 10 items. Past that, group with a section or move secondary actions to a settings page.",
    ],
    Behavior: [
      "Open on click, not on hover; hover-open menus collide with screen readers and trackpad scrolls.",
      "The position flips at the window bounds; do not hardcode a side that clips on a narrow viewport.",
      "Close on item activation, Escape and an outside click. Never close on hover-out.",
      "Use locked for a permission-gated action, so the lock icon and the disabled state explain why the row is inert.",
    ],
    Content: [
      "Items are Title Case Verb + Noun (Rename Project, Duplicate Deployment). A bare Rename or Edit is wrong outside an obvious single-object context.",
      "End an item with … only when it opens a follow-up dialog (Rename…, Transfer to Team…).",
      "Destructive items go last, after a divider, and keep the Verb + Noun form (Delete Project, never a bare Delete).",
      "Section titles are Title Case, one or two words (Workspace, Recent Projects).",
    ],
    Accessibility: [
      "Up and Down move the highlight through the items, Home and End jump to the first and last, Enter or Space activates.",
      "Typeahead jumps to the first item whose label starts with the typed characters; keep the visible label first so typeahead matches what the reader sees.",
      "Focus returns to the trigger on close, so a keyboard user keeps their place in the row.",
    ],
  },
};
