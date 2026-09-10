// Docs page: Modal — mirrors https://vercel.com/geist/modal
import type { Doc } from "../../site";

const open = `<acme-button size="small">Open Modal</acme-button>`;
const copy = `<p class="text-copy-14">Some content contained within the modal.</p>`;
// The opener shows the modal; every action button closes it.
const wire = `const modal = root.querySelector("acme-modal");
root.querySelector("acme-button").addEventListener("click", () => modal.show());
for (const b of modal.querySelectorAll('acme-button[slot="actions"], [slot="actions"] acme-button')) b.addEventListener("click", () => modal.close());`;
// An open state: the modal opens as soon as the example mounts.
const show = `root.querySelector("acme-modal").show();`;
const actions = (primary: string) => `<acme-button slot="actions" variant="secondary">Cancel</acme-button><acme-button slot="actions">${primary}</acme-button>`;
const subtitle = `<p slot="subtitle">Enter a unique name for your token to differentiate it from other tokens and then select the scope.</p>`;
const stickyActions = `<div slot="actions"><acme-button variant="secondary">Cancel</acme-button><acme-button variant="secondary"><svg class="ic" width="16" height="16" slot="prefix"><use href="#i-back"/></svg>Previous</acme-button></div><acme-button slot="actions">Submit</acme-button>`;
const stickyBody = `${copy.repeat(50)}`;
const stickyCode = `${copy}\n<!-- … 49 more paragraphs … -->\n${stickyActions}`;
const sheetNote = "Under 600px the modal opens as a bottom sheet: resize the window below that width to see this state as the sheet.";

