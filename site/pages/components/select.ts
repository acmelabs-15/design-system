import type { Doc } from "../../site";
const options =
  '<acme-option value="react">React</acme-option><acme-option value="lit">Lit<span slot="description">Web components and HTML templates.</span></acme-option><acme-option value="vue">Vue</acme-option>';
export const doc: Doc = {
  id: "select",
  title: "Select",
  lede: "Choose one value from an accessible option list.",
  tags: ["acme-select", "acme-option"],
  examples: [
    { h: "Default", html: `<acme-field><span slot="label">Framework</span><acme-select placeholder="Choose a framework">${options}</acme-select></acme-field>` },
    { h: "Clearable", html: `<acme-select aria-label="Framework" clearable value="lit">${options}</acme-select>` },
    {
      h: "Sections and disabled options",
      html: '<acme-select aria-label="Destination" placeholder="Choose a destination"><div role="group" aria-label="Europe"><acme-option value="paris">Paris</acme-option><acme-option value="rome" disabled>Rome</acme-option></div><div role="group" aria-label="Asia"><acme-option value="tokyo">Tokyo</acme-option></div></acme-select>',
    },
    {
      h: "Native form",
      html: `<form id="select-form-example"><acme-field required><span slot="label">Framework</span><acme-select name="framework" required placeholder="Choose a framework">${options}</acme-select></acme-field><acme-button type="submit">Save</acme-button><acme-button type="reset" variant="secondary">Reset</acme-button><output></output></form>`,
      script: "root.querySelector('form').addEventListener('submit',event=>{event.preventDefault();root.querySelector('output').textContent=new FormData(event.target).get('framework');});",
    },
    {
      h: "Sizes",
      html: `<acme-v-stack gap="3">${["small", "medium", "large"].map((size) => `<acme-select size="${size}" aria-label="${size} framework" value="lit">${options}</acme-select>`).join("")}</acme-v-stack>`,
    },
  ],
  practices: {
    Behavior: [
      "The root owns one optional string value. Each Option needs a unique nonempty value. Child selection is derived from that root value.",
      "Arrow keys highlight choices. Enter or Space commits a choice. Escape closes without changing the selected value. Disabled options cannot be selected.",
      "Use Field for labels, help and errors. Native HTML select remains usable directly with Field when browser-native presentation is preferred.",
    ],
  },
};
