import type { Doc } from "../../site";

export const doc: Doc = {
  id: "sparkline",
  title: "Sparkline",
  lede: "A compact value sequence with independent direction and meaning.",
  tags: ["acme-sparkline"],
  examples: [
    { h: "Named sequence", html: '<acme-sparkline label="Requests over six samples" values="[1,3,2,5,4,6]" direction="up"></acme-sparkline>' },
    { h: "Fewer failures", html: '<acme-sparkline label="Failures decreased over six samples" values="[8,6,7,4,3,1]" direction="down" sentiment="positive"></acme-sparkline>' },
    { h: "Gaps", html: '<acme-sparkline label="Sample sequence with one missing value" values="[1,3,null,4,2,5]"></acme-sparkline>' },
    {
      h: "Stat composition",
      html: '<acme-stat><acme-stat-label>Requests</acme-stat-label><acme-stat-value>240</acme-stat-value><acme-stat-footer><acme-sparkline values="[1,3,2,5,4,6]"></acme-sparkline></acme-stat-footer><acme-stat-description>Requests increased over six samples.</acme-stat-description></acme-stat>',
    },
  ],
  practices: {
    Meaning: [
      "Direction does not select a color. Use sentiment for favorable, unfavorable or neutral meaning.",
      "Provide a label when the chart carries information. Omit it only when the surrounding content already describes the graphic.",
      "Null and nonfinite samples form gaps. Missing data does not become zero.",
    ],
  },
};
