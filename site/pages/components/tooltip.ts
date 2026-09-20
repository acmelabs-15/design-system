// Docs page: Tooltip — mirrors https://vercel.com/geist/tooltip
import type { Doc } from "../../site";

const TEXT = "The Evil Rabbit Jumped over the Fence";
const cell = (inner: string) => `<div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">${inner}</div>`;
const rowOf = (cells: string[]) => `<div style="display:flex;flex-wrap:wrap;position:relative;min-width:1px;max-width:100%">${cells.map(cell).join("")}</div>`;
const tip = (label: string, attrs = "", content = "") => `<acme-tooltip${attrs}>${content}<span>${label}</span></acme-tooltip>`;
const sides = (extra = "", content = "") =>
  rowOf([
    tip("Top", `${extra}${content ? "" : ` text="${TEXT}"`}`, content),
    tip("Bottom", `${extra} position="bottom"${content ? "" : ` text="${TEXT}"`}`, content),
    tip("Left", `${extra} position="left"${content ? "" : ` text="${TEXT}"`}`, content),
    tip("Right", `${extra} position="right"${content ? "" : ` text="${TEXT}"`}`, content),
  ]);
const aligned = (position: string, name: string) =>
  rowOf([
    tip(`${name}/Left`, ` box-align="left" position="${position}" text="${TEXT}"`),
    tip(`${name}/Center`, ` position="${position}" text="${TEXT}"`),
    tip(`${name}/Right`, ` box-align="right" position="${position}" text="${TEXT}"`),
  ]);
const custom = `<span slot="content">The <b>Evil Rabbit</b> Jumped over the <i>Fence</i>.</span>`;
const typed = (extra = "") =>
  rowOf([
    tip("Top", `${extra} text="${TEXT}" variant="success"`),
    tip("Bottom", `${extra} position="bottom" text="${TEXT}" variant="error"`),
    tip("Left", `${extra} position="left" text="${TEXT}" variant="warning"`),
    tip("Right", `${extra} position="right" text="${TEXT}" variant="violet"`),
  ]);
/** The open states: `shown` holds the open bits (1 hover or keyboard, 4 touch) and `disable-triggers` keeps the bubble open through scrolls and keys. */
const OPEN = ' shown="1" disable-triggers';
const TOUCH = ' shown="4" disable-triggers';

