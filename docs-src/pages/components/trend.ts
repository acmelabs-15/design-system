// Docs page: Trend (house component)
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "trend",
  title: "Trend",
  lede: "A signed change with its direction: the arrow, the sign and the percent. A house component; Geist has no page for it.",
  tags: ["acme-trend"],
  house: true,
  examples: [
    {
      h: "Default",
      p: "Green up, red down, gray flat; mono, 12px, weight 500.",
      html: `<div class="row" style="gap:16px"><acme-trend direction="up">+12.5%</acme-trend><acme-trend direction="down">−2.1%</acme-trend><acme-trend>0.0%</acme-trend></div>`,
    },
    {
      h: "Pill",
      p: "When it stands alone in a head or beside a note.",
      html: `<div class="row" style="gap:16px"><acme-trend pill direction="up">+6.03%</acme-trend><acme-trend pill direction="down">−1.2%</acme-trend><acme-trend pill note="vs last month">0.0%</acme-trend></div>`,
    },
    {
      h: "Large",
      html: `<div class="row" style="gap:16px"><acme-trend large direction="up">+12.5%</acme-trend><acme-trend large direction="down">−2.1%</acme-trend></div>`,
    },
    {
      h: "In a Stat",
      p: "Plain after the value in the trend slot; a pill in the delta slot beside its note.",
      html: `<div class="cells" style="--cols:2"><acme-stat class="cell" label="Revenue">$62,450<acme-trend slot="trend" direction="up">+4.8%</acme-trend><acme-stat-delta slot="delta"><acme-trend pill direction="up" note="vs last month">+6.03%</acme-trend></acme-stat-delta></acme-stat><acme-stat class="cell" label="Churn">3.2%<acme-trend slot="trend" direction="down">−0.4%</acme-trend><acme-stat-desc slot="desc">Lower is better.</acme-stat-desc></acme-stat></div>`,
    },
    {
      h: "In a bar row",
      html: `<acme-bar-row label="Equities" value="45%" percent="45" style="display:block;max-width:360px"><span>Target 50%</span><acme-trend direction="up">+2.1%</acme-trend></acme-bar-row>`,
    },
  ],
  practices: {
    "When to use": [
      "A change over a period, never a state: a badge names a state, a trend never does.",
      "Plain when it follows a value or sits in a bar row; a pill when it stands alone in a head or beside a vs-note.",
    ],
    Content: ["Always signed (+4.8%, −2.1%); the arrow carries the direction; the note names the baseline (vs last month)."],
  },
};
