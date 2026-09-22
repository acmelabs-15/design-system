import type { Doc } from "../../site";
export const doc: Doc = {
  id: "checkbox",
  title: "Checkbox",
  tags: ["acme-checkbox"],
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
        'const form=document.querySelector("#checkbox-form-example"); form.addEventListener("submit",event=>{event.preventDefault(); form.querySelector("output").textContent=new FormData(form).get("agreement") ?? "No selection";}); form.addEventListener("reset",()=>{form.querySelector("output").textContent="";});',
    },
    { h: "Optional ripple", html: "<acme-checkbox ripple>Press feedback</acme-checkbox>" },
  ],
  practices: {
    State: [
      "checked is the current value. defaultChecked sets the reset target; the checked HTML attribute supplies its initial value.",
      "Programmatic writes update form data immediately and emit no user-change event. A user action emits acme-change with checked and indeterminate=false.",
      "indeterminate does not change whether the checked value submits. The next native action clears it.",
    ],
    Accessibility: [
      "Use visible label content, an external native label, aria-label or aria-labelledby. Description content augments explicit accessible help.",
      "A disabled Fieldset disables the actual native input while preserving the checkbox’s own disabled property.",
      "Use native checkValidity, reportValidity and setCustomValidity for form validation. invalid changes presentation; it does not invent validation rules.",
    ],
  },
};
