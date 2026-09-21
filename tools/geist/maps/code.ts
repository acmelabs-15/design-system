// Maps acme-code (src/components/code) to Geist Code: the generator derives code.styles.ts from this.
import type { GeistMap } from "../gen";

export const geist: GeistMap = {
  page: "code",
  component: "Code",
  root: (n) => n.tag === "code",
  ours: ".code",
  // The code element's token rules (`.token.comment` …) reach our tokens, which carry those class names.
  // The language name and a legacy color class: no rule in the sheet.
  ignore: ["javascript", "color-[var(--geist-foreground)]"],
};
