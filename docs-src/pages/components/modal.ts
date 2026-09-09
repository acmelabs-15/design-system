// Docs page: Modal — mirrors https://vercel.com/geist/modal
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "modal",
  title: "Modal",
  lede: "Display popup content that requires attention or provides additional information.",
  tags: ["acme-modal", "acme-modal-inset"],
  examples: [
    {
      h: "Default",
      p: "Shown static. Without static the modal opens with showModal() on open.",
      html: `<acme-modal static heading="Create Token"><p slot="subtitle">Enter a unique name for your token to differentiate it from other tokens and then select the scope.</p><p>Some content contained within the modal.</p><acme-button slot="actions">Cancel</acme-button><acme-button slot="actions" variant="primary">Submit</acme-button></acme-modal>`,
    },
    {
      h: "Inset",
      html: `<acme-modal static heading="Modal"><p slot="subtitle">This is a modal.</p><acme-modal-inset><p>Content within the inset.</p></acme-modal-inset><p style="margin-top:20px">Content outside the inset.</p><acme-button slot="actions">Cancel</acme-button><acme-button slot="actions" variant="primary">Submit</acme-button></acme-modal>`,
    },
    {
      h: "Single button",
      html: `<acme-modal static heading="Token Created"><p slot="subtitle">Copy the token now. It is shown once.</p><acme-snippet text="vcp_9WjH8QFQySx7…" prompt="false"></acme-snippet><acme-button slot="actions" variant="primary">Done</acme-button></acme-modal>`,
    },
    {
      h: "Live",
      p: "Open it from a button; Escape and the backdrop close it.",
      html: `<acme-button onclick="this.nextElementSibling.open = true">Open Modal</acme-button><acme-modal heading="Create Token"><p slot="subtitle">Enter a unique name for your token.</p><acme-input label="Name" placeholder="CI token"></acme-input><acme-button slot="actions" onclick="this.closest('acme-modal').open = false">Cancel</acme-button><acme-button slot="actions" variant="primary" onclick="this.closest('acme-modal').open = false">Submit</acme-button></acme-modal>`,
    },
  ],
  practices: {
    "When to use": ["A decision that must block the page. Sheet for persistent context on desktop, Drawer on mobile. Destructive confirmations belong in a Modal."],
    Behavior: ["Focus trapped; default focus on Cancel for a destructive modal; Escape and outside click dismiss non-destructive ones; return focus to the trigger."],
    Content: ["Title Case statement, never a question; body 1–3 sentences with the consequence first; primary Verb + Noun matching the title; Cancel stays Cancel; acknowledgment modals use Done."],
  },
};
