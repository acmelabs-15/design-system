// Maps acme-progress (src/components/progress) to Geist Progress: the generator derives progress.styles.ts from this.
import { type GeistMap, has, type SpecNode } from "../gen";

export const geist: GeistMap = {
  page: "progress",
  component: "Progress",
  // The root is the relative wrapper around the native progress element.
  root: (n) => n.tag === "div" && n.children[0]?.tag === "progress",
  ours: ".progress",
  defaults: { stops: "false" },
  // Stops are a child list, not a class: a root with any reads as stops="true".
  derive: { stops: (n: SpecNode) => (n.children.length > 1 ? "true" : "false") },
  props: {
    stops: { true: ".with-stops" },
  },
  children: [
    { ours: ".bar", pick: (c) => c.tag === "progress" },
    {
      ours: ".stop",
      pick: (c) => c.tag === "div",
      all: true,
      children: [
        // The tooltip host is the trigger; its hit area is our light-DOM child inside it.
        { ours: ".trigger", pick: has("inline-flex"), children: [{ ours: ".hit", pick: has("isolate") }] },
        {
          ours: ".lines",
          pick: has("justify-center"),
          children: [
            { ours: ".line", pick: has("bg-gray-alpha-600") },
            { ours: ".line-bg", pick: has("bg-background-100") },
          ],
        },
      ],
    },
  ],
};
