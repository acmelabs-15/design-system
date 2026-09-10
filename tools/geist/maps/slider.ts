// Maps acme-slider (src/components/slider) to Geist Slider: the generator derives slider.styles.ts from this.
// The rendered root is the column around the label and the row; the row holds the optional start field
// (a Geist Input, small, 48px wide), the group (the track, its fill and the thumbs, each around a visually
// hidden range input) and the optional end field. The label is a Geist Label instance (acme-label in ours).
// The "Full width" example is sketched from the client chunk (`w-full min-w-0` on the group in place of `min-w-54`).
import { type GeistMap, has, type SpecNode } from "../gen";

const slot = (name: string) => (c: SpecNode) => c.attrs["data-slot"] === name;
const field = (name: string) => (c: SpecNode) => "data-geist-input-wrapper" in c.attrs && c.children.some(slot(name));

export const geist: GeistMap = {
  page: "slider",
  component: "Slider",
  root: (n: SpecNode) => n.tag === "div" && has("flex-col")(n) && n.children.some(has("gap-3")),
  ours: ".slider",
  defaults: { fullWidth: "false" },
  props: { fullWidth: { true: ".full" } },
  // A thumb's focus states are attributes the element keeps in step with the focus inside it
  // (`data-focus` for the visible focus, `data-focus-within` for any focus); `data-dragging` and
  // `data-disabled` are the element's own state attributes, set where the reference sets them.
  states: { ":has(:focus-visible)": "[data-focus]", ":has(:focus)": "[data-focus-within]" },
  children: [
    // The label is a Geist Label: the element renders its markup and takes the label map's module, so nothing is emitted for it here.
    { ours: ".label", pick: (c: SpecNode) => c.tag === "label", extends: "label", leaf: true },
    {
      ours: ".row",
      pick: has("gap-3"),
      children: [
        // The fields are composed acme-input elements (their own map ships the wrapper's rules); the width this element adds lands on the wrapper part.
        { ours: ".start-input", pick: field("slider-start-input"), extends: "input", part: "wrap", leaf: true, states: {} },
        {
          ours: ".group",
          pick: slot("slider"),
          children: [
            {
              ours: ".control",
              pick: slot("slider-control"),
              children: [
                {
                  ours: ".track",
                  pick: slot("slider-track"),
                  children: [
                    { ours: ".fill", pick: slot("slider-indicator") },
                    { ours: ".thumb", pick: slot("slider-thumb"), all: true, children: [{ ours: "input", pick: (c: SpecNode) => c.tag === "input" }] },
                  ],
                },
              ],
            },
          ],
        },
        { ours: ".end-input", pick: field("slider-end-input"), extends: "input", part: "wrap", leaf: true, states: {} },
      ],
    },
  ],
};
