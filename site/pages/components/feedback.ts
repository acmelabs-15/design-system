// Docs page: Feedback — mirrors https://vercel.com/geist/feedback
import type { Doc } from "../../site";

const centered = (inner: string) => `<div class="row" style="justify-content:center;align-items:flex-start;min-height:300px">${inner}</div>`;
/** Sends the form as soon as the element has rendered (a dry run thanks at once; otherwise the checks answer). */
const send = `const el = root.querySelector('acme-feedback');
el.updateComplete.then(() => el.shadowRoot.querySelector('form').requestSubmit());`;
/** Picks the last face, which opens the inline card. */
const pick = `const el = root.querySelector('acme-feedback');
el.updateComplete.then(() => el.shadowRoot.querySelectorAll('.emoji')[3].click());`;

export const doc: Doc = {
  id: "feedback",
  title: "Feedback",
  lede: "Collects written feedback together with an emotion.",
  tags: ["acme-feedback"],
  examples: [
    {
      h: "Default",
      p: "For desktop only.",
      html: centered(`<acme-feedback label="vercel" dry-run></acme-feedback>`),
    },
    {
      h: "Inline",
      html: `<div style="min-height:300px"><acme-feedback dry-run label="vercel" variant="inline"></acme-feedback></div>`,
    },
    {
      h: "Feedback with Select",
      p: "Feedback with a fixed list of topics.",
      html: centered(`<acme-feedback label="vercel" show-topics dry-run></acme-feedback>`),
    },
    {
      h: "Feedback with metadata",
      p: "Feedback with any key-value metadata attached to the submission.",
      html: centered(`<acme-feedback label="vercel" dry-run metadata='{"userId":"user_12345","location":"post-checkout","orderId":"order_123456"}'></acme-feedback>`),
    },
    {
      h: "Feedback with prefix",
      html: `<div style="min-height:300px"><acme-feedback dry-run label="vercel"><svg class="ic" width="16" height="16" slot="start" aria-hidden="true"><use href="#i-flag"/></svg></acme-feedback></div>`,
    },
    {
      h: "Feedback with suffix",
      html: `<div style="min-height:300px"><acme-feedback dry-run label="vercel"><svg class="ic" width="16" height="16" slot="end" aria-hidden="true"><use href="#i-flag"/></svg></acme-feedback></div>`,
    },
    {
      h: "Open", census: true,
      p: "The card, 340px wide and 8px under the trigger: the textarea, the markdown hint, and a footer with the four emotion radios and Send. Escape or a click outside closes it.",
      html: centered(`<acme-feedback label="vercel" dry-run open></acme-feedback>`),
    },
    {
      h: "Open with Select and email", census: true,
      p: "The topic select and the email field sit above the textarea.",
      html: centered(`<acme-feedback label="vercel" show-topics show-email dry-run open></acme-feedback>`),
    },
    {
      h: "Open with error", census: true,
      p: "Send checks the topic, the email, the note and the emotion, in that order, and unfolds the message under the textarea.",
      html: centered(`<acme-feedback label="vercel" open></acme-feedback>`),
      script: send,
    },
    {
      h: "Sent", census: true,
      p: "After a submission the card takes a fixed height and shows the check and the two lines, then closes after four seconds (later while the pointer rests on it).",
      html: centered(`<acme-feedback label="vercel" dry-run open></acme-feedback>`),
      script: send,
    },
    {
      h: "Inline open", census: true,
      p: "A face grows the pill into a 336px card in place; the same face closes it. With a message the card is 28px taller.",
      html: `<div style="min-height:420px"><acme-feedback label="vercel" variant="inline" show-topics show-email></acme-feedback></div>`,
      script: `${pick}
el.updateComplete.then(() => el.shadowRoot.querySelector('form').requestSubmit());`,
    },
    {
      h: "Inline sent", census: true,
      p: "The thank-you view fills the card, which keeps its height until it closes.",
      html: `<div style="min-height:300px"><acme-feedback label="vercel" variant="inline" dry-run></acme-feedback></div>`,
      script: `${pick}
el.updateComplete.then(() => el.shadowRoot.querySelector('form').requestSubmit());`,
    },
    {
      h: "Inline upwards", census: true,
      p: "The row keeps its 48px and the open card shifts up by 200px (100px with a message), for a pill at the foot of a page.",
      html: `<div style="padding-top:220px"><acme-feedback label="vercel" variant="inline" upwards dry-run></acme-feedback></div>`,
      script: pick,
    },
    {
      h: "Inline full width", census: true,
      p: "The pill fills its row.",
      html: `<div style="width:504px"><acme-feedback label="vercel" variant="inline" full-width dry-run></acme-feedback></div>`,
    },
  ],
  practices: {
    "When to use": [
      "Place Feedback at the end of a page, doc or finished flow, where the user has formed an opinion. Do not put it at the top of a surface the user has only just opened.",
      "Use the topic select when feedback maps to categories the team triages (Bug, Pricing, Documentation); skip it when the open textarea is enough.",
      "Feedback is not a support form, a bug-report intake or NPS sampling. Those have their own surfaces.",
    ],
    Behavior: [
      "The panel stays closed until the user clicks the trigger; opening it on its own derails the work that prompted the feedback.",
      "Pair the metadata variant with context that holds no personal data (route, build ID, plan, viewport) so the team can reproduce the report without a second round-trip.",
      "Submit closes the panel and returns focus to the trigger. No acknowledgment toast: the close is the acknowledgment.",
    ],
    Content: [
      "label is Title Case and short. The default Feedback is fine; change it only to scope a flow: Feedback on Imports, Report a Bug. No question mark at the end.",
      "copy replaces the prompt beside the emoji row, in sentence case (How did the import go?). Cut please and we’re sorry.",
      "The textarea placeholder (Your feedback...) is fixed; do not replace it with rich content.",
    ],
  },
};
