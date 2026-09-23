import type { Doc } from "../../site";
export const doc: Doc = {
  id: "disabled-wall",
  title: "Disabled Wall",
  tags: ["acme-disabled-wall"],
  lede: "Keep content and its state while temporarily blocking interaction.",
  examples: [
    {
      h: "Unavailable content",
      html: '<acme-disabled-wall disabled reason="Editing is unavailable while this record is locked."><acme-input aria-label="Project" value="Design system"></acme-input><acme-button>Edit project</acme-button></acme-disabled-wall>',
    },
    {
      h: "Change availability",
      html: '<acme-button id="availability-toggle" variant="secondary">Disable editing</acme-button><acme-disabled-wall id="availability-region" reason="Editing is temporarily unavailable."><acme-input aria-label="Draft" value="Retained draft"></acme-input></acme-disabled-wall>',
      script:
        'const button=root.querySelector("#availability-toggle"),wall=root.querySelector("#availability-region");button.addEventListener("click",()=>{wall.disabled=!wall.disabled;button.textContent=wall.disabled?"Enable editing":"Disable editing";});',
    },
    {
      h: "Rich explanation",
      html: '<acme-disabled-wall disabled><span slot="explanation"><strong>Read-only preview.</strong> Your saved content stays in place.</span><acme-textarea aria-label="Notes" value="These notes remain available after editing is enabled."></acme-textarea></acme-disabled-wall>',
    },
  ],
  practices: {
    Behavior: [
      "The disabled content is inert. It cannot receive pointer or keyboard interaction and is absent from the accessibility tree. The explanation remains available outside it.",
      "When disabling content that contains focus, focus moves to the explanation. Enabling content does not steal focus or reset its values.",
      "Inert content is not a disabled form group. Its successful form values remain submitted. Use Fieldset when controls must be excluded from form submission.",
      "Keep the explanation noninteractive. Place actions to restore access beside Disabled Wall. Native modal dialogs escape ancestor inertness; close an open modal before disabling the region that owns it.",
    ],
  },
};
