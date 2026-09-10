// Docs page: Progress — mirrors https://vercel.com/geist/progress
import type { Doc } from "../../site";

const col = (inner: string, extra = "") => `<div class="vstack" style="gap:24px${extra}">${inner}</div>`;

export const doc: Doc = {
  id: "progress",
  title: "Progress",
  lede: "A bar that shows how far a task has come, or how much of a limit is used.",
  tags: ["acme-progress"],
  examples: [
    { h: "Default", html: `<acme-progress value="30"></acme-progress>` },
    { h: "Custom max", html: `<acme-progress max="40" value="30"></acme-progress>` },
    {
      h: "Dynamic colors",
      html: col(
        `<acme-progress value="0" colors='{"0":"var(--acme-foreground)","25":"var(--acme-error)","50":"var(--acme-warning)","75":"var(--acme-highlight-pink)","100":"var(--acme-success)"}'></acme-progress><div class="row" style="gap:16px;align-items:stretch"><acme-button size="small" variant="primary">Increase</acme-button><acme-button size="small">Decrease</acme-button></div>`,
        ";align-items:flex-start",
      ),
      script: `const bar = root.querySelector("acme-progress");
const [inc, dec] = root.querySelectorAll("acme-button");
inc.addEventListener("click", () => { if (bar.value < 100) bar.value += 10; });
dec.addEventListener("click", () => { if (bar.value > 0) bar.value -= 10; });`,
    },
    {
      h: "Themed",
      html: col(
        `<acme-progress type="success" value="100"></acme-progress><acme-progress type="error" value="10"></acme-progress><acme-progress type="warning" value="40"></acme-progress><acme-progress type="secondary" value="70"></acme-progress>`,
      ),
    },
    {
      h: "With Stops",
      html: `<acme-progress value="30" type="success" stops='[{"value":10,"tooltip":"10%"},{"value":20,"tooltip":"20%"},{"value":30,"tooltip":"30%"},{"value":40,"tooltip":"40%"},{"value":50,"tooltip":"50%"},{"value":60,"tooltip":"60%"},{"value":70,"tooltip":"70%"},{"value":80,"tooltip":"80%"},{"value":90,"tooltip":"90%"},{"value":95,"tooltip":"95%"}]'></acme-progress>`,
    },
    {
      h: "Widths",
      html: col(
        `<acme-progress value="60" width="100"></acme-progress><acme-progress value="60" width="200"></acme-progress><acme-progress value="60" width="300"></acme-progress><acme-progress value="60" width="50%"></acme-progress><acme-progress value="60" width="100%"></acme-progress>`,
      ),
    },
    {
      h: "Heights",
      html: col(
        `<acme-progress value="60" height="4"></acme-progress><acme-progress value="60" height="10"></acme-progress><acme-progress value="60" height="50"></acme-progress><acme-progress value="60" height="200"></acme-progress>`,
      ),
    },
  ],
  practices: {
    "When to use": [
      "Determinate work with a known total: file uploads, multi-step setup, build steps, batch deletions.",
      "A short wait with no known end (one to three seconds) is a Spinner; inline copy such as <code>Saving</code> uses Loading Dots.",
      "Usage against a quota or a ratio is a Gauge. The circle reads as health; the bar reads as progress.",
    ],
    Behavior: [
      '<code>max</code> is the real ceiling (<code>max="12"</code> for twelve files), not a hard-coded 100. The bar shows <code>value / max</code>.',
      "Threshold colours in <code>colors</code> use the same breakpoints as the rest of the product, so the bar turns amber where the quota note fires.",
      "Stops mark real stages, with the stage named next to the bar (<code>Step 2 of 4 · Building</code>). A stop with no label is noise.",
    ],
    Content: [
      "Text beside the bar names the work and the units: <code>Uploading 12 of 30 files</code>, <code>Building · 1.2 GB / 4 GB</code>. The bar alone says nothing about what is progressing.",
      "When the bar fills, switch to a completion state (toast, success row, redirect) instead of appending <code>successfully</code> or <code>complete</code>.",
      "A long operation names the work in the surrounding copy (<code>Building deployment…</code>) rather than showing a bare percentage.",
    ],
    Accessibility: [
      'The element sets <code>role="progressbar"</code> with <code>aria-valuemin</code>, <code>aria-valuemax</code> and <code>aria-valuenow</code>. Give it a name with <code>aria-label</code>, or tie a sibling label with <code>aria-labelledby</code>.',
      "Update <code>value</code> about once a second during a fast upload so screen readers do not announce every increment.",
      "Each stop takes its own <code>ariaLabel</code> (<code>Build complete</code>, <code>Tests complete</code>), so the bar can be read without sight.",
    ],
  },
};
