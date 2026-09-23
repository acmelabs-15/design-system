import type { Doc } from "../../site";
const items =
  '<acme-split-button-item slot="items" value="save-copy">Save a copy</acme-split-button-item><acme-split-button-item slot="items" value="export">Export<span slot="description">Download the current document.</span></acme-split-button-item>';
export const doc: Doc = {
  id: "split-button",
  title: "Split Button",
  lede: "A primary action attached to a menu of related actions.",
  tags: ["acme-split-button", "acme-split-button-item"],
  examples: [
    {
      h: "Default",
      html: `<acme-split-button menu-label="More save actions">Save${items}</acme-split-button><output></output>`,
      script: "root.addEventListener('acme-request',event=>{if(event.detail.action==='primary'||event.detail.action==='select')root.querySelector('output').textContent=event.detail.value||'Save';});",
    },
    {
      h: "Presentation",
      html: `<acme-h-stack gap="4"><acme-split-button size="small" variant="secondary" menu-label="More save actions">Save${items}</acme-split-button><acme-split-button size="large" variant="tertiary" menu-label="More save actions">Save${items}</acme-split-button></acme-h-stack>`,
    },
    {
      h: "Loading and disabled",
      html: `<acme-h-stack gap="4"><acme-split-button loading menu-label="More save actions">Save${items}</acme-split-button><acme-split-button disabled menu-label="More save actions">Save${items}</acme-split-button></acme-h-stack>`,
    },
  ],
  practices: {
    Behavior: [
      "The primary action emits acme-request with action primary. A secondary action emits action select and its value.",
      "Each secondary item uses Menu Item semantics. Menu owns placement, navigation, dismissal and transition completion.",
      "Use a required menu-label to describe the secondary actions. Loading and disabled suppress both action targets.",
    ],
  },
};
