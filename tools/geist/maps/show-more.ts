// Maps acme-show-more (src/components/show-more) to Geist ShowMore: a flex row of two hairlines
// around a pill that holds a small rounded secondary Button (acme-button, composed, so the two
// levels inside it carry no selector of ours); the chevron span at the end of the text turns
// with `expanded`.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "show-more",
  component: "ShowMore",
  root: (n) => n.tag === "div" && has("min-h-[30px]")(n),
  ours: ".show-more",
  defaults: { expanded: "false", noBorder: "false" },
  // The Default example binds `expanded` to a state variable that starts collapsed.
  values: { expanded: { expanded: "false" } },
  props: { expanded: { true: ".expanded" }, noBorder: { true: ".no-border" } },
  children: [
    { ours: ".line", pick: (c) => "data-line" in c.attrs, all: true },
    {
      ours: ".pill",
      pick: has("rounded-[99px]"),
      children: [
        {
          ours: "",
          pick: (c) => "data-geist-button" in c.attrs,
          children: [{ ours: "", pick: 0, children: [{ ours: ".text", pick: 0, children: [{ ours: ".chev", pick: 0 }] }] }],
        },
      ],
    },
  ],
};
