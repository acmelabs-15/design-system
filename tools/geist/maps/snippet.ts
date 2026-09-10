// Maps acme-snippet (src/components/snippet) to Geist Snippet: the generator derives snippet.styles.ts from this.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "snippet",
  component: "Snippet",
  root: "data-geist-snippet",
  ours: ".snippet",
  defaults: { prompt: "true", dark: "false", type: "none", fill: "false", placeholder: "false" },
  // A placeholder prop of any text reads as the placeholder state (the sketch example has an empty text).
  values: { placeholder: { "*": "true" } },
  props: {
    prompt: { false: ".no-prompt" },
    dark: { true: ".dark" },
    type: { success: ".success", error: ".error", warning: ".warning" },
    fill: { true: ".fill" },
    placeholder: { true: ".placeholder" },
  },
  children: [
    { ours: "pre", pick: (c) => c.tag === "pre", all: true },
    {
      ours: ".action",
      pick: has("size-8"),
      states: { ":hover": "[data-hover]" },
      // The copy button is an acme-button in ours; the classes the snippet adds to it land on its part, its own hover stays the part's.
      children: [{ ours: "acme-button", pick: (c) => "data-geist-button" in c.attrs, extends: "button", part: "button", leaf: true, states: {} }],
    },
  ],
};
