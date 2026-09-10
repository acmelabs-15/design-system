// Docs page: Sheet — mirrors https://vercel.com/geist/sheet
import type { Doc } from "../../site";

const sides = ["top", "right", "bottom", "left"] as const;
const body = "Eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
const sub = `<p slot="header" class="text-copy-14 muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>`;
const footer = `<acme-button slot="footer" variant="secondary" data-close>Close</acme-button><acme-button slot="footer">Next</acme-button>`;
const inset = (id = "") => `<acme-sheet modal inset heading="Sheet Title"${id ? ` id="${id}"` : ""}><acme-button slot="trigger">Open Sheet</acme-button>${sub}${body}${footer}</acme-sheet>`;
const side = (s: string, id = "") =>
  `<acme-sheet modal side="${s}" heading="Sheet from ${s}"${id ? ` id="${id}"` : ""}><acme-button slot="trigger">Open ${s}</acme-button><p slot="header" class="text-copy-14 muted">This sheet slides in from the ${s}.</p></acme-sheet>`;
const censusNote = "A state the census reads: the census run opens it before it freezes the transitions.";

export const doc: Doc = {
  id: "sheet",
  title: "Sheet",
  lede: "Content in a side panel that slides in from an edge of the screen.",
  tags: ["acme-sheet"],
  examples: [
    {
      h: "Default",
      p: "With the style overrides front apps use most (<code>inset</code>): the panel inset 12px from the edges, rounded 16, 512 wide on large screens, with a padded header, body and footer.",
      html: inset(),
    },
    {
      h: "With Side",
      p: "The <code>side</code> attribute picks the edge the sheet slides in from.",
      html: `<div class="row" style="gap:16px;justify-content:center">${sides.map((s) => side(s)).join("")}</div>`,
    },
    {
      h: "Open",
      census: true,
      p: `${censusNote} The Default sheet open: the overlay, the inset panel on the right with its header, body and footer.`,
      html: inset("census-open"),
    },
    ...sides.map((s) => ({
      h: `Open ${s}`,
      census: true,
      p: `${censusNote} The plain panel open from the ${s}, with a header alone.`,
      html: side(s, `census-open-${s}`),
    })),
    {
      h: "Open long body",
      census: true,
      p: `${censusNote} The Default sheet with a body longer than the panel: the panel has no scroll of its own, so the body runs on past its bottom edge and the footer follows it.`,
      html: `<acme-sheet modal inset heading="Sheet Title" id="census-open-long"><acme-button slot="trigger">Open Sheet</acme-button>${sub}${`${body} `.repeat(14).trim()}${footer}</acme-sheet>`,
      code: `<acme-sheet modal inset heading="Sheet Title"><acme-button slot="trigger">Open Sheet</acme-button>${sub}${body}\n<!-- … the same paragraph 13 more times … -->\n${footer}</acme-sheet>`,
    },
  ],
  practices: {
    "When to use": [
      "Use a Sheet for context that stays tied to the page: deployment details, a log row, a member profile. The page behind it stays useful.",
      "Use Modal for a decision that must block the page. Use Drawer for a bottom sheet on mobile.",
      "Do not confirm a destructive action in a Sheet. The non-modal default keeps the page live, which makes a delete or revoke feel less serious than it is.",
    ],
    Behavior: [
      "The Sheet is non-modal by default so toasts and other high-z elements stay reachable. Keep that unless the sheet owns the screen.",
      "Pick <code>side</code> from where the trigger sits: a row inspector from the right, a global filter from the left. Keep the side fixed for the session.",
      "A click outside does not close the sheet. Always render a visible close control and let Escape close it.",
    ],
    Content: [
      "The title is Title Case and names the entity (<code>Deployment Details</code>, <code>Member Profile</code>), not the page action.",
      "The body is mostly read: sentence case prose with Title Case sub-headings. Action buttons are optional; when present, use Verb + Noun.",
      "Do not repeat the page header inside the sheet. The sheet is the detail layer.",
    ],
    Accessibility: [
      "Trap focus inside the open sheet and return it to the trigger row on close, so keyboard users keep their place in the list.",
      'Show a close button labelled <code>Close</code> (or an icon button with <code>aria-label="Close"</code>), since an outside click does not dismiss.',
      "Point <code>aria-labelledby</code> at the title. Add <code>aria-describedby</code> only when the body is short and carries the meaning.",
    ],
  },
};