export const doc: Doc = {
  id: "modal",
  title: "Modal",
  lede: "A dialog over the page for content that needs a decision or more detail before the page continues.",
  tags: ["acme-modal", "acme-modal-inset"],
  examples: [
    {
      h: "Default",
      html: `${open}<acme-modal heading="Create Token">${subtitle}${copy}${actions("Submit")}</acme-modal>`,
      script: wire,
    },
    {
      h: "Sticky",
      html: `${open}<acme-modal heading="Create Token" sticky>${stickyBody}${stickyActions}</acme-modal>`,
      code: `${open}<acme-modal heading="Create Token" sticky>${stickyCode}</acme-modal>`,
      script: wire,
    },
    {
      h: "Single button",
      html: `${open}<acme-modal heading="Create Token" sticky>${copy}<acme-button slot="actions" block>Cancel</acme-button></acme-modal>`,
      script: wire,
    },
    {
      h: "Disabled actions",
      html: `${open}<acme-modal heading="Modal"><p slot="subtitle">This is a modal.</p>${copy}<acme-button slot="actions" variant="secondary">Cancel</acme-button><acme-button slot="actions" disabled>Submit</acme-button></acme-modal>`,
      script: wire,
    },
    {
      h: "Inset",
      html: `${open}<acme-modal heading="Modal"><p slot="subtitle">This is a modal.</p><acme-modal-inset><p class="text-copy-14">Content within the inset.</p></acme-modal-inset><div style="padding-top:20px"><p class="text-copy-14">Content outside the inset.</p></div>${actions("Submit")}</acme-modal>`,
      script: wire,
    },
    {
      h: "Control initial focus",
      html: `${open}<acme-modal heading="Initial Focus" initial-focus="#initial-focus-submit"><p slot="subtitle">This Modal is set up to programmatically move the focus onto the Submit button, making it possible to promptly continue with the Enter key.</p><acme-button slot="actions" variant="secondary">Cancel</acme-button><acme-button slot="actions" id="initial-focus-submit">Submit</acme-button></acme-modal>`,
      script: wire,
    },
    {
      h: "Focus an input on open",
      html: `${open}<acme-modal heading="Invite Member" initial-focus="#invite-name"><p slot="subtitle">On both desktop and the mobile bottom sheet, the Name field receives focus when the Modal opens so the user can start typing immediately.</p><div class="vstack" style="gap:12px"><acme-input id="invite-name" label="Name" placeholder="Jane Doe"></acme-input></div>${actions("Send Invite")}</acme-modal>`,
      script: wire,
    },
    {
      h: "Mobile sheet with inputs",
      html: `${open}<acme-modal heading="Invite Member"><p slot="subtitle">On a mobile viewport this opens as a bottom sheet. Verify that both inputs receive focus and accept keyboard input.</p><div class="vstack" style="gap:12px"><acme-input label="Name" placeholder="Jane Doe"></acme-input><acme-input label="Email" placeholder="jane@example.com"></acme-input></div>${actions("Send Invite")}</acme-modal>`,
      script: wire,
    },
    {
      h: "Combobox focus",
      p: "Focus lands on the combobox input when the modal opens, and its list stays closed until the user asks for it.",
      html: `${open}<acme-modal heading="Create Database"><p slot="subtitle">Choose a region for your database. Reads and writes will take place in this region.</p><acme-modal-inset last><acme-combobox label="Region" size="small" placeholder="Search regions..." options='["Washington, D.C., USA (East) – iad1","San Francisco, USA (West) – sfo1","London, UK (London) – lhr1","Frankfurt, Germany (Central EU) – fra1","Singapore (Southeast Asia) – sin1"]'></acme-combobox></acme-modal-inset>${actions("Create Database")}</acme-modal>`,
      script: wire,
    },
    {
      h: "Toasts and focus trap",
      html: `${open}<acme-modal heading="Toasts and Focus Trap"><p slot="subtitle">The Modal traps focus, so Tab stays within it. Toasts still render above the Modal and remain interactive — trigger one, then click its action. The Modal stays open and focus returns to it.</p><div class="vstack" style="gap:12px"><acme-button size="small" variant="secondary" id="show-toast">Show Toast</acme-button></div><acme-button slot="actions">Done</acme-button></acme-modal>`,
      script: `${wire}
root.querySelector("#show-toast").addEventListener("click", () =>
  window.acme.toasts.message({ text: "Project link copied", action: "Undo", onAction: () => window.acme.toasts.message({ text: "Copy reverted" }) }));`,
    },
    {
      h: "Open", census: true,
      p: "The modal open on load: the backdrop, the centred 540px panel with its 20px body, the header with title and subtitle, a paragraph, and the background-200 footer with two small actions.",
      html: `<acme-modal heading="Create Token">${subtitle}${copy}${actions("Submit")}</acme-modal>`,
      script: show,
    },
    {
      h: "Open sticky", census: true,
      p: "A sticky modal at scroll top: the header pinned above the scrolling body, the footer pinned below it with its shadow raised, as the body's end is out of view.",
      html: `<acme-modal heading="Create Token" sticky>${stickyBody}${stickyActions}</acme-modal>`,
      code: `<acme-modal heading="Create Token" sticky>${stickyCode}</acme-modal>`,
      script: show,
    },
    {
      h: "Open sticky scrolled", census: true,
      p: "The sticky modal scrolled into its body: the header's shadow shows below it, the footer's above it.",
      html: `<acme-modal heading="Create Token" sticky>${stickyBody}${stickyActions}</acme-modal>`,
      code: `<acme-modal heading="Create Token" sticky>${stickyCode}</acme-modal>`,
      script: `const modal = root.querySelector("acme-modal");
modal.show();
modal.updateComplete.then(() => {
  const body = modal.shadowRoot.querySelector('[part="body"]');
  body.scrollTop = 160;
  body.dispatchEvent(new Event("scroll"));
});`,
    },
    {
      h: "Open single button", census: true,
      p: "A sticky modal with one full-width action (<code>block</code>): secondary unless it names a variant.",
      html: `<acme-modal heading="Create Token" sticky>${copy}<acme-button slot="actions" block>Cancel</acme-button></acme-modal>`,
      script: show,
    },
    {
      h: "Open inset", census: true,
      p: "An inset inside the body: full-bleed through the body's padding, hairlines above and below, the tinted fill.",
      html: `<acme-modal heading="Modal"><p slot="subtitle">This is a modal.</p><acme-modal-inset><p class="text-copy-14">Content within the inset.</p></acme-modal-inset><div style="padding-top:20px"><p class="text-copy-14">Content outside the inset.</p></div>${actions("Submit")}</acme-modal>`,
      script: show,
    },
    {
      h: "Open inset last", census: true,
      p: "A last inset (<code>last</code>): it meets the footer, its bottom hairline and the body's bottom padding gone.",
      html: `<acme-modal heading="Create Database"><p slot="subtitle">Choose a region for your database. Reads and writes will take place in this region.</p><acme-modal-inset last><p class="text-copy-14">Content within the inset.</p></acme-modal-inset>${actions("Submit")}</acme-modal>`,
      script: show,
    },
    {
      h: "Open unpadded", census: true,
      p: 'A body with <code>body-padding="0"</code>: no inner padding, the light theme\'s plain background.',
      html: `<acme-modal heading="Create Token" body-padding="0">${copy}${actions("Submit")}</acme-modal>`,
      script: show,
    },
    {
      h: "Open allow overflow", census: true,
      p: "<code>allow-overflow</code>: the panel lets content overflow (a menu opened from inside it).",
      html: `<acme-modal heading="Create Token" allow-overflow>${subtitle}${copy}${actions("Submit")}</acme-modal>`,
      script: show,
    },
    {
      h: "Open centered", census: true,
      p: "A centred title (<code>center</code>).",
      html: `<acme-modal heading="Create Token" center>${subtitle}${copy}${actions("Submit")}</acme-modal>`,
      script: show,
    },
    {
      h: "Sheet", census: true,
      p: `${sheetNote} A translucent backdrop, the panel pinned to the bottom edge, full width, rounded at the top, with a fade over its top edge.`,
      html: `<acme-modal id="sheet" heading="Create Token">${subtitle}${copy}${actions("Submit")}</acme-modal>`,
      script: show,
    },
    {
      h: "Sheet sticky", census: true,
      p: `${sheetNote} The sticky modal as a sheet: no fade over the top edge, the header and the footer pinned inside the scrolling panel.`,
      html: `<acme-modal id="sheet-sticky" heading="Create Token" sticky>${stickyBody}${stickyActions}</acme-modal>`,
      code: `<acme-modal id="sheet-sticky" heading="Create Token" sticky>${stickyCode}</acme-modal>`,
      script: show,
    },
    {
      h: "Sheet no scroll", census: true,
      p: `${sheetNote} With <code>drawer-vertical-scroll="false"</code> the sheet clips its content instead of scrolling it.`,
      html: `<acme-modal id="sheet-noscroll" heading="Create Token" drawer-vertical-scroll="false">${subtitle}${copy}${actions("Submit")}</acme-modal>`,
      script: show,
    },
  ],
  practices: {
    "When to use": [
      "A Modal blocks the page until the user decides. When the page must stay readable beside persistent context, use Sheet on desktop and Drawer on mobile.",
      "Confirm a destructive action in a Modal. Drawer and Sheet do not dim the whole page, so they feel too soft for a delete or a revoke.",
      "A routine create flow with its own page goes to that page, not into a Modal.",
    ],
    Behavior: [
      "A destructive Modal opens with focus on Cancel. Enter never fires the destructive action unless the user typed a confirmation.",
      "Escape and a click outside close a non-destructive Modal. A destructive Modal with unsaved input keeps them from closing it.",
      "Focus stays inside the Modal while it is open and goes back to the trigger when it closes. Body scroll comes back in the same tick the Modal leaves.",
      "A high-stakes destructive action (delete a production resource, rotate a signing key, downgrade a plan) enables its primary button only after the user types the resource name.",
    ],
    Content: [
      "The title is a Title Case statement, never a question: <code>Transfer Project</code>, not <code>Transfer Project?</code>.",
      "The body is one to three sentences in sentence case. The consequence comes first, then any cascade.",
      "The primary button is Verb + Noun and repeats the title's verb (<code>Transfer Project</code> title, <code>Transfer Project</code> button). A destructive primary is never <code>Confirm</code>, <code>OK</code> or a bare verb.",
      "The cancel button reads <code>Cancel</code>. A Modal that only acknowledges (after a key reveal, a one-time view) uses <code>Done</code>, never <code>OK</code> or <code>Close</code>.",
      "An irreversible body ends with <code>This cannot be undone.</code>; a body with a partial cascade ends with <code>Some effects cannot be undone.</code> and does not claim full irreversibility.",
      "The success toast repeats the primary button's verb: a <code>Delete Project</code> button gives a <code>Project deleted</code> toast.",
    ],
    Accessibility: [
      "The dialog's <code>aria-labelledby</code> points at the title, so screen readers announce it on open.",
      "The cancel button stays literally <code>Cancel</code>, so screen-reader users hear the same dismissal in every destructive flow.",
      "After an error inside the Modal, focus stays inside so the user can retry. After success, focus returns to the trigger.",
    ],
  },
};
