import type { Doc } from "../../site";
const profile =
  '<acme-dialog><acme-dialog-trigger slot="trigger">Edit profile</acme-dialog-trigger><h2 slot="heading">Profile settings</h2><p slot="description">Update the details shown on your profile.</p><form id="profile-form"><acme-field required><span slot="label">Name</span><acme-input name="name" required value="Ada"></acme-input></acme-field><acme-button type="submit">Save profile</acme-button></form><acme-dialog-close slot="footer">Cancel</acme-dialog-close></acme-dialog><output></output>';
export const doc: Doc = {
  id: "dialog",
  title: "Dialog",
  lede: "A named dialog with native focus, explicit actions and cancelable dismissal.",
  tags: ["acme-dialog", "acme-dialog-trigger", "acme-dialog-close"],
  examples: [
    {
      h: "Edit a profile",
      html: profile,
      script:
        'const dialog=root.querySelector("acme-dialog");root.querySelector("form").addEventListener("submit",event=>{event.preventDefault();root.querySelector("output").textContent="Saved: "+new FormData(event.target).get("name");dialog.hide();});',
    },
    {
      h: "Nonmodal",
      html: '<acme-dialog modal="false" close-on-outside="false"><acme-dialog-trigger slot="trigger">Open nonmodal dialog</acme-dialog-trigger><h2 slot="heading">Reference information</h2><p>The page remains interactive.</p><acme-dialog-close slot="footer">Close reference</acme-dialog-close></acme-dialog>',
    },
    {
      h: "Long content",
      html: `<acme-dialog initial-focus="[slot=heading]"><acme-dialog-trigger slot="trigger">Read details</acme-dialog-trigger><h2 slot="heading" tabindex="-1">Project details</h2>${"<p>Review the project details before continuing. The surface scrolls while the document behind it stays in place.</p>".repeat(15)}<acme-dialog-close slot="footer">Close details</acme-dialog-close></acme-dialog>`,
    },
    {
      h: "Inset content",
      html: '<acme-dialog><acme-dialog-trigger slot="trigger">Open summary</acme-dialog-trigger><h2 slot="heading">Summary</h2><p>Content above the inset.</p><acme-inset side="inline"><div style="background:var(--ds-background-200);padding:20px">A full-width section within the padded body.</div></acme-inset><p>Content below the inset.</p><acme-dialog-close slot="footer">Close summary</acme-dialog-close></acme-dialog>',
    },
  ],
  practices: {
    Behavior: [
      "Provide heading content or an explicit accessible name. Use description for a concise explanation; long structured content does not need to become one large description.",
      "show(), hide() and open assignments are programmatic. User actions emit acme-open-change; a cancelable acme-request with action=close runs before dismissal.",
      "acme-after-open and acme-after-close follow the owned motion. Modality and scroll locking remain through exit; reopening cancels exit. Unrelated child animations do not control this lifetime.",
      "initialFocus and returnFocus accept an Element or selector. A removed opener does not close the dialog. Use returnFocus to select a persistent destination when the trigger can disappear.",
      "The default focus targets main content controls, then the heading. Use initial-focus on a focusable heading for long reading content. Use Alert Dialog for consequential prompts.",
      "Actions and asynchronous success or failure belong to the application. Loading an action does not silently disable dismissal.",
      "Style the native backdrop through the surface part and its ::backdrop pseudo-element. Explicit close controls expose their own shared action parts.",
    ],
  },
};
