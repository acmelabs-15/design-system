// Maps acme-error (src/components/error) to Geist Error: the generator derives error.styles.ts from this.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "error",
  component: ["Error", "GeistError"],
  root: "data-geist-error",
  ours: ".error",
  defaults: { size: "medium" },
  props: {
    size: { small: ".sm", large: ".lg" },
  },
  children: [
    { ours: ".icon", pick: (c) => c.attrs["aria-hidden"] === "true" },
    {
      ours: ".text",
      pick: has("break-words"),
      children: [
        { ours: ".label", pick: (c) => c.tag === "b" },
        { ours: ".action", pick: has("inline-block"), children: [{ ours: ".link", pick: (c) => c.tag === "a" }] },
      ],
    },
  ],
};
