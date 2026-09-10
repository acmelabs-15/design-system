// Maps the list of acme-command-menu (src/components/command-menu) to Geist CommandMenuList: the
// 8px-padded listbox on the background-100 fill that scrolls past 436px from the sm breakpoint
// (a flex box with no cap below it), around a full-width sizer that holds the empty message (30px
// of vertical padding around a centred 14px gray-900 line with the query in gray-1000) and the
// slotted groups, items and dividers (their own maps). Only the sketched open examples render it.
import type { GeistMap } from "../gen";
import { CLOSED } from "./command-menu";

export const geist: GeistMap = {
  page: "command-menu",
  element: "command-menu",
  component: "CommandMenuList",
  root: "cmdk-list",
  ours: ".list",
  skip: CLOSED,
  classes: { "[cmdk-list-sizer]": "sizer" },
  children: [
    {
      ours: ".sizer",
      pick: (c) => "cmdk-list-sizer" in c.attrs,
      children: [
        {
          ours: ".empty",
          pick: (c) => "cmdk-empty" in c.attrs,
          children: [{ ours: ".empty-text", pick: (c) => c.tag === "p", children: [{ ours: ".query", pick: (c) => c.tag === "span" }] }],
        },
        { ours: "", pick: (c) => !("cmdk-empty" in c.attrs), all: true, leaf: true },
      ],
    },
  ],
};
