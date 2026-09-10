// Docs page: Snippet — mirrors https://vercel.com/geist/snippet
import type { Doc } from "../../site";

const COPY_TEXT = `# About
Template for a full-featured Next.js AI chatbot

# Requirements
This template uses the Vercel AI Gateway to access multiple AI models through a unified interface. The default model is OpenAI GPT-4.1 Mini, with support for Anthropic, Google, and xAI models.`;

export const doc: Doc = {
  id: "snippet",
  title: "Snippet",
  lede: "A copyable snippet of code for the command line.",
  tags: ["acme-snippet"],
  examples: [
    {
      h: "Default",
      html: `<acme-snippet text="npm init next-app" width="300px"></acme-snippet>`,
    },
    {
      h: "Inverted",
      html: `<acme-snippet dark text="npm init next-app" width="300px"></acme-snippet>`,
    },
    {
      h: "Multi line",
      html: `<acme-snippet text='["cd project", "now"]' width="100%"></acme-snippet>`,
    },
    {
      h: "No prompt",
      html: `<acme-snippet prompt="false" text="npm init next-app" width="300px"></acme-snippet>`,
    },
    {
      h: "Callback",
      html: `<acme-snippet text="npm init next-app" width="300px"></acme-snippet>`,
      script: "root.querySelector('acme-snippet').addEventListener('acme-copy', () => alert('You copied the text!'))",
    },
    {
      h: "Variants",
      html: `<div class="vstack" style="align-items:stretch"><acme-snippet text="npm init next-app" type="success" width="300px"></acme-snippet><acme-snippet text="npm init next-app" type="error" width="300px"></acme-snippet><acme-snippet text="npm init next-app" type="warning" width="300px"></acme-snippet></div>`,
    },
    {
      h: "Controlled Copied State",
      p: "The copied attribute drives the checkmark from outside. A parent surface can copy other text, here from a context card, and reuse the snippet's feedback.",
      html: `<acme-context-card><div slot="content" class="text-copy-13-mono" style="width:384px;white-space:pre-line">${COPY_TEXT}</div><div role="button" tabindex="0" aria-label="copy content" style="cursor:pointer"><acme-snippet text="Copy install prompt" prompt="false" width="300px"></acme-snippet></div></acme-context-card>`,
      script: `const copyText = root.querySelector('[slot=content]').textContent;
const trigger = root.querySelector('[role=button]');
const snippet = root.querySelector('acme-snippet');
let timer;
const copy = () => {
  navigator.clipboard.writeText(copyText);
  snippet.copied = true;
  clearTimeout(timer);
  timer = setTimeout(() => { snippet.copied = false }, 1000);
};
trigger.addEventListener('click', copy);
trigger.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copy() } })`,
    },
  ],
  practices: {
    "Best Practices": [
      "Use Snippet for one shell command the user should copy. Use inline code for tokens (env var names, paths) and Code Block for multi-line source.",
      'Pass the command in <code>text</code> without a leading <code>$</code>. The component draws the prompt, so <code>text="$ vercel deploy"</code> shows <code>$ $ vercel deploy</code>.',
      'Set <code>prompt="false"</code> for content that is not a shell command (URLs, JSON, output copied as is) so what is shown matches what is copied.',
      "Pair <code>placeholder</code> with an empty <code>text</code> for an empty state. Sentence case, no trailing period, no <code>Please</code>: <code>Run vercel link to fetch env vars</code>. The placeholder is information, not copied.",
      "Keep one command per Snippet. Pass a JSON array to <code>text</code> for a short multi-line block; for longer scripts switch to Code Block so users read before they copy.",
      "Use <code>copied</code> with the <code>acme-copy</code> event when a parent surface (a card, a tooltip) shows the same checkmark while it copies different text.",
    ],
  },
};
