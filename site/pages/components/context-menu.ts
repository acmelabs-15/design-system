import type { Doc } from "../../site";

const content =
  '<acme-menu-content slot="content" aria-label="Document actions"><acme-menu-item value="copy">Copy</acme-menu-item><acme-menu-item value="rename">Rename</acme-menu-item><acme-menu-item value="remove" disabled>Remove</acme-menu-item></acme-menu-content>';
export const doc: Doc = {
  id: "context-menu",
  title: "Context Menu",
  lede: "The Menu family opened from a contextual gesture.",
  tags: ["acme-context-menu"],
  examples: [
    {
      h: "Default",
      html: `<acme-context-menu><acme-box padding="6" border-width="1px">Right-click, hold a touch, or focus here and press Shift+F10.</acme-box>${content}</acme-context-menu><output></output>`,
      script: "root.addEventListener('acme-request',event=>{if(event.detail.action==='select')root.querySelector('output').textContent=event.detail.value;});",
    },
    { h: "Disabled", html: `<acme-context-menu disabled><acme-box padding="6">The browser context menu remains available.</acme-box>${content}</acme-context-menu>` },
  ],
  practices: {
    Behavior: [
      "The default slot is the trigger region. The content slot contains Menu Content.",
      "Native contextmenu, ContextMenu and Shift+F10 open the menu. A held touch opens after 700ms; movement, release, cancellation, scrolling or removal cancels a pending hold.",
      "The application supplies all actions. Context Menu does not insert link, clipboard or business actions.",
    ],
    Accessibility: ["The trigger region is keyboard focusable. Name Menu Content and retain a visible or otherwise accessible route to essential actions."],
  },
};
