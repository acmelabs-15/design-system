// Docs page: Drawer — mirrors https://vercel.com/geist/drawer
import type { Doc } from "../../site";

const open = `<acme-button>Open</acme-button>`;
// The opener shows the drawer.
const wire = `root.querySelector("acme-button").addEventListener("click", () => root.querySelector("acme-drawer").show());`;
const title = `<p style="font-size:18px;line-height:24px;font-weight:600;text-align:center">A drawer title</p>`;
const body = `<p class="text-copy-14" style="text-align:center">Drawer body</p>`;
const content = (extra = "") => `<div style="display:flex;flex-direction:column;align-items:stretch;justify-content:flex-start;gap:8px;flex:0 1 auto;padding:48px">${title}${body}${extra}</div>`;
const paragraphs = Array.from({ length: 40 }, (_, i) => `<p class="text-copy-14">Paragraph ${i + 1} of the drawer body.</p>`).join("");
const longContent = content(paragraphs);
const longCode = content(`<p class="text-copy-14">Paragraph 1 of the drawer body.</p>\n<!-- … 39 more paragraphs … -->`);

export const doc: Doc = {
  id: "drawer",
  title: "Drawer",
  lede: "Shows content in a view of its own, apart from the page behind it.",
  tags: ["acme-drawer"],
  examples: [
    {
      h: "Default",
      p: "A Drawer is for small viewports only. This page shows it at every viewport so you can try it.",
      html: `${open}<acme-drawer>${content()}</acme-drawer>`,
      script: wire,
    },
    {
      h: "Custom height",
      html: `${open}<acme-drawer height="200">${content()}</acme-drawer>`,
      script: wire,
    },
    {
      h: "Open",
      census: true,
      p: "The drawer open: the black 40% backdrop, the popup pinned to the bottom edge, full width, rounded at the top, its content scrolling inside it.",
      html: `<acme-drawer id="open">${content()}</acme-drawer>`,
    },
    {
      h: "Open custom height",
      census: true,
      p: 'A fixed height (<code>height="200"</code>): the popup is 200px tall.',
      html: `<acme-drawer id="open-custom-height" height="200">${content()}</acme-drawer>`,
    },
    {
      h: "Open max height",
      census: true,
      p: '<code>height="max"</code>: the popup fills the viewport.',
      html: `<acme-drawer id="open-max-height" height="max">${content()}</acme-drawer>`,
    },
    {
      h: "Open no vertical scroll",
      census: true,
      p: '<code>vertical-scroll="false"</code>: the popup clips its content instead of scrolling it.',
      html: `<acme-drawer id="open-no-vertical-scroll" vertical-scroll="false">${content()}</acme-drawer>`,
    },
    {
      h: "Open nested",
      census: true,
      p: "<code>nested</code>: opened from inside a modal, the backdrop and the viewport sit one step above the modal's layer.",
      html: `<acme-drawer id="open-nested" nested>${content()}</acme-drawer>`,
    },
    {
      h: "Open scrolled",
      census: true,
      p: "Content taller than the popup's cap: the popup is capped and scrolls; the census scrolls it 160px.",
      html: `<acme-drawer id="open-scrolled">${longContent}</acme-drawer>`,
      code: `<acme-drawer id="open-scrolled">${longCode}</acme-drawer>`,
    },
    {
      h: "Open dragging",
      census: true,
      p: "Mid-drag: the popup follows the pointer 80px down through the swipe movement variable; the census swipes it with synthetic pointer events.",
      html: `<acme-drawer id="open-dragging">${content()}</acme-drawer>`,
    },
  ],
  practices: {
    "When to use": [
      "A Drawer is a bottom sheet for small viewports only. On desktop use Modal, or Sheet for side context; do not force a Drawer there.",
      "Do not confirm a destructive action in a Drawer. Its scrim does not block the page fully, so delete and revoke flows lose their weight; use Modal.",
      "Good uses are short, focused mobile tasks: one form, a filter sheet, a primary call to action with Cancel.",
    ],
    Behavior: [
      "A tap outside and a swipe down dismiss it. Keep both unless the form holds unsaved input.",
      "Keep vertical-scroll on so the body scrolls inside the sheet, not the page behind it.",
      "Set height only when the default height cuts off the primary action. The action and Cancel stay above the fold.",
    ],
    Content: [
      "The title is a Title Case statement that names the entity: Deployment Details, Filter Logs.",
      "The body is sentence case prose with one Verb + Noun primary button and a literal Cancel. Keep destructive cascade copy out of the small frame.",
      "Do not repeat the page heading as the title; say what this view does.",
    ],
    Accessibility: [
      "Focus stays inside the drawer while it is open and returns to the trigger on close.",
      "Escape closes it. Honor the system back gesture on mobile so users can leave without the close control.",
      "Body scroll locks on open and unlocks on close, so iOS rubber-band scroll does not leak through.",
    ],
  },
};
