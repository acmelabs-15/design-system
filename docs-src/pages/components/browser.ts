// Docs page: Browser — mirrors https://vercel.com/geist/browser
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "browser",
  title: "Browser",
  lede: "A realistic browser frame around a website screenshot or any other content.",
  tags: ["acme-browser"],
  examples: [
    {
      h: "Composition",
      html: `<div style="max-width:896px"><acme-browser address="https://www.vercel.com"><div style="padding:24px"></div></acme-browser></div>`,
    },
  ],
  practices: {
    "When to use": [
      "Marketing chrome around screenshots, demos and recordings on landing pages, docs and changelog posts.",
      "Do not put real product UI inside the frame; the chrome says screenshot, not live surface.",
      "When the canned shape does not fit, compose from the parts (dots, controls, the address bar); do not fork the chrome.",
    ],
    Behavior: [
      "The chrome takes the page theme: light chrome on light pages, dark chrome on dark, so the frame does not fight the page.",
      "For a long URL, use Middle Truncate inside the address bar so the host and the end of the path both stay visible.",
      "Lock the aspect ratio of the inner image so the chrome does not reflow while the image is missing or slow.",
    ],
    Accessibility: [
      'The chrome is decorative: set aria-hidden="true" on the element; the meaning lives on the inner image or video.',
      'Give the screenshot alt text that says what the user sees, not "browser screenshot".',
      "No focusable dots or back and forward buttons; the chrome is a frame, and controls that go nowhere confuse keyboard users.",
    ],
  },
};
