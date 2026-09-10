// Maps acme-breadcrumb (src/components/breadcrumb) to Geist BreadcrumbItem: in the text type a
// 14px gray-900 flex li (gray-1000 when active or hovered, gray-700 and not-allowed when
// disabled) holding the text and a 16px chevron hidden on the last crumb, an anchor inside it
// inheriting the color with the focus ring as its shadow; in the menu type the tooltip trigger
// span (an inline block that truncates from the sm breakpoint) around a div and the chip: a 12px
// bordered button with the background-200 fill, white with a gray-600 border when active, a
// gray-alpha-200 fill when disabled. The crumb takes the type from the enclosing Breadcrumb; the
// list's every example renders one root per BreadcrumbItem instance.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "breadcrumbs",
  component: "BreadcrumbItem",
  element: "breadcrumb",
  root: (n) => (n.tag === "li" && has("gap-1.5")(n)) || (n.tag === "span" && n.attrs["data-testid"] === "legacy/tooltip-trigger"),
  ours: ".item",
  inherit: { type: "Breadcrumb" },
  defaults: { type: "text", active: "false", disabled: "false" },
  props: { type: { menu: ".menu" }, active: { true: ".active" }, disabled: { true: ".disabled" } },
  // Hover and keyboard focus are the Interaction controller's attributes; the last crumb's place among its siblings is the host's.
  states: { ":hover": "[data-hover]", ":focus-visible": "[data-focus]", ":last-of-type": "@:last-of-type" },
  // The trigger span is the flex item of the menu row in the reference; the host is in ours.
  host: { mirror: ["min-width", "max-width"], mods: { ".menu": "[menu]" } },
  // The chip sits in an unstyled div inside the trigger; the chevron and the anchor of a text crumb carry no classes of their own (the li's descendant rules reach them).
  children: [{ ours: "", pick: (c) => c.tag === "div", children: [{ ours: ".chip", pick: (c) => c.tag === "button" || c.tag === "a" }] }],
  // A legacy variant the reference sheet no longer defines.
  ignore: ["sm-max:last-of-type:mr-4"],
};
