// Maps acme-note (src/components/note) to Geist Note: the generator derives note.styles.ts from this.
import { type GeistMap, has, type SpecNode } from "../gen";

const slot = (name: string) => (c: SpecNode) => c.attrs["data-slot"] === name;

export const geist: GeistMap = {
  page: "note",
  component: "Note",
  root: slot("note"),
  ours: ".note",
  defaults: { variant: "default", fill: "false", size: "medium", disabled: "false", action: "false" },
  // The action wrapper is a child, not a prop: a root with one reads as action="true".
  derive: { action: (n) => (n.children.some(slot("note-action")) ? "true" : "false") },
  props: {
    variant: { success: ".success", error: ".error", warning: ".warning", secondary: ".secondary", violet: ".violet", cyan: ".cyan" },
    fill: { true: ".fill" },
    size: { small: ".sm" },
    disabled: { true: ".disabled" },
    action: { true: ".with-action" },
  },
  children: [
    {
      ours: ".body",
      pick: slot("note-body"),
      children: [
        { ours: ".icon", pick: slot("note-icon") },
        {
          ours: ".text",
          pick: has("flex-col"),
          children: [
            {
              ours: ".content",
              pick: slot("note-content"),
              // The link in the example content is the Link component, slotted through in ours: its own styles are not the note's.
              children: [
                { ours: ".label", pick: slot("note-label") },
                { ours: "", pick: (c) => c.tag === "a", leaf: true },
              ],
            },
          ],
        },
      ],
    },
    { ours: ".action", pick: slot("note-action"), leaf: true },
  ],
  slotted: ["a", "code", "svg", "button", "*"],
};
