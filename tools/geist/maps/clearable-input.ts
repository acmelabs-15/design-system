// Maps acme-clearable-input (src/components/clearable-input) to Geist ClearableInput: the generator derives
// clearable-input.styles.ts from this. The root is an acme-input (its wrapper classes are the input's own); this
// element adds the suffix content: the clear button with its Esc key, or the ⌘ K keys that slide to Esc once the
// field has a value (`data-animate` on the input host).
import { type GeistMap, has, type SpecNode } from "../gen";

const kbd = (ours: string, index: number, children?: GeistMap["children"]) => ({ ours, pick: (c: SpecNode, i: number) => c.tag === "kbd" && i === index, extends: "kbd", part: "kbd", children });

export const geist: GeistMap = {
  page: "clearable-input",
  component: "ClearableInput",
  root: "data-geist-input-wrapper",
  extends: "input",
  ours: ".input",
  children: [
    { ours: "", pick: (c: SpecNode) => c.tag === "input", leaf: true },
    {
      ours: "",
      pick: (c: SpecNode) => "data-geist-input-suffix" in c.attrs,
      children: [
        // The clear button keeps its native states (a real button with its own hover and focus).
        { ours: ".clear", pick: (c: SpecNode) => c.tag === "button", states: {}, children: [kbd("acme-kbd", 0)] },
        {
          ours: ".cmdk",
          pick: has("clearable-input"),
          children: [
            kbd(".k-esc", 0, [{ ours: ".keys", pick: (c: SpecNode) => c.tag === "span", children: [{ ours: "[data-key=esc]", pick: (c: SpecNode) => c.attrs["data-key"] === "esc" }, { ours: "[data-key=cmd]", pick: (c: SpecNode) => c.attrs["data-key"] === "cmd" }] }]),
            kbd(".k-k", 1),
          ],
        },
      ],
    },
  ],
  ignore: ["font-inherit", "[&>span]:font-inherit", "group", "clearable-input"],
};
