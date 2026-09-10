// Maps the mobile button of acme-banner (src/components/banner) to Geist Banner's first sibling: a
// small secondary rounded ButtonLink (acme-button; only the classes the banner adds are derived,
// onto the composed button's part) that holds the whole message as its label with the arrow
// suffix, sits centred at its fit width, and is hidden from the lg breakpoint up, where the wide
// row (maps/banner.ts) shows instead. A second mapping of the element.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "banner",
  element: "banner",
  component: "Banner",
  root: (n) => n.tag === "a" && has("lg:!hidden")(n),
  ours: "acme-button.mobile",
  part: "button",
  extends: "button",
};
