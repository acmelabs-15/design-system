import type { Doc } from "../../site";

const navigation = Array.from({ length: 18 }, (_, i) => `<div style="padding:10px 16px">Section ${i + 1}</div>`).join("");
const pair = (id: string) =>
  `<acme-resizable id="${id}" sizes="[30,70]" style="height:240px"><acme-resizable-panel value="navigation" aria-label="Navigation" min-size="15" collapsible><acme-scroll-area orientation="vertical" style="height:100%"><acme-scroll-viewport aria-label="Navigation sections">${navigation}</acme-scroll-viewport></acme-scroll-area></acme-resizable-panel><acme-resize-handle></acme-resize-handle><acme-resizable-panel value="editor" aria-label="Editor" min-size="20"><div style="padding:16px"><acme-heading as="h3" size="20px">Editor</acme-heading><acme-text>Drag the separator or focus it and use the arrow keys.</acme-text><acme-input aria-label="Draft" value="Retained content"></acme-input></div></acme-resizable-panel></acme-resizable>`;
export const doc: Doc = {
  id: "resizable",
  title: "Resizable",
  tags: ["acme-resizable", "acme-resizable-panel", "acme-resize-handle"],
  lede: "Resize adjacent panes while keeping content, stable identities and complete layout preferences.",
  examples: [
    { h: "Two panes with scrolling", html: pair("resizable-basic") },
    {
      h: "Vertical",
      html: '<acme-resizable orientation="vertical" sizes="[40,60]" style="height:300px"><acme-resizable-panel value="preview" aria-label="Preview" min-size="20"><div style="padding:16px">Preview</div></acme-resizable-panel><acme-resize-handle></acme-resize-handle><acme-resizable-panel value="details" aria-label="Details" min-size="20"><div style="padding:16px">Details</div></acme-resizable-panel></acme-resizable>',
    },
    {
      h: "Three panes",
      html: '<acme-resizable sizes="[25,50,25]" style="height:200px"><acme-resizable-panel value="navigation" aria-label="Navigation" min-size="10"><div style="padding:16px">Navigation</div></acme-resizable-panel><acme-resize-handle></acme-resize-handle><acme-resizable-panel value="content" aria-label="Content" min-size="20"><div style="padding:16px">Main content</div></acme-resizable-panel><acme-resize-handle></acme-resize-handle><acme-resizable-panel value="inspector" aria-label="Inspector" min-size="10"><div style="padding:16px">Inspector</div></acme-resizable-panel></acme-resizable>',
    },
    {
      h: "Collapse and restore",
      html: `<acme-button id="collapse-pane" variant="secondary">Collapse navigation</acme-button><acme-button id="expand-pane" variant="secondary">Restore navigation</acme-button>${pair("resizable-collapse")}`,
      script:
        'const layout=root.querySelector("acme-resizable");root.querySelector("#collapse-pane").addEventListener("click",()=>layout.collapse("navigation"));root.querySelector("#expand-pane").addEventListener("click",()=>layout.expand("navigation"));',
    },
    {
      h: "Application-owned persistence",
      html: `<acme-button id="save-layout" variant="secondary">Save layout</acme-button><acme-button id="restore-layout" variant="secondary">Restore layout</acme-button>${pair("resizable-saved")}<output id="layout-result"></output>`,
      script:
        'const layout=root.querySelector("acme-resizable"),output=root.querySelector("#layout-result");root.querySelector("#save-layout").addEventListener("click",()=>{localStorage.setItem("acme-docs-resizable-layout",JSON.stringify(layout.getLayout()));output.textContent="Layout saved in this browser.";});root.querySelector("#restore-layout").addEventListener("click",()=>{try{const saved=localStorage.getItem("acme-docs-resizable-layout");if(saved){layout.setLayout(JSON.parse(saved));output.textContent="Layout restored.";}else output.textContent="Save a layout first.";}catch(error){output.textContent=error.message;}});',
    },
    {
      h: "RTL",
      html: '<acme-resizable dir="rtl" sizes="[35,65]" style="height:180px"><acme-resizable-panel value="navigation" aria-label="التنقل" min-size="15"><div style="padding:16px">التنقل</div></acme-resizable-panel><acme-resize-handle></acme-resize-handle><acme-resizable-panel value="content" aria-label="المحتوى" min-size="20"><div style="padding:16px">المحتوى</div></acme-resizable-panel></acme-resizable>',
    },
  ],
  practices: {
    Structure: [
      "Supply direct, alternating Panel and Handle elements. Each panel needs a stable, unique value. Panels retain their author-owned content and may contain nested Resizable or Scroll Area components.",
      "Sizes, minimums, maximums and keyboard steps use percentage points of pane space after handle widths are removed. They are not spacing tokens or pixel lengths.",
      "Each handle changes its adjacent pair. Other panes stay fixed. The handle names and controls the preceding primary pane; use a meaningful pane label or an explicit handle label.",
      "Arrow keys follow the physical handle direction, including RTL. Shift uses largeKeyboardStep. Home and End reach allowed limits. Enter and double-click toggle a collapsible primary pane.",
      "Collapse retains content but makes it inert and hidden. Reopening restores the saved open share, clamped to current limits. Focus moves to a usable handle or the layout when collapse would strand it.",
      "Programmatic changes stay silent. acme-input reports live sizes and acme-change reports the complete committed layout. Cancellation retains live edits without a completion event.",
      "Applications own persistence. Save getLayout and restore with setLayout after the composition mounts. Listen to the intended root when layouts are nested. The component itself does not write browser storage.",
      "Changing orientation preserves keyed shares. Reordering panels preserves their identities. Impossible constraints report a diagnostic and disable resizing until corrected.",
    ],
  },
};
