// Maps acme-fieldset (src/components/fieldset) to Geist Fieldset: the generator derives fieldset.styles.ts from this.
// The root is the card (material-base; a colored border for type error and warning, a group whose
// type the footer reads). The content holds the title, the subtitle, and the error or warning
// text in its spacing row; the footer holds the status and the actions, one wrapper per action
// around a composed small Button (acme-button; its classes are the button's own). The reference
// marks disabled content and a highlighted footer with classes, read here as root props. The
// disabled content's rules on what sits inside it (the title, the wall, a button, an icon) are the
// title's context and the slotted content's.
import { type GeistMap, has, type SpecNode } from "../gen";

const marked = (attr: string) => (c: SpecNode) => attr in c.attrs;

export const geist: GeistMap = {
  page: "fieldset",
  component: "Fieldset",
  root: "data-geist-fieldset",
  ours: ".fieldset",
  defaults: { type: "none", disabled: "false", highlight: "false" },
  derive: {
    disabled: (n) => (n.children.some((c) => marked("data-geist-fieldset-content")(c) && has("geist-disabled")(c)) ? "true" : "false"),
    highlight: (n) => (n.children.some((c) => c.tag === "footer" && has("bg-[var(--bg,#f5f5f5)]")(c)) ? "true" : "false"),
  },
  props: {
    type: { error: ".error", warning: ".warning" },
    disabled: { true: ".disabled" },
    highlight: { true: ".highlight" },
  },
  // The footer reads the card's type through the group.
  states: {
    "[data-fieldset-type=error]": ".error",
    "[data-fieldset-type=warning]": ".warning",
  },
  // The content reads its subtitle-last state through the subtitle marker: our subtitle class.
  classes: { "[data-geist-fieldset-subtitle]": "subtitle" },
  // The disabled content qualifies the rules on the title below it: our root's modifier.
  context: { ".geist-disabled": ":where(.disabled)" },
  ignore: ["group/fieldset"],
  children: [
    {
      ours: ".content",
      pick: marked("data-geist-fieldset-content"),
      owns: ["disabled"],
      children: [
        // Disabled content renders a wall of its own before its children: the composed acme-disabled-wall, whose classes are its own.
        { ours: "acme-disabled-wall", pick: has("geist-disabled-wall"), extends: "disabled-wall", part: "wall", leaf: true },
        { ours: ".title", pick: (c) => c.tag === "h4" },
        { ours: ".subtitle", pick: marked("data-geist-fieldset-subtitle") },
        {
          ours: ".row",
          pick: has("mt-4"),
          children: [
            { ours: ".error", pick: marked("data-geist-fieldset-error") },
            { ours: ".warning", pick: marked("data-geist-fieldset-warning") },
          ],
        },
        // The disabled-wall example's own box: slotted content, with the wall of acme-disabled-wall inside.
        { ours: "", pick: has("mt-2"), leaf: true },
      ],
    },
    {
      ours: ".footer",
      pick: (c) => c.tag === "footer",
      owns: ["highlight"],
      children: [
        { ours: ".status", pick: marked("data-geist-fieldset-footer-status"), children: [{ ours: "", pick: (c) => c.tag === "span", leaf: true }] },
        {
          ours: ".actions",
          pick: marked("data-geist-fieldset-footer-actions"),
          children: [
            {
              ours: ".action",
              pick: marked("data-geist-fieldset-footer-action"),
              all: true,
              // The composed small button: every class is the button's own, its module reaches its slotted icon; nothing is emitted here.
              children: [{ ours: "", pick: marked("data-geist-button"), leaf: true }],
            },
          ],
        },
        // The highlighted footer's text: slotted content.
        { ours: "", pick: (c) => c.tag === "span", leaf: true },
      ],
    },
  ],
  slotted: { "[data-geist-button]": "acme-button", svg: "svg", img: "img", strong: "strong" },
};
