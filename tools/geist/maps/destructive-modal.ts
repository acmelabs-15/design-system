// Maps acme-destructive-modal (src/components/destructive-modal) to Geist DestructiveActionModal:
// the generator derives destructive-modal.styles.ts from this. The reference composes a 480px Modal
// (its title, subtitle, actions and panel are the modal's own, see maps/modal*.ts) around a form
// whose body content is one stack: the irreversibility band (a filled error Note), the field (the
// prompt label with the bold phrase above an Input) and the inline Error. In ours the stack is the
// element's slotted content of the composed acme-modal, so the stack is the root here (`.stack`)
// and the note, the input and the error are composed elements (acme-note, acme-input, acme-error)
// whose own maps ship their rules; only the stack, the field, the prompt and the phrase are this
// element's. The page's own examples render the closed opener only; every open state is a sketch
// under tools/geist/sketch/destructive-action-modal.*.json.
import { type GeistMap, has } from "../gen";

const closed = ["Default", "Reversible", "Loading", "With error"];

export const geist: GeistMap = {
  page: "destructive-action-modal",
  component: "DestructiveActionModal",
  root: (n) => n.tag === "div" && has("space-y-6")(n),
  ours: ".stack",
  skip: closed,
  defaults: { irreversible: "false", loading: "false", error: "false" },
  values: { error: { "*": "true" } },
  // The band is a child, not a prop the stack's classes name: a root with one reads as irreversible.
  derive: { irreversible: (n) => String(n.children.some((c) => c.attrs["data-slot"] === "note")) },
  props: { irreversible: { true: ".irreversible" }, loading: { true: ".loading" }, error: { true: ".errored" } },
  children: [
    { ours: "acme-note", pick: (c) => c.attrs["data-slot"] === "note", extends: "note", part: "note", leaf: true },
    {
      ours: ".field",
      pick: has("items-stretch"),
      children: [
        { ours: ".prompt", pick: (c) => c.tag === "label", children: [{ ours: ".phrase", pick: (c) => c.tag === "b" }] },
        { ours: "acme-input", pick: (c) => "data-geist-input-wrapper" in c.attrs, extends: "input", part: "wrap", leaf: true },
      ],
    },
    { ours: "acme-error", pick: (c) => "data-geist-error" in c.attrs, extends: "error", part: "error", leaf: true },
  ],
};
