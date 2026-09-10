// Maps acme-code-block (src/components/code-block) to Geist CodeBlock: the generator derives code-block.styles.ts from this.
import { type GeistMap, has, type SpecNode } from "../gen";

const section = (name: string) => (c: SpecNode) => c.attrs["data-section"] === name;
const button = (c: SpecNode) => "data-geist-button" in c.attrs;

export const geist: GeistMap = {
  page: "code-block",
  component: "CodeBlock",
  root: "data-geist-code-block",
  ours: ".code-block",
  defaults: { filename: "false", hideLineNumbers: "false", v0: "none" },
  values: { filename: { "*": "true" } },
  props: {
    filename: { true: ".with-bar" },
    hideLineNumbers: { true: ".hide-numbers" },
    v0: { ask: ".ask", build: ".build" },
  },
  // The root is the copy button's hover group; its hover is the root's.
  states: { ":hover": "[data-hover]", ":focus-within": "[data-focus-within]" },
  children: [
    // The language tabs strip above the bar: the tab list is an acme-tabs in ours, styled by its own map.
    { ours: ".strip", pick: has("overflow-x-auto"), children: [{ ours: "acme-tabs", pick: (c) => "data-geist-tabs" in c.attrs, extends: "tabs", leaf: true }] },
    {
      ours: ".bar",
      pick: section("tabs"),
      children: [
        {
          ours: ".name",
          pick: has("mr-auto"),
          children: [
            { ours: ".file-icon", pick: (c) => c.attrs["aria-hidden"] === "true", leaf: true },
            { ours: ".filename", pick: (c) => c.tag === "span" },
          ],
        },
        {
          ours: ".actions",
          pick: has("gap-1"),
          children: [
            // The language switcher wrapper is its own mapping (code-block-switcher): it is the hover group of its face.
            { ours: ".switcher", pick: (c) => c.children.some((k) => k.tag === "select"), leaf: true },
            // The block composes acme-copy-button, which composes acme-button, so the reference's
            // button sits two elements down on ours. The classes the block adds land on the copy
            // button's own `button` part, which it forwards with exportparts.
            // The glyph lives in the copy button's own tree, so no selector of ours reaches it: it is
            // named through the `icon` part that element exposes.
            { ours: "acme-copy-button", pick: button, extends: "button", part: "button", states: {}, children: [{ ours: "", part: "icon", pick: (c: SpecNode) => c.tag === "span", leaf: true }] },
          ],
        },
      ],
    },
    // Without a filename bar the copy button floats over the code and shows on the block's hover.
    { ours: "acme-copy-button.floating", pick: button, extends: "button", part: "button", states: { ":hover": "[data-hover]" }, children: [{ ours: "", part: "icon", pick: (c: SpecNode) => c.tag === "span", leaf: true }] },
    {
      ours: ".content",
      pick: section("content"),
      // The line numbers hover and focus on their own.
      states: {},
      children: [
        {
          ours: ".pre",
          pick: (c) => c.tag === "pre",
          // The lines, their number buttons and the tokens are reached by the pre's descendant rules (aliased below).
          children: [{ ours: ".body", pick: (c) => c.tag === "code", leaf: true }],
        },
      ],
    },
    {
      ours: ".foot",
      pick: has("justify-end"),
      children: [
        { ours: "acme-button", pick: (c) => c.tag === "a", extends: "button", part: "button", leaf: true, states: {} },
        // The build action is an acme-split-button in ours, styled by its own map.
        { ours: "acme-split-button", pick: (c) => /--divider-color/.test(c.attrs.style ?? ""), extends: "split-button", leaf: true },
      ],
    },
  ],
  // The switcher examples write the block in one branch per language and render the first.
  instances: { "Language switcher": 0, "Language switcher with tabs": 0 },
  classes: { vF3MAa_lineNumber: "ln", vF3MAa_hideLineNumbers: "hide-numbers" },
  ignore: ["group/copy", "prism-code", "language-jsx", "language-tsx"],
};
