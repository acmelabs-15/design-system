import type { Doc } from "../../site";
export const doc: Doc = {
  id: "format-number",
  title: "Format Number",
  tags: ["acme-format-number"],
  lede: "Format a numeric value with native locale-aware number options. Missing values stay empty.",
  examples: [
    { h: "Decimal", html: '<acme-format-number value="1250.5"></acme-format-number>' },
    { h: "Currency", html: '<acme-format-number value="1250.5" locale="en-US" options=\'{"style":"currency","currency":"USD"}\'></acme-format-number>' },
    { h: "Percent", html: '<acme-format-number value="0.375" options=\'{"style":"percent","maximumFractionDigits":1}\'></acme-format-number>' },
  ],
  practices: {
    "Keep data numeric": [
      "Use the value attribute in HTML and the value property in Lit/React. Child text is not parsed as a number.",
      "Locale inherits from Theme unless supplied directly. Native lang and dir retain their own meaning.",
      "Invalid option combinations render no invented value and produce a development diagnostic.",
    ],
  },
};
