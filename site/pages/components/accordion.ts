import type { Doc } from "../../site";

const item = (value: string, label: string, content: string) =>
  `<acme-accordion-item value="${value}"><h3><acme-accordion-trigger>${label}</acme-accordion-trigger></h3><acme-accordion-content>${content}</acme-accordion-content></acme-accordion-item>`;
const content = item("delivery", "Delivery", "Delivery takes three business days.") + item("returns", "Returns", "Return unused items within thirty days.");
export const doc: Doc = {
  id: "accordion",
  title: "Accordion",
  lede: "Related sections with independent headings and shared expansion rules.",
  tags: ["acme-accordion", "acme-accordion-item", "acme-accordion-trigger", "acme-accordion-content"],
  examples: [
    { h: "One section", html: `<acme-accordion>${content}</acme-accordion>` },
    { h: "Multiple sections", html: `<acme-accordion multiple>${content}</acme-accordion>` },
    { h: "Allow all sections to close", html: `<acme-accordion collapsible>${content}</acme-accordion>` },
    { h: "Initially expanded", html: `<acme-accordion>${content}</acme-accordion>`, script: 'root.querySelector("acme-accordion").expanded=["delivery"];' },
    {
      h: "Mount on demand",
      html: `<acme-accordion collapsible lazy-mount unmount-on-exit>${item("details", "Editable details", '<template><label>Note <input value="Initial note"></label></template>')}</acme-accordion>`,
    },
  ],
  practices: {
    Behavior: [
      "Give every item a unique, nonempty value. Set expanded to an array of item values. Programmatic writes do not emit events; user changes emit acme-expanded-change with the current array.",
      "Choose a native heading level that fits the page and place the trigger inside it. Arrow keys and Home/End move between enabled triggers. Enter and Space change expansion.",
      "Ordinary children stay mounted while hidden and inert. Use one inert template or renderContent for lazyMount and unmountOnExit. Unmounting removes form state; use the default mounting policy to retain it.",
      "The content owns its height and opacity animation. Closing a section first returns focus to its trigger, or to its named section if the trigger is disabled.",
    ],
  },
};
