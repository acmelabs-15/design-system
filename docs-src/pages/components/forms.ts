// Docs page: Forms (house guidance on TanStack Form with the acme inputs)
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "forms",
  title: "Forms",
  lede: "How a Lit app binds the acme inputs to TanStack Form. The package exports TanStackFormController and a bindField directive that wires value, error, input and blur in one call. A house page; Geist has no page for it.",
  tags: [],
  house: true,
  examples: [
    {
      h: "A form with validation",
      p: "Validation runs on change with a debounced async check; the error text lands in the input's error attribute. Submit is disabled while the form cannot submit.",
      html: `<docs-form-demo></docs-form-demo>`,
      code: `import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { TanStackFormController, bindField } from "@acmelabs/design-system";

@customElement("signup-form")
export class SignupForm extends LitElement {
  form = new TanStackFormController(this, {
    defaultValues: { name: "", email: "", plan: "hobby", updates: true },
    onSubmit: ({ value }) => console.log(value),
  });

  render() {
    return html\`<form @submit=\${(e: Event) => { e.preventDefault(); this.form.api.handleSubmit(); }}>
      \${this.form.field({ name: "name", validators: { onChange: ({ value }) => (value.length < 2 ? "Name needs two characters." : undefined) } },
        (f) => html\`<acme-input label="Name" placeholder="Ada Lovelace" \${bindField(f)}></acme-input>\`)}
      \${this.form.field({ name: "email", validators: { onChange: ({ value }) => (/@/.test(value) ? undefined : "Enter an email address.") } },
        (f) => html\`<acme-input label="Email" type="email" placeholder="ada@acme.dev" \${bindField(f)}></acme-input>\`)}
      \${this.form.field({ name: "plan" },
        (f) => html\`<acme-select label="Plan" options='["hobby","pro","enterprise"]' \${bindField(f)}></acme-select>\`)}
      \${this.form.field({ name: "updates" },
        (f) => html\`<acme-toggle label="Product updates" \${bindField(f)}></acme-toggle>\`)}
      <acme-button type="submit" variant="primary" ?disabled=\${!this.form.api.state.canSubmit}>Create Account</acme-button>
    </form>\`;
  }
}`,
    },
  ],
  practices: {
    "When to use": [
      "TanStack Form fits the acme inputs because it is headless: the controller owns state and validation, the template owns the elements. bindField covers acme-input, acme-textarea, acme-select, acme-checkbox, acme-toggle and acme-radio.",
      "Validate on change for format, on blur for expensive checks, and name the field and the constraint in the message; the input shows it in red below the control.",
    ],
    Behavior: [
      "The controller re-renders the host on every form state change, so disabled states and errors follow without extra wiring.",
      "For a plain HTML form with one or two inputs, native validation is enough; reach for the controller when values are cross-checked or submitted as one object.",
    ],
  },
};
