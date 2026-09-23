import type { Doc } from "../../site";
export const doc: Doc = {
  id: "fieldset",
  title: "Fieldset",
  tags: ["acme-fieldset"],
  lede: "Group related controls under a native legend, with shared help and disability.",
  examples: [
    {
      h: "Native form group",
      html: '<form id="fieldset-form"><acme-fieldset id="fieldset-group"><legend slot="legend">Notifications</legend><span slot="help">Choose the messages you want to receive.</span><acme-v-stack gap="3"><acme-checkbox name="alerts" value="yes" checked>Security alerts</acme-checkbox><acme-switch name="updates" value="yes">Product updates</acme-switch></acme-v-stack></acme-fieldset><acme-h-stack gap="2"><acme-button type="submit">Save preferences</acme-button><acme-button type="reset" variant="secondary">Reset preferences</acme-button></acme-h-stack><output></output></form>',
      script:
        'const form=root.querySelector("form");form.addEventListener("submit",event=>{event.preventDefault();form.querySelector("output").textContent=JSON.stringify([...new FormData(form)]);});',
    },
    {
      h: "Disabled group",
      html: '<acme-fieldset disabled><legend slot="legend">Managed settings</legend><span slot="help">An administrator manages these options.</span><acme-v-stack gap="3"><acme-checkbox checked>Security alerts</acme-checkbox><acme-switch>Product updates</acme-switch></acme-v-stack></acme-fieldset>',
    },
    {
      h: "First legend remains available",
      html: '<acme-fieldset id="fieldset-legend-example" disabled><legend slot="legend"><acme-checkbox id="fieldset-enable">Enable optional settings</acme-checkbox></legend><acme-switch>Activity summaries</acme-switch></acme-fieldset>',
      script: 'const group=root.querySelector("acme-fieldset");group.querySelector("acme-checkbox").addEventListener("acme-change",event=>{group.disabled=!event.detail.checked;});',
    },
    {
      h: "Group error",
      html: '<acme-fieldset invalid><legend slot="legend">Delivery options</legend><span slot="help">Select the options that apply.</span><acme-checkbox>Express delivery</acme-checkbox><span slot="error">Review the delivery options before continuing.</span></acme-fieldset>',
    },
    {
      h: "Optional Card",
      html: '<acme-card><acme-fieldset><legend slot="legend">Account preferences</legend><span slot="help">Card owns the surrounding surface.</span><acme-switch>Weekly digest</acme-switch></acme-fieldset></acme-card>',
    },
  ],
  practices: {
    Structure: [
      "Use one native legend in the legend slot. It retains real first-legend behavior, including interactive controls that can enable a disabled group.",
      "Fieldset supplies grouping. Each input still needs its own label; use Field for one logical control. Card is an optional surrounding surface.",
      "The native container retains author node identity. Let a structural child update settle before reading its final form associations.",
    ],
    State: [
      "disabled uses the native fieldset ancestor. It excludes contained native and component controls from submission and keyboard interaction without changing their own disabled settings.",
      "invalid describes the group and displays its error slot. It does not mark individual fields invalid or change native validity.",
      "Keep help and error text separate. Active group descriptions supplement authored aria-describedby references.",
    ],
  },
};
