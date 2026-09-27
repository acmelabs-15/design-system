import type { Doc } from "../../site";

export const doc: Doc = {
  id: "checkbox",
  title: "Checkbox",
  tags: ["acme-checkbox", "acme-checkbox-group", "acme-checkbox-card"],
  lede: "A native checkbox with immediate form state, an independent reset target and an optional mixed state.",
  examples: [
    { h: "Default", html: "<acme-checkbox>Product updates</acme-checkbox>" },
    {
      h: "Sizes",
      html: '<acme-h-stack gap="4"><acme-checkbox size="small">Small</acme-checkbox><acme-checkbox>Medium</acme-checkbox><acme-checkbox size="large">Large</acme-checkbox></acme-h-stack>',
    },
    { h: "Description", html: '<acme-checkbox>Receive release notes<span slot="description">A short message when a new version ships.</span></acme-checkbox>' },
    {
      h: "Disabled",
      html: '<acme-v-stack gap="2"><acme-checkbox disabled>Disabled</acme-checkbox><acme-checkbox checked disabled>Disabled checked</acme-checkbox><acme-checkbox indeterminate disabled>Disabled mixed</acme-checkbox></acme-v-stack>',
    },
    { h: "Indeterminate", html: "<acme-checkbox indeterminate>Some items are selected</acme-checkbox>" },
    {
      h: "Native form",
      html: '<form id="checkbox-form-example"><acme-checkbox name="agreement" value="accepted" required>I agree to the terms.</acme-checkbox><acme-h-stack gap="2"><acme-button type="submit">Submit</acme-button><acme-button type="reset" variant="secondary">Reset</acme-button></acme-h-stack><output></output></form>',
      script:
        'const form=root.querySelector("#checkbox-form-example"); form.addEventListener("submit",event=>{event.preventDefault(); form.querySelector("output").textContent=new FormData(form).get("agreement") ?? "No selection";}); form.addEventListener("reset",()=>{form.querySelector("output").textContent="";});',
    },

    {
      h: "Checkbox Group",
      html: '<form id="checkbox-group-form"><acme-checkbox-group name="features" value=\'["alerts"]\' required aria-label="Features"><acme-v-stack gap="2"><acme-checkbox value="alerts">Alerts</acme-checkbox><acme-checkbox value="exports">Exports</acme-checkbox></acme-v-stack></acme-checkbox-group><acme-h-stack gap="2"><acme-button type="submit">Save features</acme-button><acme-button type="reset" variant="secondary">Reset features</acme-button></acme-h-stack><output></output></form>',
      script:
        'const form=root.querySelector("#checkbox-group-form"); form.addEventListener("submit",event=>{event.preventDefault();form.querySelector("output").textContent=JSON.stringify(new FormData(form).getAll("features"));}); form.addEventListener("reset",()=>{form.querySelector("output").textContent="";});',
    },
    {
      h: "Attached cards and independent actions",
      html: '<div><acme-checkbox-group id="checkbox-card-example" aria-label="Tools"><acme-group attached outline align-items="stretch" variant="secondary" size="small"><acme-checkbox-card value="editor"><acme-code-icon slot="start"></acme-code-icon><span slot="heading">Editor</span><span slot="description">Code tools</span><acme-button id="card-about" slot="actions" size="small" variant="tertiary">About the editor</acme-button><acme-toggle-button id="card-pin" slot="actions" size="small" variant="secondary">Pin editor</acme-toggle-button></acme-checkbox-card><acme-checkbox-card value="browser"><acme-language-icon slot="start"></acme-language-icon><span slot="heading">Browser</span><span slot="description">Preview tools</span></acme-checkbox-card></acme-group></acme-checkbox-group><p>Selected: <output id="card-selection">None</output></p><p><output id="card-details"></output></p><p><output id="card-pinned">Not pinned</output></p></div>',
      script:
        'const group=root.querySelector("#checkbox-card-example");group.addEventListener("acme-change",event=>{root.querySelector("#card-selection").textContent=event.detail.value.join(", ")||"None";});root.querySelector("#card-about").addEventListener("click",()=>{root.querySelector("#card-details").textContent="The editor option enables code tools.";});root.querySelector("#card-pin").addEventListener("acme-change",event=>{root.querySelector("#card-pinned").textContent=event.detail.pressed?"Pinned":"Not pinned";});',
    },
    { h: "Optional ripple", html: "<acme-checkbox ripple>Press feedback</acme-checkbox>" },
  ],
  practices: {
    State: [
      "checked is the current value. defaultChecked sets the reset target; the checked HTML attribute supplies its initial value.",
      "Programmatic writes update form data immediately and emit no user-change event. A user action emits acme-change with checked and indeterminate=false.",
      "indeterminate does not change whether the checked value submits. The next native action clears it.",
    ],
    Groups: [
      "Checkbox Group owns the array, reset target, submission name and validation. Validate the group; owned members do not submit or validate as separate fields.",
      "Selected enabled members submit once in current member order. Temporarily absent values stay in the array but do not submit until their member returns.",
      "Use ordinary Stack for layout. General Group adds attached borders and compatible appearance defaults.",
      "Independent actions belong in the card actions slot. Listen on those controls directly; their changes do not become Card or Checkbox Group change notifications.",
      "Use a heading for rich card content. Keep interactive controls outside the label surface.",
    ],
    Accessibility: [
      "Use visible label content, an external native label, aria-label or aria-labelledby. Description content augments explicit accessible help.",
      "A disabled Fieldset disables the actual native input while preserving the checkbox’s own disabled property.",
      "Use native checkValidity, reportValidity and setCustomValidity for form validation. invalid changes presentation; it does not invent validation rules.",
    ],
  },
};
