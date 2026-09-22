import type { Doc } from "../../site";
export const doc: Doc = {
  id: "input",
  title: "Input",
  lede: "Native text editing, validation and form submission.",
  tags: ["acme-input"],
  examples: [
    {
      h: "Default",
      html: `<acme-h-stack gap="4">${["small", "medium", "large"].map((size) => `<acme-input size="${size}" aria-label="${size} example" placeholder="${size}"></acme-input>`).join("")}</acme-h-stack>`,
    },
    {
      h: "Field and native validation",
      html: '<form><acme-field required><span slot="label">Email</span><acme-input name="email" type="email" required placeholder="ada@example.com"></acme-input><span slot="help">Use an address that you can receive mail at.</span></acme-field><acme-button type="submit">Save</acme-button><output></output></form>',
      script: "root.querySelector('form').addEventListener('submit',event=>{event.preventDefault();root.querySelector('output').textContent='Saved: '+new FormData(event.target).get('email');});",
    },
    {
      h: "Add-ons and inside content",
      p: "All four positions can be used together. Add-on actions keep their own keyboard focus.",
      html: '<acme-input aria-label="Website" placeholder="example"><span slot="start-addon">https://</span><acme-language-icon slot="start"></acme-language-icon><span slot="end">.com</span><acme-button slot="end-addon" variant="tertiary" size="small">Open</acme-button></acme-input>',
    },
    { h: "Clearable", html: '<acme-input clearable aria-label="Project name" value="My project"></acme-input>' },
    {
      h: "Disabled and read only",
      html: '<acme-v-stack gap="3"><acme-input disabled aria-label="Disabled project" value="Unavailable"></acme-input><acme-input readonly aria-label="Project identifier" value="project-102"></acme-input></acme-v-stack>',
    },
    {
      h: "Error",
      html: '<acme-field invalid><span slot="label">Project name</span><acme-input value="Existing project"></acme-input><span slot="error">This name is already in use.</span></acme-field>',
    },
    { h: "Attached actions", html: '<acme-group attached><acme-input aria-label="New project name" placeholder="Project name"></acme-input><acme-button>Create</acme-button></acme-group>' },
    { h: "Reset", html: '<form><acme-input name="project" aria-label="Project name" value="Original"></acme-input><acme-button type="reset" variant="secondary">Reset</acme-button></form>' },
  ],
  practices: {
    Behavior: [
      "value is the current value; defaultValue and the value attribute set the reset default.",
      "Native input types apply browser value sanitation. The component adds no trimming or case conversion.",
      "acme-input reports editing. acme-change reports a committed edit. Programmatic writes are silent.",
    ],
    Accessibility: ["Use Field, Label or an accessible name on a standalone input.", "Put help and error text in Field. Set required on the actual control for native validation."],
  },
};
