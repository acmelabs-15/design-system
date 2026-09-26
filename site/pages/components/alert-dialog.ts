import type { Doc } from "../../site";

const confirmation =
  '<acme-alert-dialog><acme-alert-dialog-trigger slot="trigger">Confirm deletion</acme-alert-dialog-trigger><h2 slot="heading">Delete example project?</h2><p slot="description">Type DELETE to confirm the example action.</p><acme-field><span slot="label">Confirmation</span><acme-input></acme-input></acme-field><acme-alert-dialog-cancel slot="footer">Cancel</acme-alert-dialog-cancel><acme-alert-dialog-action slot="footer" variant="error" disabled>Delete project</acme-alert-dialog-action></acme-alert-dialog><output></output>';
export const doc: Doc = {
  id: "alert-dialog",
  title: "Alert Dialog",
  lede: "A modal prompt with explicit action, cancellation and least-destructive initial focus.",
  tags: ["acme-alert-dialog", "acme-alert-dialog-trigger", "acme-alert-dialog-action", "acme-alert-dialog-cancel"],
  examples: [
    {
      h: "Typed confirmation",
      html: confirmation,
      script:
        'const dialog=root.querySelector("acme-alert-dialog"),input=dialog.querySelector("acme-input"),action=dialog.querySelector("acme-alert-dialog-action");const sync=()=>{action.disabled=input.value!=="DELETE";};input.addEventListener("acme-input",sync);dialog.addEventListener("acme-after-close",()=>{input.value="";sync();});action.addEventListener("click",()=>{root.querySelector("output").textContent="Confirmation recorded.";dialog.hide();});',
    },
    {
      h: "Failure and retry",
      html: '<acme-alert-dialog><acme-alert-dialog-trigger slot="trigger">Save changes</acme-alert-dialog-trigger><h2 slot="heading">Save project changes?</h2><p slot="description">This example keeps the prompt open after its first attempt.</p><p role="alert"></p><acme-alert-dialog-cancel slot="footer">Cancel</acme-alert-dialog-cancel><acme-alert-dialog-action slot="footer">Save</acme-alert-dialog-action></acme-alert-dialog>',
      script:
        'const dialog=root.querySelector("acme-alert-dialog");let attempts=0;dialog.querySelector("acme-alert-dialog-action").addEventListener("click",()=>{if(++attempts===1)dialog.querySelector("[role=alert]").textContent="The save failed. Try again.";else dialog.hide();});dialog.addEventListener("acme-after-close",()=>{attempts=0;dialog.querySelector("[role=alert]").textContent="";});',
    },
  ],
  practices: {
    Behavior: [
      "Provide both an accessible name and description. Cancel receives initial focus by default; initialFocus can identify a suitable reading target when needed.",
      "Action is a normal Button. It does not assume success or close the prompt. The application chooses when to call hide().",
      "Outside dismissal is off by default; Escape and explicit Cancel use the same cancelable close path. Modal isolation remains mandatory.",
      "Keep retry errors and entered values while the prompt stays open. Reset local confirmation state after a completed close so reopening starts a fresh attempt.",
      "Pending state belongs to the action. Keep cancellation policy explicit and report the outcome of the operation.",
    ],
  },
};
