import type { Doc } from "../../site";

export const doc: Doc = {
  id: "format-byte",
  title: "Format Byte",
  tags: ["acme-format-byte"],
  lede: "Format a numeric byte or bit amount with decimal or binary scaling and three significant digits.",
  examples: [
    { h: "Decimal bytes", html: '<acme-format-byte value="1234567"></acme-format-byte>' },
    { h: "Binary bytes", html: '<acme-format-byte value="1048576" unit-system="binary"></acme-format-byte>' },
    { h: "Bits and zero", html: '<acme-format-byte value="0" unit="bit"></acme-format-byte>' },
    { h: "Localized long names", html: '<acme-format-byte value="2048" unit-system="binary" unit-display="long" locale="fr-FR"></acme-format-byte>' },
  ],
  practices: {
    "Choose the unit deliberately": [
      "The numeric value is already in the declared unit. Selecting bit does not silently multiply a byte amount by eight.",
      "Decimal uses powers of 1000; binary uses powers of 1024. Binary short/narrow output uses IEC symbols such as KiB and Kibit; long names use localized prefixes.",
      "Missing or nonfinite values do not fabricate zero. Negative values are supported for differences.",
    ],
  },
};
