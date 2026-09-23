import type { Doc } from "../../site";
const rows = Array.from({ length: 24 }, (_, index) => `<div style="padding:12px;border-bottom:1px solid var(--ds-gray-200)">Record ${index + 1}</div>`).join("");
export const doc: Doc = {
  id: "scroll-area",
  title: "Scroll Area",
  tags: ["acme-scroll-area", "acme-scroll-viewport", "acme-scrollbar", "acme-scroll-thumb", "acme-scroll-corner", "acme-scroll-button"],
  lede: "Custom scrollbar controls around a real native viewport.",
  examples: [
    { h: "Vertical", html: `<acme-scroll-area orientation="vertical" style="height:200px"><acme-scroll-viewport aria-label="Records">${rows}</acme-scroll-viewport></acme-scroll-area>` },
    {
      h: "Always visible",
      html: `<acme-scroll-area orientation="vertical" scrollbar-visibility="always" style="height:200px"><acme-scroll-viewport aria-label="Always visible records">${rows}</acme-scroll-viewport></acme-scroll-area>`,
    },
    {
      h: "Both axes and edge fades",
      html: '<acme-scroll-area edge-fades style="height:220px"><acme-scroll-viewport aria-label="Wide content"><div style="width:1200px;height:500px;padding:24px;background:var(--ds-gray-100)">Wide content keeps its own layout.</div></acme-scroll-viewport></acme-scroll-area>',
    },
    {
      h: "Scroll buttons",
      html: `<acme-scroll-area id="button-area" orientation="vertical" style="height:220px"><acme-scroll-viewport aria-label="Records with buttons">${rows}</acme-scroll-viewport><acme-scroll-button slot="controls" direction="block-start">Previous</acme-scroll-button><acme-scroll-button slot="controls" direction="block-end" step="80px">Next</acme-scroll-button></acme-scroll-area>`,
    },
    {
      h: "Custom controls",
      html: `<acme-scroll-area orientation="vertical" scrollbar-visibility="always" size="large" style="height:200px"><acme-scroll-viewport aria-label="Custom scrollbar records">${rows}</acme-scroll-viewport><acme-scrollbar orientation="vertical"><acme-scroll-thumb style="--acme-scroll-thumb-color:var(--ds-blue-700)"></acme-scroll-thumb></acme-scrollbar></acme-scroll-area>`,
    },
    {
      h: "Programmatic scrolling",
      html: `<acme-button id="scroll-jump" variant="secondary">Scroll down 160px</acme-button><acme-scroll-area id="programmatic-area" orientation="vertical" style="height:200px"><acme-scroll-viewport aria-label="Programmatic records">${rows}</acme-scroll-viewport></acme-scroll-area><output id="scroll-position"></output>`,
      script:
        'const area=root.querySelector("#programmatic-area");root.querySelector("#scroll-jump").addEventListener("click",()=>area.scrollBy({top:160,behavior:"smooth"}));area.updateComplete.then(async()=>{await area.querySelector("acme-scroll-viewport").updateComplete;area.getViewport().addEventListener("scroll",()=>{root.querySelector("#scroll-position").textContent=`Scroll position: ${Math.round(area.getViewport().scrollTop)}px`;});});',
    },
    {
      h: "RTL",
      html: '<acme-scroll-area dir="rtl" orientation="horizontal" scrollbar-visibility="always" style="height:120px"><acme-scroll-viewport aria-label="محتوى أفقي"><div style="width:1200px;padding:24px">يبدأ المحتوى من اليمين</div></acme-scroll-viewport></acme-scroll-area>',
    },
  ],
  practices: {
    Ownership: [
      "Supply exactly one Scroll Viewport. Bars, thumbs and the corner are supplied when omitted; an authored bar replaces the matching default. Put optional buttons in the controls slot.",
      "getViewport returns the actual HTMLElement that owns scrolling. Listen for its native scroll event. Scroll Area does not emit a change event for every pixel.",
      "Native wheel, touch and keyboard scrolling remain in the browser. Bars handle only their pointer and wheel controls. Give the viewport an accessible name when it becomes a keyboard stop.",
      "Content layout, application data and virtualization stay outside Scroll Area. TanStack Virtual can use getViewport as its getScrollElement result; the application owns the virtualizer and rendered rows.",
      "Scroll buttons use positive CSS lengths or, when step is omitted, 80% of the viewport. Native smooth scrolling respects reduced motion. Inline directions follow RTL.",
      "Hover visibility remains active while the area has keyboard focus, is dragged or has recent scrolling. Always visibility keeps overflowing bars present. Sizes change the visual bar thickness.",
    ],
  },
};
