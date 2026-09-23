import type { Doc } from "../../site";
export const doc: Doc = {
  id: "collapsible",
  title: "Collapsible",
  lede: "One expandable section with an explicit trigger and content.",
  tags: ["acme-collapsible", "acme-collapsible-trigger", "acme-collapsible-content"],
  examples: [
    {
      h: "Details",
      html: "<acme-collapsible><acme-collapsible-trigger>Delivery details</acme-collapsible-trigger><acme-collapsible-content>Orders ship within two business days.</acme-collapsible-content></acme-collapsible>",
    },
    {
      h: "Retained input",
      html: '<acme-collapsible expanded><acme-collapsible-trigger>Notes</acme-collapsible-trigger><acme-collapsible-content><label>Note <input value="Keep this note"></label></acme-collapsible-content></acme-collapsible>',
    },
    {
      h: "Unmount after exit",
      html: '<acme-collapsible lazy-mount unmount-on-exit><acme-collapsible-trigger>Temporary details</acme-collapsible-trigger><acme-collapsible-content><template><label>Draft <input value="New draft"></label></template></acme-collapsible-content></acme-collapsible>',
    },
  ],
  practices: {
    Behavior: [
      "Set expanded to control visibility. User activation emits acme-expanded-change; programmatic changes stay silent.",
      "Content remains mounted by default. Use an inert template or renderContent with lazyMount or unmountOnExit when a real content lifetime is needed.",
      "Use Accordion to coordinate several related sections. A collapsed summary can be composed beside the trigger.",
    ],
  },
};
