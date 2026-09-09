// Docs page: Gauge — mirrors https://vercel.com/geist/gauge
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "gauge",
  title: "Gauge",
  lede: "A circular visual for a percentage against a fixed maximum.",
  tags: ["acme-gauge"],
  examples: [
    {
      h: "Size",
      p: "tiny 20, small 32, medium 64, large 128.",
      html: `<div class="row" style="gap:32px"><acme-gauge size="tiny" value="50"></acme-gauge><acme-gauge value="50"></acme-gauge><acme-gauge size="medium" value="50"></acme-gauge><acme-gauge size="large" value="50"></acme-gauge></div>`,
    },
    {
      h: "Label",
      html: `<div class="row" style="gap:32px"><acme-gauge value="80" show-value></acme-gauge><acme-gauge size="medium" value="80" show-value></acme-gauge><acme-gauge size="large" value="100" show-value></acme-gauge></div>`,
    },
    {
      h: "Default color scale",
      p: "red-800 low, amber-700 mid, green-700 high; the arc follows the value.",
      html: `<div class="row" style="gap:32px"><acme-gauge value="14"></acme-gauge><acme-gauge value="34"></acme-gauge><acme-gauge value="68"></acme-gauge><acme-gauge value="92"></acme-gauge></div>`,
    },
    {
      h: "Custom color",
      html: `<acme-gauge size="medium" value="50" color="accent"></acme-gauge>`,
    },
  ],
  practices: {
    "When to use": ["A 0–100 ratio where the comparison is the point: quota, cache hit rate, uptime. Progress for known task progress; Status Dot or Badge for a state."],
    Content: ["Always pair the gauge with a label naming the metric; thresholds match the product's breakpoints (80 warning, 95 error)."],
  },
};
