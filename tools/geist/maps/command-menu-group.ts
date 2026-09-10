// Maps acme-command-group (src/components/command-group; the module ships beside the menu) to
// Geist CommandMenuGroup: an unstyled block whose heading is a 36px flex row (`--ds-size-medium`)
// of 13px gray-900 text with 8px of side padding, over the group's items. A group with no item
// matching the query is hidden. Only the sketched open examples render groups.
import type { GeistMap } from "../gen";
import { CLOSED } from "./command-menu";

export const geist: GeistMap = {
  page: "command-menu",
  element: "command-menu",
  component: "CommandMenuGroup",
  root: "cmdk-group",
  ours: ".group",
  skip: CLOSED,
  classes: { "[cmdk-group-heading]": "heading" },
  children: [
    { ours: ".heading", pick: (c) => "cmdk-group-heading" in c.attrs },
    { ours: ".items", pick: (c) => "cmdk-group-items" in c.attrs, children: [{ ours: "", pick: () => true, all: true, leaf: true }] },
  ],
};
