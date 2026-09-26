import type { Doc } from "../../site";

export const doc: Doc = {
  id: "field",
  title: "Field",
  tags: ["acme-field"],
  lede: "Connect one control with its label, help and error presentation.",
  examples: [
    {
      h: "Native select",
      html: '<acme-field id="field-select-example" required><span slot="label">Country</span><select name="country" required><option value="">Choose a country</option><option value="ca">Canada</option><option value="nz">New Zealand</option></select><span slot="help">Choose your delivery country.</span></acme-field>',
    },
    {
      h: "Logical control group",
      html: '<acme-field id="field-radio-example"><span slot="label">Billing plan</span><acme-radio-group name="plan"><acme-radio value="monthly">Monthly</acme-radio><acme-radio value="yearly">Yearly</acme-radio></acme-radio-group><span slot="help">Choose one billing schedule.</span></acme-field>',
    },
    {
      h: "Error presentation",
      html: '<acme-field invalid><span slot="label">Terms</span><acme-checkbox name="terms" required></acme-checkbox><span slot="help">Review the terms before accepting.</span><span slot="error">Accept the terms to continue.</span></acme-field>',
    },
    {
      h: "Disabled",
      html: '<acme-field disabled><span slot="label">Product updates</span><acme-checkbox name="updates"></acme-checkbox><span slot="help">An administrator manages this option.</span></acme-field>',
    },
    {
      h: "Horizontal",
      html: '<acme-field orientation="horizontal" optional><span slot="label">Notifications</span><acme-switch name="notifications"></acme-switch><span slot="help">You can change this later.</span></acme-field>',
    },
    {
      h: "Native form",
      html: '<form id="field-form-example"><acme-field id="field-form-control" required><span slot="label">Delivery country</span><select name="country" required><option value="">Choose a country</option><option value="ca">Canada</option></select><span slot="help">This controls available delivery options.</span><span slot="error">Choose a delivery country.</span></acme-field><acme-h-stack gap="2"><acme-button type="submit">Save country</acme-button><acme-button type="reset" variant="secondary">Reset country</acme-button></acme-h-stack><output></output></form>',
      script:
        'const form=root.querySelector("form"),field=form.querySelector("acme-field");form.addEventListener("invalid",()=>{field.invalid=true;},true);form.addEventListener("submit",event=>{event.preventDefault();field.invalid=false;form.querySelector("output").textContent=new FormData(form).get("country");});form.addEventListener("reset",()=>{field.invalid=false;form.querySelector("output").textContent="";});',
    },
  ],
  practices: {
    Ownership: [
      "Field names one logical control. Radio Group, Checkbox Group and Segmented Control each register their root once; their options keep their own labels.",
      "Use Fieldset or separate Fields for multiple independent controls. An ambiguous Field does not silently label its first child.",
      "required and optional describe the label presentation and cannot both be true. Set required on the control when native constraint validation is needed.",
    ],
    State: [
      "invalid displays the error slot and its accessible description. It does not invent native validity or replace application validation.",
      "disabled supplies the control context without discarding individual disabled settings. A native Fieldset still supplies native group disability.",
      "Help and active errors supplement external descriptions. Explicit control names and native labels remain authoritative.",
    ],
  },
};
