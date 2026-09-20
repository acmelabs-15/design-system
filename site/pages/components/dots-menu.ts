// Docs page: Dots Menu — mirrors https://vercel.com/geist/dots-menu
import type { Doc } from "../../site";

const items = `<acme-menu-item>View Build Logs</acme-menu-item><acme-menu-item>View Projects</acme-menu-item><acme-menu-item>View Analytics</acme-menu-item>`;
const withDisabled = `<acme-menu-item>View Build Logs</acme-menu-item><acme-menu-item disabled>View Projects</acme-menu-item><acme-menu-item>View Analytics</acme-menu-item>`;
const dots = (inner: string, attrs = "") => `<acme-dots-menu${attrs ? ` ${attrs}` : ""}>${inner}</acme-dots-menu>`;
/** The stage of an open example: room for the list under the trigger. */
const box = (inner: string) => `<div style="min-height:250px;position:relative">${inner}</div>`;

export const doc: Doc = {
  id: "dots-menu",
  title: "Dots Menu",
  lede: "An overflow menu: a three-dot icon button that opens a dropdown of further actions.",
  tags: ["acme-dots-menu"],
  examples: [
    { h: "Default", html: dots(items) },
    {
      h: "Sizes",
      p: "icon-size sets the width of the dots; the trigger stays 32px square.",
      html: `<div class="row" style="gap:24px;align-items:flex-start">${dots(items, 'icon-size="10"')}${dots(items, 'icon-size="12"')}${dots(items, 'icon-size="18"')}</div>`,
    },
    { h: "Disabled", html: dots(items, "disabled") },
    { h: "Disabled Menu Item", html: dots(withDisabled) },
    { h: "Open", census: true, p: "The dots menu open: the trigger pressed reads gray-alpha-100, the list at least 200 wide under its end.", html: box(dots(items)) },
    { h: "Open disabled item", census: true, p: "The dots menu open with a disabled item: the row reads gray-700 and takes no pointer.", html: box(dots(withDisabled)) },
  ],
  practices: {
    "When to use": [
      "A dots menu holds the secondary actions of one row or card: the primary action stays visible, the rest sits behind the dots.",
      "Two or three actions that all matter belong in view, as buttons; a dots menu hides them.",
      "A menu opened from a labelled button is Menu; a right-click on a row is Context Menu.",
    ],
    Behavior: [
      "The list opens under the end of the trigger and flips when the window bounds would clip it.",
      'A selected row closes the menu; close-on-select="false" keeps it open for a row that toggles a setting.',
      "disabled fades the trigger and keeps the menu closed; a disabled row stays in the list but takes no pointer.",
    ],
    Content: [
      "Rows are Title Case Verb + Noun (View Build Logs, Delete Project); a destructive row goes last, after a divider.",
      'Keep the trigger named Menu unless the row\'s name adds meaning (label="Deployment actions").',
    ],
    Accessibility: ["The trigger is a button named Menu with aria-haspopup and aria-expanded; the list is a menu the arrow keys walk.", "Escape closes the menu and returns focus to the trigger."],
  },
};
