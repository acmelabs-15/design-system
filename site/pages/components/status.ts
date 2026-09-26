import type { Doc } from "../../site";
export const doc: Doc = {
  id: "status",
  title: "Status",
  lede: "An application-defined status with readable text and a decorative indicator.",
  tags: ["acme-status"],
  examples: [
    {
      h: "Application states",
      html: '<acme-v-stack align-items="start" gap="3"><acme-status value="queued" label="Queued"></acme-status><acme-status value="processing" label="Processing" variant="info" pulse></acme-status><acme-status value="ready" label="Ready" variant="success"></acme-status><acme-status value="attention" label="Needs attention" variant="warning"></acme-status><acme-status value="failed" label="Failed" variant="error"></acme-status></acme-v-stack>',
    },
    { h: "Authored label", html: '<acme-status value="available" variant="success">Available <span>for new work</span></acme-status>' },
    {
      h: "Explicit live update",
      html: '<acme-h-stack gap="3" flex-wrap="wrap"><acme-status value="waiting" label="Waiting" role="status"></acme-status><acme-button variant="secondary">Mark ready</acme-button></acme-h-stack>',
      script:
        'root.querySelector("acme-button").addEventListener("click",()=>{const status=root.querySelector("acme-status");status.value="ready";status.label="Ready to continue";status.variant="success";});',
    },
  ],
  practices: {
    Meaning: [
      "The application supplies value and maps it to label and variant. Status never infers meaning from deployment codes or capitalized text.",
      "label is the readable text; when omitted, value supplies the fallback. The default slot can provide authored label content.",
      "The indicator is decorative. Keep the status meaning in readable text; color alone is insufficient.",
    ],
    Behavior: [
      'Status is passive by default. Set role="status" or an appropriate live-region attribute only when the application needs announcements.',
      "pulse is opt-in and uses the shared Lit Motion approach. Reduced motion stops the effect, and disconnection cancels it.",
      "The component has no selection, navigation or change event. Use a real action control when the user needs to perform an operation.",
    ],
  },
};
