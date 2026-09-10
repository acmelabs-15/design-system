// Docs page: Multi Select — mirrors https://vercel.com/geist/multi-select
import type { Doc } from "../../site";

const note = (t: string) => `<p class="text-copy-14" style="color:var(--ds-gray-900)">${t}</p>`;
type Item = { id: string; name: string; checked?: boolean; disabled?: boolean; end?: boolean; leading?: boolean };
const row = (i: Item) =>
  `<acme-multi-select-row name="${i.name}" value="${i.id}"${i.checked ? " checked" : ""}${i.disabled ? " disabled" : ""}${i.end ? ' checkbox-position="end"' : ""}>${
    i.leading ? `<svg slot="leading" viewBox="0 0 16 16" width="16" height="16" fill="none" style="color:currentColor" aria-hidden="true"><path fill="currentColor" d="M8 1 16 15H0L8 1Z"/></svg>` : ""
  }</acme-multi-select-row>`;
/** A multi select over `items`, its list aligned to the trigger's start as the reference's examples are. */
const select = (text: string, items: Item[], attrs = "") => `<acme-multi-select align="start"${attrs}><span slot="trigger">${text}</span>${items.map(row).join("")}</acme-multi-select>`;
/** Keeps the trigger's text in step with the selection: none, all, or the count (`one` names a single pick). */
const counter = (noun: string, one?: string) =>
  `const ms = root.querySelector("acme-multi-select");\nconst text = root.querySelector("[slot=trigger]");\nconst label = () => {\n  const n = ms.value.length;\n  text.textContent = n === 0 ? "No ${noun} selected" : n === ms.rows.length ? "All ${noun} selected" : ${one ? `n === 1 ? "1 ${one} selected" : ` : ""}n + " ${noun} selected";\n};\nms.addEventListener("acme-change", label);\nlabel();`;
/** Room under an open trigger for its list, so the census page's examples do not sit on each other. */
const box = (h: number, inner: string) => `<div style="min-height:${h}px">${inner}</div>`;

const actionItems: Item[] = [
  { id: "design", name: "Design System", checked: true },
  { id: "components", name: "Components", checked: true },
  { id: "tokens", name: "Design Tokens" },
];
const keyboardItems: Item[] = [
  { id: "frameworks", name: "Frameworks", checked: true },
  { id: "libraries", name: "Libraries" },
  { id: "tools", name: "Development Tools" },
  { id: "databases", name: "Databases" },
];
const controlledItems: Item[] = [
  { id: "analytics", name: "Analytics", checked: true },
  { id: "monitoring", name: "Monitoring" },
  { id: "security", name: "Security" },
  { id: "performance", name: "Performance" },
];

