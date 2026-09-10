// Maps acme-load-more (src/components/load-more) to Geist LoadMoreButton: a secondary submit
// Button that the load-more button composes (acme-button), so only the classes it adds are
// derived, onto the composed button's part: the top gap, the full width, the squared corners.
import type { GeistMap } from "../gen";

export const geist: GeistMap = {
  page: "load-more-button",
  component: "LoadMoreButton",
  root: "data-geist-button",
  ours: "acme-button",
  part: "button",
  extends: "button",
  skip: ["Placeholder", "Placeholder without gap"],
  defaults: { noGap: "false", noBorderRadius: "false", loading: "false" },
  props: {
    noGap: { true: ".no-gap" },
    noBorderRadius: { true: ".no-radius" },
    loading: { true: ".loading" },
  },
};
