// Docs page: Scroller — mirrors https://vercel.com/geist/scroller
import type { Doc } from "../../site";

// The reference's placeholder blocks: gray-1000 boxes of 256, 384, or 384 by 240.
const box = (w: number, h: number, extra = "") => `<div style="background:var(--ds-gray-1000);width:${w}px;height:${h}px${extra}"></div>`;
const boxes = (n: number, w: number, h: number, extra = "") => box(w, h, extra).repeat(n);
/** The children container's gap (the `content` part) for the examples with buttons. */
const gap = `<style>.gap-4::part(content){gap:16px}</style>`;
/** Scrolls the viewport, then tells the element the way a wheel would. */
const scrolled = (to: string) => `const el = root.querySelector('acme-scroller');
el.updateComplete.then(() => {
  const c = el.container;
  ${to}
  c.dispatchEvent(new Event('scroll'));
});`;

const vertical = `<acme-scroller height="220" overflow="y" width="100%"><div style="display:flex;flex-direction:column;align-items:stretch;justify-content:flex-start;gap:16px;flex:0 1 auto;width:400px">${boxes(2, 256, 256)}</div></acme-scroller>`;
const horizontal = `<acme-scroller height="100%" overflow="x" width="100%"><div style="display:flex;flex-direction:row;align-items:stretch;justify-content:flex-start;gap:16px;flex:0 1 auto;min-width:120%">${boxes(4, 256, 256)}</div></acme-scroller>`;
const free = `<acme-scroller height="220" overflow="both" width="100%"><div style="display:grid;grid-auto-flow:column;grid-template-rows:repeat(2,minmax(0,1fr));gap:16px">${boxes(6, 384, 384)}</div></acme-scroller>`;

export const doc: Doc = {
  id: "scroller",
  title: "Scroller",
  lede: "Display an overflowing list of items.",
  tags: ["acme-scroller"],
  examples: [
    { h: "Vertical", html: vertical },
    { h: "Horizontal", html: horizontal },
    { h: "Free", html: free },
    {
      h: "Vertical with buttons",
      p: "Buttons will automatically scroll to a given <strong>direct</strong> child.",
      html: `${gap}<div style="display:flex;max-width:max-content;flex-direction:column;gap:16px"><acme-scroller class="gap-4" height="220" overflow="y" with-buttons>${boxes(4, 384, 240)}</acme-scroller></div>`,
    },
    {
      h: "Horizontal with buttons",
      p: "Buttons will automatically scroll to a given <strong>direct</strong> child.",
      html: `${gap}<div style="display:flex;flex-direction:column;gap:16px"><acme-scroller class="gap-4" height="100%" overflow="x" width="100%" with-buttons>${boxes(4, 384, 256, ";flex-shrink:0")}</acme-scroller></div>`,
    },
    {
      h: "Vertical scrolled to the end", census: true,
      p: "The fade follows the scroll position: at the end only the top edge fades.",
      html: vertical,
      script: scrolled("c.scrollTop = c.scrollHeight;"),
    },
    {
      h: "Horizontal scrolled to the end", census: true,
      p: "At the end of a row only the left edge fades.",
      html: horizontal,
      script: scrolled("c.scrollLeft = c.scrollWidth;"),
    },
    {
      h: "Free scrolled", census: true,
      p: "In the middle of a grid all four edges fade.",
      html: free,
      script: scrolled("c.scrollTop = 100;\n  c.scrollLeft = 100;"),
    },
    {
      h: "Mobile grid", census: true,
      p: "<code>mobile-grid</code> lays the children out in two equal columns on viewports between 470 and 670px.",
      html: `<acme-scroller height="220" mobile-grid width="100%">${boxes(4, 256, 256)}</acme-scroller>`,
    },
  ],
  practices: {
    "When to use": [
      "Scroller holds an overflowing list of peer items along one axis: chip rows, log streams, code snippets, command palettes.",
      "<code>y</code> for stacked feeds, <code>x</code> for chip and tile rails, <code>both</code> only when the content really scrolls both ways (logs with very long lines).",
      "A paginated or virtualized data set past a few hundred items renders through a virtualization library inside the Scroller, not as every node in the DOM.",
    ],
    Behavior: [
      "The buttons target direct children only. Items wrapped in extra layout nodes are invisible to them.",
      "The clipped axis shows an edge fade so the user sees there is more content past the viewport.",
      "Item widths and gaps stay consistent in a horizontal scroller. Ragged edges break the rhythm and make the rail look broken.",
    ],
    Accessibility: [
      "Tab order follows DOM order, so items sit in reading order whatever the visual scroll direction.",
      "The buttons carry an <code>aria-label</code> that names the direction and the content (<code>Scroll customer logos left</code>), not a bare <code>Previous</code> / <code>Next</code>.",
      "Focusing an off-screen item scrolls it into view. The browser does this by default; a custom focus trap can break it.",
    ],
  },
};
