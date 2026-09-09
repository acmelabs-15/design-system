// Docs page: Spinner — mirrors https://vercel.com/geist/spinner
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "spinner",
  title: "Spinner",
  lede: "Indicate an action running in response to something the user did.",
  tags: ["acme-spinner"],
  examples: [
    {
      h: "Sizes",
      html: `<div class="row" style="gap:24px;align-items:flex-end"><acme-spinner size="small"></acme-spinner><acme-spinner></acme-spinner><acme-spinner size="large"></acme-spinner></div>`,
    },
    {
      h: "Colors",
      html: `<div class="row" style="gap:24px"><acme-spinner></acme-spinner><acme-spinner color="var(--warn)"></acme-spinner><acme-spinner color="var(--success)"></acme-spinner></div>`,
    },
  ],
  practices: {
    "When to use": ["Indeterminate single-action waits of one to three seconds: submit buttons, an inline refresh, a row-level retry. For buttons, the Button loading state."],
    Behavior: ["Mount only when the action starts; pair waits over a second with copy naming the work; aria-busy on the wrapper."],
  },
};
