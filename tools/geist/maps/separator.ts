// Maps acme-separator (src/components/separator) to Geist Separator: the generator derives separator.styles.ts from this.
import type { GeistMap, SpecNode } from "../gen";

export const geist: GeistMap = {
  page: "separator",
  component: "Separator",
  root: (n: SpecNode) => n.attrs["data-slot"] === "separator",
  ours: ".separator",
  defaults: { orientation: "horizontal" },
  props: {
    orientation: { vertical: ".vertical" },
  },
};
