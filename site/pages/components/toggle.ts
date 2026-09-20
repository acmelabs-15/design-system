// Docs page: Toggle — mirrors https://vercel.com/geist/toggle
import type { Doc } from "../../site";

// Bare sprite icons (no utility class): the thumb sizes them.
const icon = (n: string, slot: string) =>
  `<svg slot="${slot}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const icons = icon("lock", "icon-checked") + icon("lock-open", "icon-unchecked");
const shared = `for (const t of root.querySelectorAll("acme-toggle")) t.addEventListener("acme-change", (e) => { for (const o of root.querySelectorAll("acme-toggle")) o.checked = e.detail.checked; });`;
const labeled = (extra = "", inner = "") =>
  `<div class="row" style="gap:16px"><acme-toggle${extra}>${inner}Enable Firewall</acme-toggle><acme-toggle direction="switch-first"${extra}>${inner}Enable Firewall</acme-toggle></div>`;

export const doc: Doc = {
  id: "toggle",
  title: "Toggle",
  lede: "Displays a boolean value.",
  tags: ["acme-toggle"],
  examples: [
    {
      h: "Default",
      html: `<div class="vstack"><acme-toggle aria-label="Enable Firewall"></acme-toggle><acme-toggle aria-label="Enable Firewall" checked></acme-toggle></div>`,
    },
    {
      h: "Disabled",
      html: `<div class="vstack"><acme-toggle aria-label="Enable Firewall" disabled></acme-toggle><acme-toggle aria-label="Enable Firewall" checked disabled></acme-toggle></div>`,
    },
    {
      h: "Sizes",
      html: `<div class="row"><acme-toggle aria-label="Enable Firewall"></acme-toggle><acme-toggle aria-label="Enable Firewall" size="medium"></acme-toggle><acme-toggle aria-label="Enable Firewall" size="large"></acme-toggle></div>`,
    },
    {
      h: "Custom Color",
      html: `<div class="vstack"><acme-toggle aria-label="Enable Firewall" color="amber">${icons}</acme-toggle><acme-toggle aria-label="Enable Firewall" color="red">${icons}</acme-toggle><acme-toggle aria-label="Enable Firewall" color="amber" size="large">${icons}</acme-toggle><acme-toggle aria-label="Enable Firewall" color="red" size="large">${icons}</acme-toggle></div>`,
      script: shared,
    },
    {
      h: "With Label",
      html: `<div class="vstack" style="gap:16px">${labeled()}${labeled(' size="large"')}${labeled("", icons)}${labeled(' size="large"', icons)}</div>`,
      script: shared,
    },
  ],
  practices: {
    "Best Practices": [
      "Use a Toggle for one boolean setting where ON takes effect at once, such as Password Protection or Auto-Cancel Builds. A multi-select list is Checkboxes; two or three exclusive views are a Switch.",
      "The element reflects <code>checked</code>; own the state in your app and update it from <code>acme-change</code>.",
      "Persist on change and confirm with a success toast (Password protection enabled) so the user knows the flip stuck. Add a form footer only when the setting needs an explicit Save.",
      "Disable a Toggle only when the action is impossible (missing plan, locked policy), with helper text or a Tooltip that names the way out.",
      "The label is the element's content, not a prop. Title Case noun phrase, 1–4 words, naming what is true when ON: Password Protection, not Enable Password Protection.",
      "An optional one-sentence description under the label explains ON only. Do not describe OFF; it is the negation.",
      'Keep <code>label-casing="title"</code> (the default) so labels match other Title Case surfaces; use <code>normal</code> only for sentence-case text inline beside the toggle.',
      "Give an accessible name through the content, <code>aria-label</code> or <code>aria-labelledby</code>.",
      "Set <code>aria-label</code> only when the visible label sits elsewhere in the row; otherwise let the content carry it so sighted and screen-reader copy match.",
    ],
  },
};
