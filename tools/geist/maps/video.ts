// Maps acme-video (src/components/video) to Geist Video: the generator derives video.styles.ts from
// this. The root is the figure (a block with the vertical margin the `margin` prop sets, centred
// text); inside it the box (centred, `--video-width` wide, capped to the container) holds the frame
// (a relative box whose bottom padding is the aspect ratio) with the video filling it. The control
// bar, its visible state and the `borderRadius` prop are client-only: sketches under
// tools/geist/sketch/video.*.json carry them, drawn from the component's client code. The bar holds
// the play/pause button (the same class string in both states; only the glyph changes), the elapsed
// time, the track (the drag area, the progress bar and the handle) and the duration.
import { type GeistMap, has, type SpecNode } from "../gen";

const controls = (n: SpecNode) => n.children[0]?.children[0]?.children.find(has("h-12"));

export const geist: GeistMap = {
  page: "video",
  component: "Video",
  root: (n) => n.tag === "figure" && n.attrs["aria-label"] === "Video player",
  ours: ".video",
  defaults: { visible: "false", borderRadius: "false" },
  // The JSX carries no visible prop: the state reads off the bar (it is opaque and lifted while the pointer moves).
  derive: { visible: (n) => (controls(n) && has("duration-200")(controls(n)!) ? "true" : "false") },
  props: {
    visible: { true: ".visible" },
    borderRadius: { true: ".round" },
  },
  children: [
    {
      ours: ".box",
      pick: has("mx-auto"),
      children: [
        {
          ours: ".frame",
          pick: has("justify-center"),
          children: [
            { ours: "video", pick: (c) => c.tag === "video" },
            {
              ours: ".controls",
              pick: has("h-12"),
              children: [
                // The button is a real control: its focus-visible ring lands as a state attribute (an Interaction controller).
                { ours: ".play", pick: (c) => c.tag === "button", states: { ":focus-visible": "[data-focus]" }, children: [{ ours: "svg", pick: (c) => c.tag === "svg" }] },
                { ours: ".current", pick: has("pl-0") },
                {
                  ours: ".track",
                  pick: has("-mt-px"),
                  children: [
                    { ours: ".scrub", pick: has("h-[18px]") },
                    { ours: "progress", pick: (c) => c.tag === "progress" },
                    // The handle scales in when its peer, the progress bar, `:has(:hover)`: a state the reference never
                    // enters (a progress element has no descendants to hover, and the bar takes no pointer events), so the rule is dropped.
                    { ours: ".handle", pick: has("size-2.5"), states: { ":has(:hover)": null } },
                  ],
                },
                { ours: ".total", pick: (c, i, all) => i === all.length - 1 },
              ],
            },
          ],
        },
      ],
    },
  ],
};
