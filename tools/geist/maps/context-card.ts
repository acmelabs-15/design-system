// Maps the open card of acme-context-card (src/components/context-card) to Geist ContextCard's
// floating layer, a client-only state drawn from the component's class strings (sketches
// tools/geist/sketch/context-card.*): the fixed viewport-filling overlay (`.layer`, ours a manual
// popover in the top layer), the fader that shows the layer (`.fade`, 150ms), the shell (`.card`:
// background-100, a 6px radius, the tooltip shadow under a 1px ring of the background, sized and
// moved by inline styles), the 14 by 7 stem on the facing edge (`.arrow`, rotated per side, 3.5px
// into the shell on the left and right; its glyph an inline svg with no rules), and the content
// box (`.box`, 12px padding, pointer events by inline style) around the content fader (`.body`).
// `side` is the resolved side (the reference flips it when the viewport leaves no room); `skip` is
// the shell's `data-skip-transition`: the move transition (250ms on transform, width and height)
// is dropped when the card opens from rest, moves more than 150px, or the page scrolls.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "context-card",
  component: "ContextCardTrigger",
  root: (n) => n.tag === "div" && has("inset-0")(n) && has("fixed")(n),
  ours: ".layer",
  skip: ["Default", "Alignment", "Render prop"],
  defaults: { side: "right", skip: "false" },
  // The move transition is skipped when the shell says so (`data-skip-transition` on the shell below the fader).
  derive: { skip: (n) => (n.children[0]?.children[0]?.attrs["data-skip-transition"] === "true" ? "true" : "false") },
  props: {
    side: { top: ".top", bottom: ".bottom", left: ".left" },
    skip: { true: ".skip" },
  },
  children: [
    {
      ours: ".fade",
      pick: 0,
      children: [
        {
          ours: ".card",
          pick: 0,
          children: [
            { ours: ".arrow", pick: has("w-[14px]"), children: [{ ours: "svg", pick: (c) => c.tag === "svg", leaf: true }] },
            // The portal target the content mounts into: a bare div with no rules of its own.
            {
              ours: "",
              pick: (c) => c.tag === "div" && !has("w-[14px]")(c),
              children: [{ ours: ".box", pick: has("p-3"), children: [{ ours: ".body", pick: 0 }] }],
            },
          ],
        },
      ],
    },
  ],
};
