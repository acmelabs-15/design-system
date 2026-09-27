import type { Doc } from "../../site";

const submit =
  'const form=root.querySelector("acme-feedback");form.addEventListener("acme-request",event=>{if(event.detail.action!=="submit")return;event.preventDefault();root.querySelector("output").textContent="Recorded locally: "+event.detail.value.message;form.reset();});';
export const doc: Doc = {
  id: "feedback",
  title: "Feedback",
  lede: "A composed form for a rating, written message and optional contact information. Your application sends the data.",
  tags: ["acme-feedback"],
  examples: [
    {
      h: "Inline",
      p: "This example records the submitted message locally. It does not send a network request.",
      html: '<acme-feedback></acme-feedback><output aria-live="polite"></output>',
      script: submit,
    },
    {
      h: "Email and topics",
      html: `<acme-feedback collect-email topics='[{"value":"documentation","label":"Documentation"},{"value":"product","label":"Product"}]'></acme-feedback><output aria-live="polite"></output>`,
      script: submit,
    },
    {
      h: "Failure and retry",
      p: "The application supplies the pending and failure states. The draft stays available after a failure.",
      html: '<acme-feedback></acme-feedback><output aria-live="polite"></output>',
      script:
        'const form=root.querySelector("acme-feedback");let attempts=0;form.addEventListener("acme-request",event=>{if(event.detail.action!=="submit")return;form.error="";form.submitting=true;queueMicrotask(()=>{form.submitting=false;if(attempts++===0)form.error="Could not send feedback. Try again.";else{root.querySelector("output").textContent="Feedback received";form.reset();}});});',
    },
    {
      h: "Toggle Tip composition",
      p: "Toggle Tip owns opening, placement, dismissal and focus. Feedback owns only the form.",
      html: '<acme-toggle-tip><span slot="trigger">Give feedback</span><acme-feedback></acme-feedback><output aria-live="polite"></output></acme-toggle-tip>',
      script: submit,
    },
    {
      h: "Dialog composition",
      html: '<acme-dialog><acme-dialog-trigger slot="trigger">Open feedback dialog</acme-dialog-trigger><acme-heading slot="heading" as="h2">Product feedback</acme-heading><acme-feedback></acme-feedback><output aria-live="polite"></output></acme-dialog>',
      script: submit,
    },
    {
      h: "Custom content and actions",
      p: "A custom action can call requestSubmit(). Reset restores the value supplied at the first render.",
      html: '<acme-feedback value=\'{"message":"Feedback about the search page"}\'><acme-heading slot="heading" as="h3">How can search improve?</acme-heading><p slot="description">Include the search terms you used.</p><acme-button slot="actions" data-reset variant="secondary">Reset draft</acme-button><acme-button slot="actions" data-send>Send search feedback</acme-button></acme-feedback><output aria-live="polite"></output>',
      script: submit + 'root.querySelector("[data-reset]").addEventListener("click",()=>form.reset());root.querySelector("[data-send]").addEventListener("click",()=>form.requestSubmit());',
    },
  ],
  practices: {
    Data: [
      "value contains message and optional rating, email and topic strings. The form owns an immutable current snapshot.",
      "Ratings use very-dissatisfied, dissatisfied, satisfied and very-satisfied. The message is required by default. Email and topic are optional.",
      "Only displayed email and topic fields are included in the submit request. Hidden optional values remain in the draft.",
    ],
    Submission: [
      'Listen for acme-request with action="submit". Your application sends the request and sets submitting and error.',
      "An accepted request blocks repeated submission until submitting returns to false, an error is supplied, the value changes or reset() is called. Prevent the request when the application declines it.",
      "acme-input reports live edits. acme-change reports committed edits. Both carry the complete value. Public value assignments are silent.",
    ],
    Composition: [
      "Use Feedback inline, in Toggle Tip or in Dialog. Each overlay retains its own keyboard, focus and motion behavior.",
      "Heading, description and actions can be supplied as authored content. Keep visible field labels and a clear submit action.",
      "Use configureMessages for translated labels and prompts. Browser-native validation follows the browser locale.",
    ],
  },
};
