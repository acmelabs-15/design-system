import type { Doc } from "../../site";
export const doc: Doc = {
  id: "button",
  title: "Button",
  tags: ["acme-button", "acme-icon-button", "acme-toggle-button"],
  lede: "Native actions and links with shared appearance, accessible names and explicit state ownership.",
  examples: [
    {
      h: "Variants",
      html: '<div class="row"><acme-button>Save</acme-button><acme-button variant="secondary">Cancel</acme-button><acme-button variant="tertiary">Details</acme-button><acme-button variant="error">Delete</acme-button><acme-button variant="warning">Review</acme-button></div>',
    },
    {
      h: "Sizes",
      html: '<div class="row"><acme-button size="tiny">1</acme-button><acme-button size="small">Small</acme-button><acme-button>Medium</acme-button><acme-button size="large">Large</acme-button></div>',
    },
    {
      h: "Icons",
      html: '<div class="row"><acme-icon-button aria-label="Close"><acme-close-icon></acme-close-icon></acme-icon-button><acme-icon-button shape="circle" aria-label="Add"><acme-add-icon></acme-add-icon></acme-icon-button><acme-button><acme-download-icon slot="start"></acme-download-icon>Download</acme-button></div>',
    },
    { h: "Loading", html: "<acme-button loading>Saving</acme-button>" },
    {
      h: "Native form action",
      html: '<form id="button-form" class="row"><label>Project <input name="project" required value="Example"></label><acme-button type="submit" name="action" value="save">Save project</acme-button><output></output></form>',
      script: 'const form = root.querySelector("#button-form"); form.addEventListener("submit", event => { event.preventDefault(); const data = new FormData(form, event.submitter); form.querySelector("output").textContent = `${data.get("action")}: ${data.get("project")}`; });',
    },
    { h: "Toggle action", html: '<acme-toggle-button variant="secondary">Pin</acme-toggle-button>' },
    {
      h: "Attached actions",
      html: '<acme-group attached outline variant="secondary" size="small"><acme-button>Save</acme-button><acme-icon-button aria-label="More options"><acme-more-horiz-icon></acme-more-horiz-icon></acme-icon-button></acme-group>',
    },
    { h: "Customization", html: '<acme-button width="160px" shape="pill" style="--accent:#0058bd;--accent-hover:#0062d1;--accent-active:#004ba0;--on-accent:white">Upgrade</acme-button>' },
    { h: "Optional ripple", html: "<acme-button ripple>Run action</acme-button>" },
  ],
  practices: {
    Actions: [
      "Button defaults to type=button. Use type=submit or reset for native form actions. href makes a real link.",
      "Icon Button requires aria-label or a valid aria-labelledby reference. Its default slot contains one icon.",
      "Toggle Button exposes pressed and emits acme-change after user activation. It never submits a form.",
    ],
    Forms: [
      "The visible button uses native activation. A private native submitter in the author’s form tree supplies form data, implicit Enter and submitter overrides.",
      "SubmitEvent.submitter is that persistent native button. Read it directly when constructing FormData(form, event.submitter).",
      "Use visible content or ARIA references to name an action. Native label-for linkage to the autonomous host is not the action naming interface.",
    ],
    State: [
      "Loading keeps focus, exposes busy/disabled semantics and suppresses activation. Explicit disabled removes keyboard access.",
      "Group supplies size and variant unless the child has an authored override. Clear the child property to resume inheritance.",
      "Ripple is optional and off by default. Reduced motion suppresses it.",
    ],
  },
};
