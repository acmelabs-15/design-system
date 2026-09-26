import { readFileSync } from "node:fs";
import type { Doc } from "../../site";

const source = (file: string) => ({language: "typescript" as const,registerFunction:"registerTableExamples",entryPath: "examples/table/docs-entry.ts",sourcePath: "examples/table/"+file,code:readFileSync(new URL("../../../examples/table/"+file,import.meta.url),"utf8"),sourceFiles:["examples/table/docs-entry.ts","examples/table/definitions.ts","examples/table/data.ts","examples/table/review-feature.ts","examples/table/grid-interaction.ts","examples/table/virtual-layout.ts"]});

const rows =
  '<tr><th scope="row">Order created</th><td><acme-status value="delivered" variant="success">Delivered</acme-status></td><td>12</td></tr><tr><th scope="row">Invoice updated</th><td><acme-status value="retrying" variant="warning">Retrying</acme-status></td><td>3</td></tr>';
const table = `<table><caption>Webhook deliveries</caption><thead><tr><th scope="col">Event</th><th scope="col">Status</th><th scope="col">Attempts</th></tr></thead><tbody>${rows}</tbody></table>`;
export const doc: Doc = {
  id: "table",
  title: "Table",
  lede: "A styled native table with application-owned content, interactions and data.",
  tags: ["acme-table"],
  examples: [
    {
      h: "TanStack Table in Lit",
      ...source("lit.ts"),
      p: "The application owns sorting, grouping, selection, column state and result pagination. Arrow keys move between cells; Enter opens a cell action and F2 enters its editor.",
      html: '<docs-table-lit style="display:block"></docs-table-lit>',
    },
    { h: "TanStack Table in React", ...source("react.ts"), p: "React renders and retains its own cells inside the same Table component.", html: '<docs-table-react style="display:block"></docs-table-react>' },
    {
      h: "TanStack Virtual",
      ...source("virtual-lit.ts"),
      p: "This consumer uses TanStack Virtual for both axes. Horizontal mode demonstrates native merged cells. Vertical and combined modes demonstrate independently measured rows and expanded content.",
      html: '<acme-h-stack flex-wrap="wrap"><acme-button data-mode="vertical" variant="secondary">Virtual rows</acme-button><acme-button data-mode="horizontal" variant="secondary">Virtual columns</acme-button><acme-button data-mode="both" variant="secondary">Both axes</acme-button></acme-h-stack><docs-table-virtual style="display:block"></docs-table-virtual>',
      script: 'root.querySelectorAll("[data-mode]").forEach(button=>button.addEventListener("click",()=>root.querySelector("docs-table-virtual").setMode(button.dataset.mode)));',
    },
    { h: "Native content", html: `<acme-table aria-label="Webhook deliveries">${table}</acme-table>` },
    { h: "Striped and bordered", html: `<acme-v-stack><acme-table variant="striped">${table}</acme-table><acme-table variant="bordered">${table}</acme-table></acme-v-stack>` },
    { h: "Compact density", html: `<acme-theme density="compact"><acme-table>${table}</acme-table></acme-theme>` },
    {
      h: "Application actions",
      html: '<acme-table><table><caption>Delivery actions</caption><thead><tr><th scope="col">Event</th><th scope="col">Action</th></tr></thead><tbody><tr><th scope="row">Invoice updated</th><td><acme-button data-retry size="small">Retry delivery</acme-button></td></tr></tbody></table></acme-table><output aria-live="polite"></output>',
      script: 'root.querySelector("[data-retry]").addEventListener("click",()=>root.querySelector("output").textContent="Retry requested by the application");',
    },
    {
      h: "Grouped headers and spans",
      html: '<acme-table variant="bordered"><table><caption>Delivery summary</caption><thead><tr><th colspan="2" scope="colgroup">Delivery</th><th rowspan="2" scope="col">Attempts</th></tr><tr><th scope="col">Event</th><th scope="col">Endpoint</th></tr></thead><tbody><tr><th scope="row">Order created</th><td>/orders</td><td>1</td></tr><tr><td colspan="3">Application-owned expanded details</td></tr></tbody><tfoot><tr><th colspan="2" scope="row">Total attempts</th><td>1</td></tr></tfoot></table></acme-table>',
    },
    {
      h: "Sticky header and column",
      html: `<acme-table sticky-header aria-label="Scrollable deliveries" style="height:240px"><table style="min-width:800px;table-layout:fixed"><caption>Scrollable delivery history</caption><thead><tr><th scope="col" data-pinned="start" style="width:180px">Event</th><th scope="col">Endpoint</th><th scope="col">Attempts</th></tr></thead><tbody>${Array.from({ length: 20 }, (_, i) => `<tr><th scope="row" data-pinned="start">Delivery ${i + 1}</th><td>/events/${i + 1}</td><td>1</td></tr>`).join("")}</tbody></table></acme-table>`,
    },
  ],
  practices: {
    Content: [
      "Supply one native table with its caption, sections, rows and cells. Lit or React retains ownership of those nodes.",
      "getTableElement() returns that table. getScrollElement() returns the stable native viewport for application scrolling and virtualization.",
      "Use native span attributes, aria-sort, headers, scope, row/column counts and indices where appropriate. Sorting and interactive grid keyboard behavior belong to the application.",
    ],
    Styling: [
      "variant is default, striped or bordered. size is small, medium or large. Theme density controls the dedicated Table padding tokens.",
      "Native cells can use data-pinned=start/end with logical sticky offset CSS properties. Pinned rows use data-pinned=top/bottom.",
      "Use aria-selected for selected row/cell presentation, data-range-start/end/top/bottom for range borders and data-acme-table-part=spacer with --acme-table-spacer-height for virtual spacers.",
      "No custom row or cell wrapper is needed. Generated light-DOM styles are installed in the table host’s actual document or shadow root.",
    ],
    Ownership: [
      "The application creates its TanStack Table and TanStack Virtual instances, renders their final row/column models and retains refs for measurement and focus.",
      "loading changes aria-busy only. Supply application-owned loading, empty, error and recovery content.",
    ],
  },
};