export const doc: Doc = {
  id: "multi-select",
  title: "Multi Select",
  lede: "A keyboard-navigable dropdown for selecting multiple items with advanced focus management.",
  tags: ["acme-multi-select", "acme-multi-select-row"],
  examples: [
    {
      h: "Select Actions",
      p: "The component provides different selection behaviors based on current state: checkbox focus + Enter/Space toggles the item; button focus + Enter/Space runs the smart selection (Only, Check All, or a toggle, by the state); the hidden action labels appear on hover or focus to show the available action.",
      html: `<div class="vstack" style="gap:16px">${select("2 items selected", actionItems)}${note("Hover over items to see action labels. Different actions appear based on selection state.")}</div>`,
      script: counter("items"),
    },
    {
      h: "Keyboard Navigation",
      p: "Up and Down move between rows and keep the checkbox or button column; Left and Right switch between the checkbox and the button in the current row; Tab leaves the menu (natural tab behavior); Enter and Space act on what has focus.",
      html: `<div class="vstack" style="gap:16px">${select("1 category selected", keyboardItems)}${note("Try keyboard navigation: ↑ ↓ for rows, ← → for checkbox/button focus, Tab to cycle through all elements")}</div>`,
      script: counter("categories", "category"),
    },
    {
      h: "Controlled State",
      p: "Use controlled state to manage selections programmatically: set <code>value</code> from outside and the rows follow.",
      html: `<div class="vstack" style="gap:16px">${select("Selected: analytics", controlledItems)}<div class="vstack" style="gap:8px">${note('<a href="#" data-set="">Clear All</a>, <a href="#" data-set="analytics,monitoring">Core Features</a>, <a href="#" data-set="security,performance">Advanced Features</a>')}</div></div>`,
      script: `const ms = root.querySelector("acme-multi-select");
const text = root.querySelector("[slot=trigger]");
const label = () => { const n = ms.value.length; text.textContent = n === 0 ? "No features selected" : n === ms.rows.length ? "All features selected" : "Selected: " + ms.value.join(", "); };
ms.addEventListener("acme-change", label);
for (const a of root.querySelectorAll("a[data-set]")) a.addEventListener("click", (e) => { e.preventDefault(); ms.value = a.dataset.set ? a.dataset.set.split(",") : []; label(); });
label();`,
    },
    {
      h: "Open",
      census: true,
      p: "The list open under the trigger's end: the trigger reads open with its chevron turned, the material panel 8px below at least the trigger's width, a row per item with its checkbox and its action hint hidden until a hover.",
      html: box(180, select("2 items selected", actionItems, ' id="census-open"')),
    },
    {
      h: "Open with a hovered row",
      census: true,
      p: "A row under the pointer: its button reads gray-100 and its action hint (Check All on a checked row in a mixed selection) shows.",
      html: box(180, select("2 items selected", actionItems, ' id="census-hovered-row"')),
    },
    {
      h: "Open with a hovered checkbox",
      census: true,
      p: "The pointer over a row's checkbox: the checkbox box reads gray-100, the row's button stays transparent, and the hint reads Check or Uncheck.",
      html: box(180, select("2 items selected", actionItems, ' id="census-hovered-checkbox"')),
    },
    {
      h: "Open with a disabled row",
      census: true,
      p: "A disabled row: its button fades to 60% under a not-allowed cursor and takes no hover fill; the checkbox reads disabled.",
      html: box(180, select("2 items selected", [actionItems[0], actionItems[1], { ...actionItems[2], disabled: true }], ' id="census-disabled-row"')),
    },
    {
      h: "Open with the checkbox at the end",
      census: true,
      p: 'Rows with <code>checkbox-position="end"</code>: the checkbox box moves after the button and grows to 32px wide.',
      html: box(
        180,
        select(
          "2 items selected",
          actionItems.map((i) => ({ ...i, end: true })),
          ' id="census-checkbox-end"',
        ),
      ),
    },
    {
      h: "Open with leading content",
      census: true,
      p: "Rows with content in the <code>leading</code> slot: an icon in gray-900 before the name, 8px from it.",
      html: box(
        180,
        select(
          "2 items selected",
          actionItems.map((i) => ({ ...i, leading: true })),
          ' id="census-leading"',
        ),
      ),
    },
  ],
  practices: {
    "When to use": [
      "Pick a multi select when users pick more than one value from a known list (regions, scopes, tags).",
      "For a single value from a short list, use Select.",
      "When typing to filter is more important than seeing every option at once, use Combobox.",
      "Skip it for boolean settings; Toggle handles those.",
    ],
    Behavior: [
      "Show the selected count in the trigger (<code>3 regions selected</code>); show the single name when only one is picked.",
      "Use controlled mode (<code>value</code> set from outside) when state lives in the URL or syncs to the server, so the trigger label and the stored value stay in lockstep.",
      "Keep checkbox focus and button focus distinct, so Up and Down navigate rows and Left and Right toggle between the row's checkbox and action button.",
      'For empty filters, render <code>No {items} match "{query}"</code> rather than <code>No results</code>.',
    ],
    Accessibility: [
      "Each row checkbox needs an <code>aria-label</code> that names the item (<code>Select us-east-1</code>); a bare <code>Select</code> is unanchored for screen readers.",
      "The trigger button needs a stable accessible name even when zero items are selected; do not rely on the placeholder alone.",
      "Trap focus inside the menu while it is open and return focus to the trigger on close.",
      "Announce bulk actions (<code>Select All</code>, <code>Select Only</code>) through the visible button label, so the action matches what the screen reader speaks.",
    ],
  },
};
