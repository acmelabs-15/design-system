// Maps the field of acme-combobox (src/components/combobox) to Geist Combobox's root: the focus-ring
// shell (`role="combobox"`, `.combobox` in ours) around the field wrapper (`group/combobox`, `.field`),
// which holds the prefix box (the glass, a spinner while loading, a slotted icon), the searchbox
// input, the chosen option's suffix beside the field (`displaySelectedSuffix`), the clear button and
// the menu button with its chevron. The variants the JSX does not name are read off the rendered
// root: the prefix box left out (`noInputPrefix`), the menu button left out (`showMenuButton`),
// the suffix shown, the list open (the chevron turns), and the keyboard focus ring the client adds
// to the input while its focus is visible. The open states and the field variants are sketches
// (tools/geist/sketch/combobox.*.json); the page's own examples render the closed field. The
// floating list (maps/combobox-list.ts) and the rows (maps/combobox-option.ts) are mapped on their own.
import { type GeistMap, has, type SpecNode } from "../gen";

/** The page's own examples: every list is closed there. Two open no field at all (a closed modal, a closed sheet). */
export const PAGE = ["Uncontrolled", "Controlled", "Disabled", "Errored", "Custom width input", "Custom width list", "Custom empty message", "Clearable", "With prefix icons", "With suffix icons", "With label", "Sizes", "Used inside a Modal", "Inside a Sheet with multi-line options"];
export const CLOSED = ["Used inside a Modal", "Inside a Sheet with multi-line options"];

const field = (n: SpecNode) => n.children.find((c) => c.tag === "div" && has("group/combobox")(c));
const input = (n: SpecNode) => field(n)?.children.find((c) => c.tag === "input");
const flag = (test: (n: SpecNode) => boolean) => (n: SpecNode) => (test(n) ? "true" : "false");
const isClear = (c: SpecNode) => c.tag === "button" && c.attrs["aria-label"] === "Clear selected value";
const isMenu = (c: SpecNode) => c.tag === "button" && !isClear(c);

export const geist: GeistMap = {
  page: "combobox",
  component: "Combobox",
  root: (n) => n.attrs.role === "combobox",
  ours: ".combobox",
  skip: CLOSED,
  defaults: { size: "medium", errored: "false", loading: "false", prefix: "true", menu: "true", suffix: "false", open: "false", keyboard: "false" },
  values: { errored: { "*": "true" }, loading: { "*": "true" } },
  derive: {
    prefix: flag((n) => !!field(n)?.children.some((c) => c.attrs["aria-hidden"] === "true")),
    menu: flag((n) => !!field(n)?.children.some(isMenu)),
    suffix: flag((n) => !!field(n)?.children.some(has("right-10"))),
    open: flag((n) => n.attrs["aria-expanded"] === "true"),
    keyboard: flag((n) => !!input(n) && has("!shadow-[var(--ds-focus-ring)]")(input(n)!)),
  },
  props: {
    size: { small: ".sm", large: ".lg" },
    errored: { true: ".errored" },
    loading: { true: ".loading" },
    prefix: { false: ".no-prefix" },
    menu: { false: ".no-menu" },
    suffix: { true: ".with-suffix" },
    open: { true: ".open" },
    keyboard: { true: ".keyboard" },
  },
  // The shell's own focus (its ring) and the wrapper's group hover are the root's attributes.
  states: { ":focus": "[data-focus]", ":hover": "[data-hover]" },
  children: [
    {
      ours: ".field",
      pick: (c) => c.tag === "div" && has("group/combobox")(c),
      children: [
        {
          ours: ".prefix",
          pick: (c) => c.attrs["aria-hidden"] === "true",
          children: [
            { ours: "acme-spinner", pick: (c) => c.attrs["data-glyph"] === "circular", extends: "spinner", part: "spinner", leaf: true },
            { ours: ".icon", pick: (c) => c.tag === "svg" },
          ],
        },
        // The field keeps its native disabled state; any focus of it is its focus state, and its hover is the shell's.
        { ours: ".input", pick: (c) => c.tag === "input", states: { ":focus": "[data-focus]", ":hover": "^[data-hover]" } },
        // The chosen option's suffix, a box beside the field: its pointer states are the shell's.
        { ours: ".suffix", pick: has("right-10"), states: { ":hover": "^[data-hover]", ":focus": "^[data-focus]" }, children: [{ ours: "", pick: (c) => c.tag === "svg", leaf: true }] },
        { ours: ".clear", pick: isClear, states: { ":hover": "[data-hover]", ":focus-visible": "[data-focus]" }, children: [{ ours: ".icon", pick: (c) => c.tag === "svg" }] },
        { ours: ".toggle", pick: isMenu, states: { ":hover": "[data-hover]" }, children: [{ ours: ".icon", pick: (c) => c.tag === "svg" }] },
      ],
    },
    // The live region announcing the result count while the list is open.
    { ours: ".status", pick: (c) => c.attrs.role === "status" },
    // The closed list (hidden) and the floating list are mapped on their own (maps/combobox-list.ts).
    { ours: "", pick: (c) => c.tag === "ul" || "data-radix-popper-content-wrapper" in c.attrs, all: true, leaf: true },
  ],
  // The consumer's width class on the root in two examples (a fit-content host in ours); the clear button's runtime focus marker carries no rule.
  ignore: ["w-fit", "focus-visible"],
  slotted: ["svg"],
};
