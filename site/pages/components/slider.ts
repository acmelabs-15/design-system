// Docs page: Slider — mirrors https://vercel.com/geist/slider
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "slider",
  title: "Slider",
  lede: "Input to select a value from a given range.",
  tags: ["acme-slider"],
  examples: [
    {
      h: "Default",
      html: `<form><acme-slider value="[50]"></acme-slider></form>`,
    },
    {
      h: "With label",
      html: `<form><acme-slider label="Volume" value="[40]"></acme-slider></form>`,
    },
    {
      h: "Range with inputs",
      html: `<form><acme-slider show-end-input show-start-input value="[50, 75]"></acme-slider></form>`,
    },
    {
      h: "Disabled range with inputs",
      html: `<form><acme-slider disabled show-end-input show-start-input value="[50, 75]"></acme-slider></form>`,
    },
    {
      h: "Commit on release",
      html: `<form><acme-slider label="Drag then release" value="[50]"></acme-slider><p class="text-copy-13" style="color:var(--ds-gray-900);margin-top:8px">Last committed: <output>—</output></p></form>`,
      script: "root.querySelector('acme-slider').addEventListener('acme-commit', e => { root.querySelector('output').textContent = e.detail.value[0] })",
    },
    {
      h: "Full width", census: true,
      p: "The group fills its row instead of keeping its 216px minimum: here a 552px column.",
      html: `<form style="width:552px;max-width:100%"><acme-slider full-width value="[50]"></acme-slider></form>`,
    },
  ],
  practices: {
    "Best Practices": [
      "Use a slider for a numeric range where the shape and the nearness matter more than the exact figure: bandwidth caps, opacity, volume, color channels.",
      "For an exact value like a port or a memory limit, pair the slider with a numeric Input. Keyboard users type by default.",
      "Snap to a sensible step (<code>1</code>, <code>5</code>, <code>10%</code>) so a drag never lands on <code>47.83291</code>. Clamp <code>min</code> and <code>max</code> to real product limits.",
      "Always show the live value next to the track in tabular numbers, and say what the number is (<code>Sample Rate · 44 kHz</code>). The track alone does not explain itself.",
      "Threshold colors (a warning or error tint past a limit) use the same break point the rest of the UI shows. Do not invent a slider-only threshold.",
      "Name the slider with a sibling <code>label</code> or <code>aria-label</code>, and leave the native arrow, Page Up/Down, Home and End keys alone.",
    ],
  },
};
