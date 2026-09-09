// Docs page: Error — mirrors https://vercel.com/geist/error
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "error",
  title: "Error",
  lede: "Clear, useful, friendly error copy that unblocks the reader.",
  tags: ["acme-error"],
  examples: [
    {
      h: "Default",
      html: `<acme-error>This email address is already in use.</acme-error>`,
    },
    {
      h: "Custom label",
      html: `<acme-error label="Email Error">This email address is already in use.</acme-error>`,
    },
    {
      h: "Sizes",
      html: `<div class="vstack"><acme-error size="small">This email is in use.</acme-error><acme-error>This email is in use.</acme-error><acme-error size="large">This email is in use.</acme-error></div>`,
    },
    {
      h: "With an action",
      html: `<acme-error>The request failed. <a href="#">Contact Us <svg class="ic" aria-hidden="true"><use href="#i-arrow"/></svg></a></acme-error>`,
    },
  ],
  practices: {
    Content: [
      "State what happened, then what to do next; no apology, no humor.",
      "Couldn't or Can't for user-state errors, Failed to for system errors; Unable to and Something went wrong are banned.",
      "Pair a system error with a stable ID in monospace under a collapsed details.",
    ],
    Accessibility: ["The element is aria-live polite; use a Note with role alert only for a blocking error."],
  },
};
