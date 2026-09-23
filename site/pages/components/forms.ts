import type { Doc } from "../../site";
export const doc: Doc = {
  id: "forms",
  title: "Forms",
  tags: [],
  lede: "Use native forms directly, or connect canonical control values to TanStack Form with bindField.",
  examples: [
    {
      h: "Managed form",
      p: "The application renders label and error content in Field. bindField keeps value or checked and invalid presentation in sync with the typed field state.",
      html: "<docs-form-demo></docs-form-demo>",
      code: 'import {html} from "lit";\nimport {TanStackFormController, bindField} from "@acmelabs/design-system";\nimport "@acmelabs/design-system/define/field";\nimport "@acmelabs/design-system/define/input";\n\n// In a Lit element:\nform = new TanStackFormController(this, {\n  defaultValues: {profile: {name: ""}},\n  onSubmit: ({value}) => saveProfile(value),\n});\n\nrender() {\n  return html`<form @submit=${(event) => {\n    event.preventDefault();\n    this.form.api.handleSubmit();\n  }}>\n    ${this.form.field({\n      name: "profile.name",\n      validators: {onChange: ({value}) =>\n        value.length < 2 ? "Use at least two letters." : undefined},\n    }, field => html`\n      <acme-field .invalid=${field.state.meta.isTouched && !field.state.meta.isValid}>\n        <span slot="label">Name</span>\n        <acme-input name="profile.name" ${bindField(field)}></acme-input>\n        <span slot="error">${field.state.meta.errors.join(" ")}</span>\n      </acme-field>\n    `)}\n    <button type="submit">Save</button>\n  </form>`;\n}',
    },
    {
      h: "Native form",
      p: "The control owns native submission and validity. No managed form library is required.",
      html: '<form><acme-field required><span slot="label">Email</span><acme-input type="email" name="email" required></acme-input></acme-field><acme-button type="submit">Save</acme-button><acme-button type="reset" variant="secondary">Reset</acme-button><output></output></form>',
      script: "root.querySelector('form').addEventListener('submit',event=>{event.preventDefault();root.querySelector('output').textContent='Saved: '+new FormData(event.target).get('email');});",
    },
  ],
  practices: {
    Behavior: [
      "bindField updates value for text, arrays and selected values; boolean fields update checked.",
      "Live edits and commits share the same field state. An unchanged commit does not repeat handleChange.",
      "Leaving the control calls handleBlur. Store updates and managed reset update the native control. Disconnection releases the binding subscription.",
      "Keep name on the control when native FormData is needed. Nested and array field names remain application-owned paths.",
      "Field error text, disabled/loading state, submission and server responses stay with the application. invalid is presentation and does not replace native validity.",
    ],
  },
};
