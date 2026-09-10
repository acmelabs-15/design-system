// Docs page: Switch — mirrors https://vercel.com/geist/switch
import type { Doc } from "../../site";

const start = (inner: string) => `<div class="vstack" style="align-items:flex-start">${inner}</div>`;
const pair = (name: string, extra = "", ctl = "") =>
  `<acme-switch name="${name}"${extra}><acme-switch-control default-checked label="Source" value="source"${ctl}></acme-switch-control><acme-switch-control label="Output" value="output"${ctl}></acme-switch-control></acme-switch>`;
// A bare sprite icon (no utility class): the control sizes it (16px, 20px in a large control).
const icon = (n: string) =>
  `<svg slot="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const icons = (name: string, extra = "") =>
  `<acme-switch name="${name}"${extra}><acme-switch-control default-checked label="Grid" value="source">${icon("grid")}</acme-switch-control><acme-switch-control label="List" value="output">${icon("list")}</acme-switch-control></acme-switch>`;
const three = (a: string, b: string, c: string) => `<div class="row" style="align-items:flex-start;gap:24px">${a}${b}${c}</div>`;

export const doc: Doc = {
  id: "switch",
  title: "Switch",
  lede: "Choose between a set of options.",
  tags: ["acme-switch", "acme-switch-control"],
  examples: [
    {
      h: "Default",
      p: "Give every control enough width so the group does not jump when the active option changes.",
      html: start(pair("default")),
    },
    {
      h: "Disabled",
      html: start(pair("view-mode", "", " disabled")),
    },
    {
      h: "Sizes",
      html: three(pair("sizes-small", ' size="small"'), pair("sizes-default"), pair("sizes-large", ' size="large"')),
    },
    {
      h: "Full width",
      p: "A control directly inside the group takes the group's size; its own size applies only when another element wraps it.",
      html: pair("full-width", ' style="width:100%"', ' size="large"'),
    },
    {
      h: "Tooltip",
      html: start(
        `<acme-switch name="view-mode"><acme-tooltip desktop-only text="View Source"><acme-switch-control default-checked label="Source" name="tooltip" size="large" value="source"></acme-switch-control></acme-tooltip><acme-tooltip desktop-only text="View Output"><acme-switch-control label="Output" name="tooltip" size="large" value="output"></acme-switch-control></acme-tooltip></acme-switch>`,
      ),
    },
    {
      h: "Icon",
      html: three(icons("icons-small", ' size="small"'), icons("icons-default"), icons("icons-large", ' size="large"')),
    },
    {
      h: "Hide border", census: true,
      html: start(pair("hide-border", " hide-border")),
    },
  ],
  practices: {
    "Best Practices": [
      "A Switch is a segmented selector for two or three mutually exclusive views of the same surface, such as Source and Output.",
      "A boolean on/off setting is a Toggle. A Switch has radio semantics, so its options exclude each other instead of reading as checkboxes.",
      "Past three options, or when a label grows past a couple of words, move to Tabs or a Select.",
      "Pass a <code>name</code> so the radios form one group; without it more than one option can look selected.",
      "Set <code>default-checked</code> (or the group's <code>value</code>) on exactly one control so the group starts in a defined state.",
      "Pad each control so the widest label fits without the active pill resizing on selection. Test with the longest label in the set.",
      "Title Case each label. Keep labels to one or two words and parallel: Source / Output, not Source / Show output.",
      "Give every control a <code>label</code>, even when an icon carries the meaning; the element reads it to screen readers and hides it visually for icon-only controls.",
      "Pair an icon-only Switch with a Tooltip on each control so sighted users get the same label assistive tech receives.",
    ],
  },
};