export const doc: Doc = {
  id: "tooltip",
  title: "Tooltip",
  lede: "A floating label that appears on hover or focus to provide additional context about an element.",
  tags: ["acme-tooltip"],
  examples: [
    { h: "Default", html: sides() },
    { h: "No delay", html: sides(' delay="false"') },
    { h: "Box align", html: aligned("bottom", "Bottom") + aligned("left", "Left") + aligned("right", "Right") },
    { h: "Custom content", html: sides("", custom) },
    { h: "Custom type", html: typed() },
    {
      h: "Components",
      html: rowOf([
        `<acme-tooltip position="bottom" text="${TEXT}"><acme-button size="small">Bottom</acme-button></acme-tooltip>`,
        `<acme-tooltip position="left" text="${TEXT}"><acme-badge size="sm">LEFT</acme-badge></acme-tooltip>`,
        `<acme-tooltip position="right" text="${TEXT}"><acme-spinner></acme-spinner></acme-tooltip>`,
        `<acme-tooltip text="Search"><acme-kbd slot="content">/</acme-kbd><span>Shortcut</span></acme-tooltip>`,
      ]),
    },
    {
      h: "Other",
      html: rowOf([`<acme-tooltip text="${TEXT}" tip="false">No tip indicator</acme-tooltip>`, `<acme-tooltip center="false" text="${TEXT} multiple times.">No center text</acme-tooltip>`]),
    },
    { h: "Open", census: true, p: "The bubble open on each side, through <code>shown</code>: 13px inverted-theme text 10px from the trigger, the arrow centred on the facing edge.", html: sides(OPEN) },
    {
      h: "Open aligned", census: true,
      p: "The bubble aligned to the trigger's start or end above and below it: the arrow sits at the arrow offset from the bubble's edge, over the trigger's centre.",
      html: rowOf([
        tip("Top/Left", `${OPEN} box-align="left" text="${TEXT}"`),
        tip("Top/Right", `${OPEN} box-align="right" text="${TEXT}"`),
        tip("Bottom/Left", `${OPEN} box-align="left" position="bottom" text="${TEXT}"`),
        tip("Bottom/Right", `${OPEN} box-align="right" position="bottom" text="${TEXT}"`),
      ]),
    },
    { h: "Open no delay", census: true, p: "Without the entry delay the fade-in starts at once.", html: sides(`${OPEN} delay="false"`) },
    {
      h: "Open lower delay", census: true,
      p: 'The shorter entry delay (<code>lower-delay</code>), and a bubble a touch opened (<code>shown="4"</code>, both with <code>disable-triggers</code> so a scroll does not close them): the faster fade-in, over a backdrop that catches the next tap.',
      html: rowOf([tip("Lower delay", `${OPEN} lower-delay text="${TEXT}"`), tip("Touch", `${TOUCH} text="${TEXT}"`)]),
    },
    { h: "Open custom type", census: true, p: "A type sets the themed colour variables of that tooltip variant on the bubble.", html: typed(OPEN) },
    { h: "Open custom type unfilled", census: true, p: 'With <code>fill="false"</code> the plain variant\'s variables apply instead of the filled tooltip ones.', html: typed(`${OPEN} fill="false"`) },
    {
      h: "Open shortcut", census: true,
      p: "A key in the content: the bubble becomes an inline flex row with a 4px gap, and the key draws small and flat on the gray-400 fill.",
      html: rowOf([`<acme-tooltip${OPEN} text="Search"><acme-kbd slot="content">/</acme-kbd><span>Shortcut</span></acme-tooltip>`]),
    },
    {
      h: "Open other", census: true,
      p: "Without the arrow, without centred text, without wrapping, and without the inverted theme.",
      html: rowOf([
        tip("No tip", `${OPEN} text="${TEXT}" tip="false"`),
        tip("No center", `${OPEN} center="false" text="${TEXT} multiple times."`),
        tip("No wrap", `${OPEN} wrap="false" text="${TEXT}"`),
        tip("No invert", `${OPEN} invert-theme="false" text="${TEXT}"`),
      ]),
    },
  ],
  practices: {
    "When to use": [
      "A Tooltip explains why something exists, not what it is. The visible label names the thing; the tooltip adds the constraint, scope or limit.",
      "An entity preview with metadata rows (avatar, identifier, a few facts, an optional action) is a Context Card. Long content or actions that must persist go to a Drawer or a page.",
      "Lifecycle tooltips (Alpha, Experimental, Beta, Early Access) name the limits that apply: API stability, SLA, support, pricing, retention.",
    ],
    Behavior: [
      "Tooltips open on hover and on keyboard focus. Keep the default ~150 ms delay so a sweeping mouse does not flicker them.",
      "Never wrap a labelled Input in a Tooltip: the trigger lands on the label, and the text becomes a second invisible label for screen readers. Put help on a sibling icon button.",
      "Keep primary actions outside the Tooltip; touch users cannot reach a hover-revealed control.",
    ],
    Content: [
      "One sentence or fragment in <code>text</code>. Sentence case, no period for a single fragment.",
      "Skip a tooltip that repeats the visible label (Rate Limit on a Rate Limit button) or describes the interaction (Click to override).",
      "A lifecycle tooltip reads {Label}: {one-line meaning}. {Specific limit}. For a paid Beta feature, combine lifecycle and pricing in one tooltip instead of stacking two badges.",
    ],
    Accessibility: [
      "An icon-only trigger needs an <code>aria-label</code> that names the action; the tooltip adds context, it does not replace the label.",
      "Escape closes the tooltip and focus stays on the trigger.",
    ],
  },
};
