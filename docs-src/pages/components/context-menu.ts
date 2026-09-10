// Docs page: Context Menu — mirrors https://vercel.com/geist/context-menu
import type { Doc } from "../../site";

const target = (inner = "Right click here") =>
  `<div class="text-copy-14" style="width:300px;padding:45px 0;border:1px dashed var(--ds-gray-alpha-600);border-radius:4px;text-align:center">${inner}</div>`;
const labels = ["Item one", "Item Two", "Item Three", "Item Four"];
const items = (attrs = "", inner = (l: string) => l) => labels.map((l) => `<acme-menu-item slot="items"${attrs}>${inner(l)}</acme-menu-item>`).join("");
const withDisabled = labels.map((l, i) => `<acme-menu-item slot="items"${i === 1 || i === 2 ? " disabled" : ""}>${l}</acme-menu-item>`).join("");
/** A 16px filled icon, sized by its attributes like the reference's logo icon. */
const logo = (slot: string) =>
  `<svg viewBox="0 0 16 16" width="16" height="16" slot="${slot}" fill="currentColor" aria-hidden="true"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm0 4 4 7H4l4-7Z"/></svg>`;
const menu = (rows: string, inner?: string) => `<acme-context-menu>${target(inner)}${rows}</acme-context-menu>`;
const startEnd = `<div class="row" style="gap:24px;align-items:stretch">${menu(items(' href="/"', (l) => `${logo("start")}${l}`))}${menu(items(' href="/"', (l) => `${l}${logo("end")}`))}</div>`;
/** The stage of an open example: room for the list beside the point. */
const box = (inner: string) => `<div style="min-height:250px;position:relative">${inner}</div>`;
const log = "root.querySelector('acme-context-menu').addEventListener('acme-select', () => console.log('value'));";

export const doc: Doc = {
  id: "context-menu",
  title: "Context Menu",
  lede: "A menu of contextual actions, revealed on right click or long press.",
  tags: ["acme-context-menu"],
  examples: [
    { h: "Default", html: menu(items()), script: log },
    { h: "Disabled items", html: menu(withDisabled), script: log },
    { h: "Link items", html: menu(items(' href="/"')) },
    { h: "Prefix and suffix", html: startEnd },
    { h: "Open", census: true, p: "The menu open at the pointer: the list 160 wide to the right of the point, the second row highlighted.", html: box(menu(items())) },
    { h: "Open disabled items", census: true, p: "Two disabled rows read gray-700 under a default cursor and take no pointer.", html: box(menu(withDisabled)) },
    { h: "Open link items", census: true, p: "Every row is an anchor.", html: box(menu(items(' href="/"'))) },
    { h: "Open prefix and suffix", census: true, p: "A 16px icon before the label, or after it behind an auto margin and 12px of padding.", html: box(startEnd) },
    {
      h: "Open on a link",
      census: true,
      p: "Right-clicked over a link: the list starts with Open in New Tab and Copy Link Address, a divider, then the rows.",
      html: box(menu(items(), `<a href="https://example.com">Right click this link</a>`)),
    },
  ],
  practices: {
    "When to use": [
      "A Context Menu gives power users shortcuts on right click or long press over a row, a file or a canvas object.",
      "It is never the only way to an action: every item also exists in a visible Menu trigger or row button, so mouse-only and keyboard-only users have the same reach.",
      "A global command palette is the Command Menu; a dropdown from a visible trigger is a Menu.",
    ],
    Behavior: [
      "Right click on desktop and long press on touch open it; the native browser menu is suppressed on the trigger area only, never the whole page.",
      "The menu opens at the pointer; when it would overflow the viewport it flips horizontally, then vertically, before it clips.",
      "It closes on activation, Escape and outside click, and never on hover-out.",
    ],
    Content: [
      "Items follow the Menu rules: Title Case Verb + Noun (Open in New Tab, Copy URL, Delete Deployment); a bare verb is wrong.",
      "An item ends with … only when activating it opens a follow-up dialog (Rename…, Move to Folder…).",
      "Destructive items sit last, after a divider, and keep the Verb + Noun label; Delete alone never ships.",
    ],
    Accessibility: [
      "The keyboard menu key (Shift+F10 on Windows and Linux, the menu key, or the platform equivalent) opens the same menu without a right click.",
      "Up and Down move focus, Enter and Space activate, Escape closes and returns focus to the row.",
      "Destructive items stay out of nested submenus; one level keeps keyboard navigation predictable.",
    ],
  },
};
