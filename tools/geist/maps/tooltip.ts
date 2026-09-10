// Maps the open bubble of acme-tooltip (src/components/tooltip) to Geist Tooltip's floating
// content, a client-only state drawn from the component's class strings (tools/geist/sketch/tooltip.*):
// a 13px inverted-theme box 10px from the trigger, the arrow div (its glyph an svg path) on the
// facing edge, centred or at the arrow offset from the start or end. The delay is the fade-in
// animation's own; `delay={false}` zeroes it, `lowerDelay` and a touch open take the faster one.
// A key inside the bubble is a composed acme-kbd: the bubble's rules into it cross its shadow tree
// and ship with the kbd (maps/tooltip-kbd.ts); the bubble keeps its own `:has(kbd)` row rules as an
// attribute state. The trigger and the touch backdrop have mappings of their own.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "tooltip",
  component: "Tooltip",
  root: (n) => n.attrs.role === "tooltip",
  ours: ".tip",
  skip: ["Default", "No delay", "Box align", "Custom content", "Custom type", "Components", "Other"],
  defaults: { position: "top", boxAlign: "center", delay: "true", center: "true", wrap: "true", type: "none", fill: "true", invertTheme: "true", faster: "false" },
  // The faster fade-in: `lowerDelay`, or a bubble a touch opened (the touch bit of `shown`).
  derive: { faster: (_n, p) => (p.lowerDelay === "true" || p.shown === "4" ? "true" : "false") },
  props: {
    position: { bottom: ".bottom", left: ".left", right: ".right" },
    boxAlign: { left: ".start", right: ".end" },
    delay: { false: ".nodelay" },
    faster: { true: ".faster" },
    center: { false: ".nocenter" },
    wrap: { false: ".nowrap" },
    type: { success: ".success", error: ".error", warning: ".warning", violet: ".violet" },
    fill: { false: ".nofill" },
    invertTheme: { false: ".noinvert" },
  },
  // A key among the content: the element marks the bubble when its content slot holds one.
  states: { ":has(:is(kbd))": "[data-kbd]" },
  // The inverted theme's rules on descendants that opt in (`[.invert-theme_&]:`) reach nothing of ours; its own token block is the bubble's.
  context: { ".invert-theme": "" },
  // The bubble's child rules on the key (`[&>kbd]`) reach into the composed kbd's tree: its mapping emits them.
  crossing: ["kbd"],
  children: [
    { ours: ".arrow", pick: has("z-[-1]"), children: [{ ours: "svg", pick: (c) => c.tag === "svg", children: [{ ours: "path", pick: (c) => c.tag === "path" }] }] },
    { ours: "", pick: (c) => c.tag === "kbd", leaf: true },
  ],
};
