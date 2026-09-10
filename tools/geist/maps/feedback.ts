// Maps acme-feedback (src/components/feedback) to Geist Feedback: the generator derives
// feedback.styles.ts from this. Two roots share one mapping: the inline pill's centered row
// (`[data-feedback-inline]`, `.panel.inline`) and the trigger variant's floating wrapper (the
// popper wrapper around the open card, `.panel`), each holding the card (`.box`). The card's inside
// is the same in both: the transition wrapper around the form (fields, hint, footer with the emoji
// radios and the Send button) or the success view. The trigger itself is a plain acme-button
// (small, secondary) and needs no rules of its own. The open, error and sent states are sketches
// under tools/geist/sketch/feedback.*.json.
import { type ChildMap, type GeistMap, has, type SpecNode } from "../gen";

const composed = (marker: string) => (c: SpecNode) => c.tag === "label" && c.children.some((k) => marker in k.attrs);
// The emoji radios are real buttons: their hover and focus land as state attributes (an Interaction controller each).
const emojis: ChildMap = { ours: ".emojis", pick: has("gap-[1px]"), children: [{ ours: ".emoji", pick: (c) => c.tag === "button", all: true, states: { ":hover": "[data-hover]", ":focus-visible": "[data-focus]" } }] };
const body: ChildMap[] = [
  {
    ours: ".phase",
    pick: (c) => "data-phase" in c.attrs,
    children: [
      {
        ours: "form",
        pick: (c) => c.tag === "form",
        children: [
          {
            ours: ".fields",
            pick: has("p-2"),
            children: [
              // The topic select and the email input are composed elements with rules of their own.
              { ours: "", pick: composed("data-geist-select"), leaf: true },
              { ours: "", pick: composed("data-geist-input-wrapper"), leaf: true },
              // The textarea is composed too; the fixed height the panel gives its field lands on the field part.
              { ours: "", pick: composed("data-geist-textarea-wrapper"), children: [{ ours: "", pick: 0, children: [{ ours: "acme-textarea", pick: (c) => c.tag === "textarea", part: "textarea", extends: "textarea/textarea", leaf: true, states: {} }] }] },
              { ours: ".error", pick: has("grid"), children: [{ ours: ".error-inner", pick: 0, children: [{ ours: "p", pick: 0 }] }] },
              { ours: ".hint", pick: has("text-label-12"), children: [{ ours: "svg", pick: (c) => c.tag === "svg" }] },
            ],
          },
          {
            ours: ".foot",
            pick: has("border-t"),
            children: [emojis, { ours: "acme-button", pick: (c) => "data-geist-button" in c.attrs, extends: "button", part: "button", leaf: true, states: {} }],
          },
        ],
      },
    ],
  },
  {
    ours: ".done",
    pick: has("flex-col"),
    children: [
      { ours: "svg", pick: (c) => c.tag === "svg" },
      // The two lines fade in one after the other: each has its own delay.
      { ours: ".received", pick: 1 },
      { ours: ".thanks", pick: 2 },
    ],
  },
];

export const geist: GeistMap = {
  page: "feedback",
  component: "Feedback",
  root: (n) => "data-feedback-inline" in n.attrs || "data-radix-popper-content-wrapper" in n.attrs,
  ours: ".panel",
  // The trigger examples render the closed trigger only (a plain acme-button); the open card is the "Open" sketches.
  skip: ["Default", "Feedback with Select", "Feedback with metadata", "Feedback with prefix", "Feedback with suffix"],
  defaults: { sent: "false" },
  // After a submission the card of the trigger variant takes a fixed height.
  derive: { sent: (n) => (n.children.some(has("h-[195px]")) ? "true" : "false") },
  props: {
    type: { inline: ".inline" },
    fullWidth: { true: ".full" },
    upwards: { true: ".up" },
    sent: { true: ".sent" },
  },
  ignore: ["radius", "checkmark"],
  children: [
    {
      ours: ".box",
      pick: has("overflow-hidden"),
      children: [
        {
          ours: ".head",
          pick: has("pl-4"),
          children: [{ ours: ".copy", pick: (c) => c.tag === "p" }, emojis],
        },
        ...body,
      ],
    },
  ],
};
