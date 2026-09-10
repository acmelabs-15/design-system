// Maps acme-choicebox (src/components/choicebox) to Geist ChoiceboxGroup: the generator derives choicebox.styles.ts
// from this. The root is the group container (a radiogroup or a group, carrying no class of its own); it holds the
// optional label (a Geist Label with bypassCasing: the element renders its markup and takes the label map's module) and
// the list, a flex row of the items. The items are acme-choicebox-item elements, mapped by maps/choicebox-item.ts.
import type { GeistMap, SpecNode } from "../gen";

export const geist: GeistMap = {
  page: "choicebox",
  component: "ChoiceboxGroup",
  root: (n: SpecNode) => n.tag === "div" && "aria-multiselectable" in n.attrs,
  ours: ".group",
  children: [
    { ours: ".label", pick: (c: SpecNode) => c.tag === "label", extends: "label", leaf: true },
    { ours: ".list", pick: (c: SpecNode) => c.tag === "ul", children: [{ ours: "", pick: (c: SpecNode) => c.tag === "li", all: true, leaf: true }] },
  ],
};
