import type { Doc } from "../../site";
export const doc: Doc = {
  id: "alert",
  title: "Alert",
  lede: "A supplied message for a section or form.",
  tags: ["acme-alert"],
  examples: [
    {
      h: "Section message",
      html: '<acme-alert heading="Deployment ready" variant="success">Your changes are available.<acme-button slot="actions" variant="secondary">View deployment</acme-button></acme-alert>',
    },
    {
      h: "Status treatments",
      html:
        '<acme-v-stack align="stretch" gap="3">' +
        ["default", "success", "error", "warning", "secondary", "violet", "cyan"]
          .map((variant) => `<acme-alert variant="${variant}" heading="${variant[0].toUpperCase() + variant.slice(1)} message">The application supplies the message and its meaning.</acme-alert>`)
          .join("") +
        "</acme-v-stack>",
    },
    {
      h: "Explicit live message",
      html: '<acme-button variant="secondary">Report a save failure</acme-button><acme-alert role="alert" variant="error"></acme-alert>',
      script: 'const alert=root.querySelector("acme-alert");root.querySelector("acme-button").addEventListener("click",()=>{alert.textContent="Save failed. Check your connection and try again.";});',
    },
    {
      h: "Application-owned dismissal",
      html: '<acme-alert dismissible heading="Maintenance reminder">Save your work before maintenance starts.</acme-alert><acme-button variant="secondary">Restore reminder</acme-button>',
      script:
        'const message=root.querySelector("acme-alert"),restore=root.querySelector("acme-button");message.addEventListener("acme-request",event=>{if(event.detail.action==="dismiss"){message.hidden=true;restore.focus();}});restore.addEventListener("click",()=>{message.hidden=false;});',
    },
    {
      h: "Authored heading",
      html: '<acme-alert><acme-heading slot="heading" as="h3">Region change</acme-heading>Changing the region restarts running functions.<a slot="actions" href="#region">Read about regions</a></acme-alert>',
    },
  ],
  practices: {
    Messages: [
      'Static messages have no automatic alert role. Set role="alert", role="status" or an appropriate aria-live setting only when the application needs a live announcement.',
      "variant supplies the status treatment. Include the meaning in readable text; do not rely on color alone. The status icon is decorative by default.",
      "Use heading for plain emphasized text. Use the heading slot with Heading when a real heading level belongs in the document.",
    ],
    Composition: [
      "start replaces the default icon. end supplies supporting content. actions contains normal application-owned buttons and links.",
      "small, medium and large sizes use shared sizing and spacing tokens. Long messages wrap, and actions remain in the authored order.",
      'dismissible adds a named close control. It emits a cancelable acme-request { action: "dismiss" }; the application owns hiding, removal, persistence and focus after removal.',
      "Use Banner for page-wide messages, Toast for brief action results and Field for validation associated with a control.",
    ],
  },
};
