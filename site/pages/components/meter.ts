import type { Doc } from "../../site";
export const doc: Doc = {
  id: "meter",
  title: "Meter",
  lede: "A circular measurement within a known range.",
  tags: ["acme-meter"],
  examples: [
    {
      h: "Measured values",
      html:
        '<acme-h-stack gap="6" flex-wrap="wrap">' +
        [0, 25, 50, 75, 100].map((value) => `<acme-meter label="Measurement ${value}" value="${value}" size="medium" show-value></acme-meter>`).join("") +
        "</acme-h-stack>",
    },
    {
      h: "Preferred range",
      html: '<acme-h-stack gap="6"><acme-meter label="Storage used" value="20" low="30" high="70" optimum="0" size="medium" show-value></acme-meter><acme-meter label="Storage used" value="50" low="30" high="70" optimum="0" size="medium" show-value></acme-meter><acme-meter label="Storage used" value="90" low="30" high="70" optimum="0" size="medium" show-value value-text="90 percent used, least preferred range"></acme-meter></acme-h-stack><p>Below 30 is preferred in this example; the application supplies these boundaries.</p>',
    },
    {
      h: "Missing and loading",
      html: '<acme-h-stack gap="6"><acme-meter label="Capacity" size="medium"></acme-meter><acme-meter label="Capacity" loading size="medium"></acme-meter><acme-meter label="Capacity" value="0" size="medium" show-value></acme-meter></acme-h-stack>',
    },
    {
      h: "Sizes",
      html:
        '<acme-h-stack gap="6" flex-wrap="wrap">' +
        ["tiny", "small", "medium", "large"].map((size) => `<acme-meter label="Size example" value="65" size="${size}" show-value></acme-meter>`).join("") +
        "</acme-h-stack>",
    },
  ],
  practices: {
    Values: [
      "Supply an accessible label and a finite value with a valid min/max range. The defaults are 0 and 100. Negative ranges are supported.",
      "Missing data displays a dash; loading displays a Spinner. Both omit the native numerical meter instead of announcing a fabricated zero.",
      "Known values use native meter semantics. The display clamps values to the range while retaining the supplied value and reporting the clamp. Invalid or equal limits produce an unavailable state with a diagnostic.",
      "low and high define ordered boundaries inside the range. optimum identifies the preferred region. Without supplied low/high boundaries, the indicator remains neutral instead of inferring a rating.",
    ],
    Presentation: [
      "showValue displays a localized compact value. Use larger sizes when the text needs more space. The complete numerical value remains available through native semantics.",
      "valueText supplies explicit accessible formatting and meaning, including units and threshold context.",
      "The circular geometry is independent of the announced value. Shared Lit Motion interpolates changes; reduced motion makes them immediate.",
      "Use Progress for task completion; Meter does not report progress or submit a form value.",
    ],
  },
};
