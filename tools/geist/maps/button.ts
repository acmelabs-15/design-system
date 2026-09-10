// Maps acme-button (src/components/button) to Geist Button: the generator derives button.styles.ts from this.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "button",
  component: ["Button", "ButtonLink", "CustomButton"],
  root: "data-geist-button",
  ours: ".btn",
  defaults: { size: "medium", variant: "default", shape: "none", shadow: "false", loading: "false", disabled: "false", svgOnly: "false", elementChild: "false", type: "button" },
  props: {
    size: { tiny: ".tiny", small: ".sm", large: ".lg" },
    variant: { secondary: ".secondary", tertiary: ".tertiary", error: ".error", warning: ".warning" },
    shape: { square: ".square", circle: ".circle", rounded: ".rounded" },
    shadow: { true: ".shadow" },
    loading: { true: ".loading" },
    svgOnly: { true: ".icon" },
    elementChild: { true: ".el" },
    type: { unstyled: ".unstyled" },
    disabled: { true: ":disabled" },
    $tag: { ButtonLink: ".link", CustomButton: ".custom" },
  },
  children: [
    { ours: ".prefix", pick: has("mr-[3px]"), children: [{ ours: ".dots", pick: has("aspect-square"), leaf: true }] },
    { ours: ".label", pick: has("truncate") },
    { ours: ".suffix", pick: has("ml-1") },
  ],
  ignore: ["group/trigger"],
  slotted: ["svg"],
};
