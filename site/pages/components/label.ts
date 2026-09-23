import type { Doc } from "../../site";
export const doc: Doc = {
  id: "label",
  title: "Label",
  tags: ["acme-label"],
  lede: "Name and activate a control through a real native label.",
  examples: [
    {
      h: "Native control",
      html: '<acme-v-stack gap="2"><acme-label id="label-native-example" for="label-native-input">Email address</acme-label><input id="label-native-input" type="email" autocomplete="email"></acme-v-stack>',
    },
    {
      h: "Component control",
      html: '<acme-h-stack gap="2"><acme-checkbox id="label-checkbox-example" name="notifications"></acme-checkbox><acme-label id="label-checkbox-label" for="label-checkbox-example">Notifications</acme-label></acme-h-stack>',
    },
    {
      h: "Control group",
      html: '<acme-v-stack gap="2"><acme-label id="label-group-label" for="label-group-example">Billing plan</acme-label><acme-radio-group id="label-group-example"><acme-radio value="monthly">Monthly</acme-radio><acme-radio value="yearly">Yearly</acme-radio></acme-radio-group></acme-v-stack>',
    },
  ],
  practices: {
    Association: [
      "Set for to the control ID in the same tree scope. Native labels keep exact ID matching, including punctuation.",
      "A component control receives naming through its native form association. Label activation focuses the actual control or group entry.",
      "Use Field when label, helper text, error text and required/optional presentation belong together.",
    ],
    Content: [
      "Supply label content in the default slot. The label preserves your text casing.",
      "An omitted for allows ordinary native implicit labeling of a contained control. Independent links and buttons retain native label activation rules.",
    ],
  },
};
