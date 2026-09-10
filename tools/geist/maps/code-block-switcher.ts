// Maps the language switcher of acme-code-block (the select wrapper in the bar, the hover group of its face)
// to the select the reference CodeBlock renders for `switcher`: the generator derives code-block-switcher.styles.ts from this.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "code-block",
  element: "code-block",
  component: "CodeBlock",
  root: (n) => n.tag === "div" && has("h-8")(n) && n.children.some((c) => c.tag === "select"),
  ours: ".switcher",
  skip: ["Default", "No filename", "Highlighted lines", "Added & removed lines", "Referenced lines", "Language switcher with tabs", "Hidden line numbers", "Open in v0"],
  instances: { "Language switcher": 0 },
  states: { ":hover": "[data-hover]", ":focus-within": "[data-focus-within]" },
  children: [
    { ours: ".face", pick: (c) => c.attrs["aria-hidden"] === "true" },
    { ours: "select", pick: (c) => c.tag === "select", children: [{ ours: "option", pick: (c) => c.tag === "option", all: true }] },
  ],
  ignore: ["group"],
};
