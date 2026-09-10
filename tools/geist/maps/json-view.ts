// Maps acme-json-view (src/components/json-view) to Geist JsonView: an inline mono wrapper around the
// tree, whose rows are tree items. The first-level item (`top`) flows inline; every deeper item is a
// block. An object row's line wrapper holds the toggle (chevron, key, bracket, and the ellipsis when
// collapsed) over the block group of child rows and the block closing bracket; an object with one
// short pair keeps its group inline (`flat`, `pair`, `cell`), a longer single pair stacks the line
// (`line.block`); an empty object has a bare bracket span (`brace`). A primitive row is `row` with the
// key and one value kind; a search hit is a `mark`. Rows recur: each kind is mapped once, at the
// shallowest place it occurs, and the descendant selectors reach it at every depth.
import { type ChildMap, type GeistMap, has, type SpecNode } from "../gen";

const role = (r: string) => (c: SpecNode) => c.attrs.role === r;
const mark: ChildMap = { ours: "mark", pick: (c) => c.tag === "mark", all: true };
const key: ChildMap = { ours: ".key", pick: has("text-pink-900"), children: [mark] };
const values: ChildMap[] = [
  key,
  { ours: ".str", pick: has("text-green-900"), children: [mark] },
  { ours: ".num", pick: has("text-blue-900"), children: [mark] },
  { ours: ".bool", pick: has("text-amber-900"), children: [mark] },
  { ours: ".nil", pick: has("text-gray-900"), children: [mark] },
];
const chev: ChildMap = { ours: ".chev", pick: has("inline-flex") };
const dots: ChildMap = { ours: ".dots", pick: has("text-gray-900") };
const toggle = (children: ChildMap[]): ChildMap => ({ ours: ".toggle", pick: has("cursor-pointer"), children });
const flat = (children?: ChildMap[]): ChildMap => ({ ours: ".flat", pick: (c) => role("group")(c) && has("inline")(c), children, leaf: !children });
const group: ChildMap = { ours: ".group", pick: (c) => role("group")(c) && has("block")(c), leaf: true };
/** The line wrapper of an object row: no class of its own (`line.block` when a long single pair stacks; its inside follows the plain line's rules). */
const line = (children: ChildMap[]): ChildMap => ({ ours: ".line", pick: (c, i) => i === 0 && !c.attrs.role && !has("pl-[18px]")(c) && !has("block")(c), children });
/** The block closing bracket of a row, after its group or inside its stacked line wrapper. */
const closeBlock: ChildMap = { ours: ".close.block", pick: (c, i) => i > 0 && !c.attrs.role && has("block")(c) };

export const geist: GeistMap = {
  page: "json-view",
  component: "JsonView",
  root: (n) => n.tag === "span" && has("font-mono")(n) && n.children[0]?.attrs.role === "tree",
  ours: ".json",
  // The toggle's own hover, and the focus of the row (`group/json-child`) and the hover of the toggle (`group/json-toggle`) that its descendants key off.
  states: { ":hover": "[data-hover]", ":focus-visible": "[data-focus]" },
  groupOnAncestor: true,
  children: [
    {
      ours: ".tree",
      pick: role("tree"),
      children: [
        {
          ours: ".top",
          pick: role("treeitem"),
          children: [
            line([toggle([chev, dots]), flat([{ ours: ".pair", pick: role("treeitem"), children: [{ ours: ".cell", pick: 0, children: values }] }]), group]),
            {
              ours: ".group",
              pick: role("group"),
              children: [
                {
                  ours: ".item",
                  pick: role("treeitem"),
                  all: true,
                  children: [
                    { ours: ".row", pick: has("pl-[18px]"), children: values },
                    line([toggle([chev, key, dots]), { ours: ".brace", pick: (c) => has("pl-[18px]")(c) && !has("cursor-pointer")(c), children: [key] }, flat()]),
                    { ours: ".line.block", pick: (c, i) => i === 0 && !c.attrs.role && has("block")(c), leaf: true },
                    group,
                    closeBlock,
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
