// Maps acme-phone (src/components/phone) to Geist Phone: the generator derives phone.styles.ts from
// this. The frame (black, or gray-100 in the light variant, with a 2px outline, rounded by container
// width) holds the screen (a 9:19.5 box with the slotted content on a gray canvas and, with an
// address, a dark gradient at its foot), the island at the top (notch, on by default), the home
// indicator at the bottom, the navigation bar with an address (back key, address pill, more key)
// and the four side keys (mute, volume up, volume down on the left; power on the right).
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "phone",
  component: "Phone",
  root: (n) => n.tag === "div" && has("rounded-[52px]")(n),
  ours: ".frame",
  defaults: { variant: "dark" },
  props: { variant: { light: ".light" } },
  children: [
    {
      ours: ".screen",
      pick: has("aspect-[9/19.5]"),
      children: [
        { ours: ".content", pick: has("inset-0") },
        { ours: ".shade", pick: has("bg-gradient-to-b") },
      ],
    },
    { ours: ".island", pick: has("top-[2.5%]") },
    { ours: ".home", pick: has("h-[0.6%]") },
    {
      ours: ".bar",
      pick: has("justify-between"),
      children: [
        { ours: ".back", pick: (c, i) => i === 0, children: [{ ours: ".icon", pick: (c) => c.tag === "svg" }] },
        { ours: ".address", pick: has("flex-1"), children: [{ ours: ".text", pick: has("truncate") }] },
        { ours: ".more", pick: (c, i) => i === 2, children: [{ ours: ".icon", pick: (c) => c.tag === "svg" }] },
      ],
    },
    { ours: ".mute", pick: has("top-[15%]") },
    { ours: ".vol-up", pick: has("top-[23.4%]") },
    { ours: ".vol-down", pick: has("top-[32.4%]") },
    { ours: ".power", pick: has("-right-1") },
  ],
};
