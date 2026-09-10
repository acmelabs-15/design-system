// Docs page: Context Card — mirrors https://vercel.com/geist/context-card
import type { Doc } from "../../site";

const rabbit = "The Evil Rabbit Jumped over the Fence";
const column = (inner: string) => `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;flex:0 1 auto">${inner}</div>`;
const sides = (extra = "") =>
  `<div style="display:flex;flex-direction:row;align-items:stretch;justify-content:space-around;flex:0 1 auto">${["top", "bottom", "left", "right"]
    .map((s) => column(`<acme-context-card${extra} content="${rabbit}" side="${s}"><span>${s[0].toUpperCase()}${s.slice(1)}</span></acme-context-card>`))
    .join("")}</div>`;

export const doc: Doc = {
  id: "context-card",
  title: "Context Card",
  lede: "A floating card that appears on hover or focus and holds richer UI than a tooltip.",
  tags: ["acme-context-card"],
  examples: [
    { h: "Default", html: sides() },
    {
      h: "Alignment",
      p: "Set <code>align</code> to put the card at the start, the center or the end of the trigger.",
      html: `<div style="display:flex;gap:16px;align-items:center;justify-content:center"><acme-context-card align="start" content="Start alignment positions the card at the beginning edge." side="bottom"><acme-button>Start</acme-button></acme-context-card><acme-context-card align="center" content="Center alignment positions the card in the middle." side="bottom"><acme-button>Center</acme-button></acme-context-card><acme-context-card align="end" content="End alignment positions the card at the ending edge." side="bottom"><acme-button>End</acme-button></acme-context-card></div>`,
    },
    {
      h: "Render prop",
      p: "The trigger is whatever you slot: a button, a link, a badge. Plain content gets the element's own wrapper. The element is the trigger's box, so a link's own look (colour, underline) goes on the element and the link inherits it.",
      html: `<div style="display:flex;align-items:center;gap:32px"><acme-context-card content="Default: the trigger renders its own &lt;div&gt; around the children." side="top"><acme-button>Default wrapper</acme-button></acme-context-card><acme-context-card content="render: trigger behavior is merged onto your element. In this case a semantic &lt;a&gt;." side="top" style="color:var(--ds-blue-700);text-decoration:underline;text-underline-offset:2px"><a href="https://vercel.com" rel="noreferrer" target="_blank" style="color:inherit;text-decoration:inherit">Rendered as a link</a></acme-context-card></div>`,
    },
    {
      h: "Open",
      census: true,
      p: "The card open on each side of its trigger (the census sets <code>shown</code> to 1 on each): the fixed layer, the fader, the shell with the 1px ring and the tooltip shadow, the 14 by 7 stem on the facing edge, and the padded content box. Opened from rest, the shell, the stem and the content skip the move transition.",
      html: sides(),
    },
    {
      h: "Open in transit",
      census: true,
      p: "The card on each side as it moves from a neighbouring trigger (the census sets <code>shown</code> to 9 on each: open, moved): the shell, the stem and the content take the 250ms move transition on transform, width and height.",
      html: sides(),
    },
  ],
  practices: {
    "When to use": [
      "A Context Card reveals entity metadata on hover or focus: a user, a deployment, a project, an API key; the trigger is usually a name link or an avatar in dense data.",
      "A one-line why with no metadata rows is a Tooltip; long-form content, an edit form or persistent navigation goes to a Drawer or a detail page.",
      "No destructive action lives in a Context Card: the card can close on cursor exit before the user commits.",
    ],
    Behavior: [
      "It opens on hover and keyboard focus and closes on cursor exit or blur; the ~150 ms entry delay stops it flashing on a fast mouse sweep.",
      "At most one primary action (View Project, Open Settings); two CTAs read as a menu and belong in a Menu.",
      "A Context Card never sits inside a Tooltip or another Context Card: the second layer steals focus and traps keyboard users.",
    ],
    Content: [
      "Lead with the entity name as a Title Case heading and one identifying line in sentence case under it (team slug, owner, deployment URL).",
      "Then 2–4 rows of Label: value with Title Case noun keys (Last Active, Created, Plan); values follow the table-cell rules, and an unknown value is an em dash (—), never N/A or null.",
      "The card does not repeat what the trigger already shows: a row that renders the deployment URL does not open the card with it.",
    ],
    Accessibility: [
      "The trigger keeps its own accessible name; the card is supplementary and never replaces it.",
      "Card content is reachable by keyboard once the trigger has focus; Escape closes the card and returns focus to the trigger.",
    ],
  },
};
