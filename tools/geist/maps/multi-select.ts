// Maps the trigger of acme-multi-select (src/components/multi-select) to Geist MultiSelectTrigger:
// the secondary medium Button the trigger renders, drawn in full in our own shadow tree (`.trigger`
// in ours). The trigger is not the button page's button: the reference merges its own classes into
// the Button's (a normal weight for the medium one, 13px of right padding for the padding variable,
// no pointer fill), so a class the Button's roots carry is not always on this root, and a rule the
// composed button's own tree marks important could not be beaten from ours. Every class the rendered
// trigger carries is derived here: the button's shell and its states (the keyboard focus ring, the
// disabled fade), the content between its ends, the gray-alpha-500 ring under the pointer, full
// width below the reference's `sm` breakpoint, the label box (`.label`) around the slotted content
// (`.text`), and the suffix box (`.suffix`) with the chevron (`.chev`, the icon in gray-700,
// gray-1000 under the pointer, turned while the list is open without a transition, 1px into the
// right padding). The page's own examples render the closed trigger; the sketches
// (tools/geist/sketch/multi-select.*.json) render it open with the list, which
// maps/multi-select-content.ts and maps/multi-select-row.ts cover.
import { type GeistMap, has } from "../gen";

/** The page's own examples: every list is closed there. */
export const PAGE = ["Select Actions", "Keyboard Navigation", "Controlled State"];

export const geist: GeistMap = {
  page: "multi-select",
  component: "MultiSelectTrigger",
  root: "data-geist-button",
  ours: ".trigger",
  // The pointer, press and keyboard focus states the reference keys off the button's own attributes, and the open state the popover sets on it.
  states: { "[data-hover=true]": "[data-hover]", "[data-hover]": "[data-hover]", "[data-focus]": "[data-focus]", "[data-active]": "[data-active]", "[data-state=open]": "[data-state=open]" },
  classes: { "[data-multi-select-trigger-suffix]": "chev" },
  children: [
    { ours: ".label", pick: has("truncate"), children: [{ ours: ".text", pick: 0 }] },
    { ours: ".end", pick: has("ml-1"), children: [{ ours: ".chev", pick: 0, children: [{ ours: "svg", pick: 0 }] }] },
  ],
  ignore: ["group/trigger"],
};
