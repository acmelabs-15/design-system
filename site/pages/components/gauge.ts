// Docs page: Gauge — mirrors https://vercel.com/geist/gauge
import type { Doc } from "../../site";

const pink = `colors='{"0":"var(--ds-pink-100)","10":"var(--ds-pink-200)","20":"var(--ds-pink-300)","30":"var(--ds-pink-400)","50":"var(--ds-pink-500)","60":"var(--ds-pink-600)","70":"var(--ds-pink-700)","80":"var(--ds-pink-800)","90":"var(--ds-pink-900)","100":"var(--ds-pink-1000)"}'`;

export const doc: Doc = {
  id: "gauge",
  title: "Gauge",
  lede: "A circular visual for a percentage.",
  tags: ["acme-gauge"],
  examples: [
    {
      h: "Default",
      html: `<div class="row" style="gap:32px;align-items:stretch;flex-wrap:nowrap"><acme-gauge size="tiny" value="50"></acme-gauge><acme-gauge size="small" value="50"></acme-gauge><acme-gauge size="medium" value="50"></acme-gauge><acme-gauge size="large" value="50"></acme-gauge></div>`,
    },
    {
      h: "Label",
      html: `<div class="row" style="gap:32px;align-items:stretch;flex-wrap:nowrap"><acme-gauge show-value size="tiny" value="80"></acme-gauge><acme-gauge show-value size="small" value="80"></acme-gauge><acme-gauge show-value size="small" value="100"></acme-gauge><acme-gauge show-value size="medium" value="80"></acme-gauge><acme-gauge show-value size="medium" value="100"></acme-gauge><acme-gauge show-value size="large" value="80"></acme-gauge><acme-gauge show-value size="large" value="100"></acme-gauge></div>`,
    },
    {
      h: "Default color scale",
      html: `<div class="row" style="gap:32px;align-items:stretch;flex-wrap:nowrap"><acme-gauge size="small" value="14"></acme-gauge><acme-gauge size="small" value="34"></acme-gauge><acme-gauge size="small" value="68"></acme-gauge></div>`,
    },
    {
      h: "Custom color range",
      html: `<div class="row" style="gap:8px;align-items:stretch;flex-wrap:nowrap">${[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((v) => `<acme-gauge ${pink} size="small" value="${v}"></acme-gauge>`).join("")}</div>`,
    },
    {
      h: "Custom secondary color",
      html: `<acme-gauge colors='{"primary":"var(--ds-blue-700)","secondary":"var(--ds-blue-300)"}' size="medium" value="50"></acme-gauge>`,
    },
    {
      h: "Arc priority",
      p: "For a ratio, set arc-priority to equal. Both arcs then lose the same gap, so 50 reads as one half.",
      html: `<div class="row" style="gap:8px;align-items:stretch;flex-wrap:nowrap"><acme-gauge arc-priority="equal" colors='{"primary":"var(--ds-blue-700)","secondary":"var(--ds-red-700)"}' show-value size="medium" value="50"></acme-gauge></div>`,
    },
    {
      h: "Indeterminate",
      html: `<div class="row" style="gap:8px;align-items:stretch;flex-wrap:nowrap"><acme-gauge indeterminate size="tiny" value="25"></acme-gauge><acme-gauge indeterminate size="small" value="25"></acme-gauge><acme-gauge indeterminate size="medium" value="25"></acme-gauge><acme-gauge indeterminate size="large" value="25"></acme-gauge></div>`,
    },
  ],
  practices: {
    "When to use": [
      "A 0 to 100 ratio against a fixed maximum, where the comparison is the point: quota usage, build cache hit rate, uptime, billing-period consumption.",
      "Task progress with a known total (uploads, multi-step setup) is Progress.",
      "A binary or enumerated state is Status Dot for deployments and Badge for everything else.",
    ],
    Behavior: [
      "Set arc-priority equal for a true ratio, so 50 reads as one half. Keep the default primary arc when the filled part is the story.",
      "Threshold colors use the same breakpoints as the rest of the product (80 warning, 95 error). Do not invent gauge-only thresholds.",
      "Put explanatory copy next to an indeterminate gauge (Calculating usage…) so the reader knows the value loads and is not zero.",
    ],
    Content: [
      "Pair the gauge with a label or a Tooltip that names the metric (Build Cache Hit Rate). The gauge alone says nothing.",
      "The label carries the unit (Uptime · 99.97%). The default slot is for an icon overlay, not a unit.",
      "With show-value the number is the value alone. Never add a % or a unit to the value.",
    ],
    Accessibility: [
      "The element sets role progressbar with aria-valuemin, aria-valuemax and aria-valuenow. Do not override them.",
      "The adjacent label is the accessible name; tie it to the gauge with aria-labelledby so a screen reader says Uptime, 99 percent.",
      "Color alone does not carry a threshold; pair the warning tint with copy below or in the Tooltip.",
    ],
  },
};
