// Maps acme-combobox-option (src/components/combobox-option) to Geist ComboboxOption: a 36px row
// (`.option` in ours; its own height with `ignoreDefaultHeight`, `.auto`) holding an optional
// start span, the truncated label span (a string child; other content renders as given), an
// optional end span, and, on the chosen row with no end content, a check icon pushed to the end. The
// row under the keys or the pointer is highlighted (`aria-selected`, `.active` in ours); the row
// whose value is chosen is marked (`data-highlighted`, `.chosen`); a disabled row fades and takes no
// pointer. The size follows the enclosing Combobox. Only the sketched open examples render rows.
import { type GeistMap, type SpecNode } from "../gen";
import { PAGE } from "./combobox";

const flag = (test: (n: SpecNode) => boolean) => (n: SpecNode) => (test(n) ? "true" : "false");
const start = (c: SpecNode) => "data-geist-combobox-option-prefix" in c.attrs;
const end = (c: SpecNode) => "data-geist-combobox-option-suffix" in c.attrs;

export const geist: GeistMap = {
  page: "combobox",
  component: "ComboboxOption",
  root: (n) => n.tag === "li" && n.attrs.role === "option",
  ours: ".option",
  skip: [...PAGE, "Field variants", "Keyboard focus"],
  inherit: { size: "Combobox" },
  defaults: { size: "medium", disabled: "false", ignoreDefaultHeight: "false", truncateStart: "false", truncateEnd: "false", active: "false", chosen: "false" },
  derive: {
    active: flag((n) => n.attrs["aria-selected"] === "true"),
    chosen: flag((n) => n.attrs["data-highlighted"] === "true"),
  },
  props: {
    size: { small: ".sm", large: ".lg" },
    disabled: { true: ".disabled" },
    ignoreDefaultHeight: { true: ".auto" },
    truncateStart: { true: ".truncate-start" },
    truncateEnd: { true: ".truncate-end" },
    active: { true: ".active" },
    chosen: { true: ".chosen" },
  },
  children: [
    { ours: ".start", pick: start, children: [{ ours: "", pick: (c) => c.tag === "svg", leaf: true }] },
    { ours: ".label", pick: (c) => c.tag === "span" && "title" in c.attrs },
    { ours: ".end", pick: end, children: [{ ours: "", pick: (c) => c.tag === "svg", leaf: true }] },
    { ours: ".check", pick: (c) => c.tag === "svg" },
    // Content that is not a string renders as given: slotted light DOM in ours.
    { ours: "", pick: (c) => c.tag === "div", leaf: true },
  ],
  slotted: ["svg", "div"],
};
