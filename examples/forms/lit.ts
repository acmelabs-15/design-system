import { html, LitElement } from "lit";
import { TanStackFormController, bindField } from "@acmelabs/design-system";
import "@acmelabs/design-system/define/field";
import "@acmelabs/design-system/define/input";
import "@acmelabs/design-system/define/select";
import "@acmelabs/design-system/define/option";
import "@acmelabs/design-system/define/switch";
import "@acmelabs/design-system/define/button";
import "@acmelabs/design-system/define/v-stack";
import "@acmelabs/design-system/define/h-stack";

/** A managed profile form with a local submission receipt. */
export class ManagedFormExample extends LitElement {
  private form = new TanStackFormController(this, {
    defaultValues: { name: "", email: "", plan: "hobby", updates: true },
    onSubmit: ({ value }) => {
      this.querySelector("output")!.textContent = `Submitted ${value.name} with the ${value.plan} plan.`;
    },
  });
  createRenderRoot() {
    return this;
  }
  private reset = () => {
    this.form.api.reset();
    this.querySelector("output")!.textContent = "";
  };
  render() {
    return html`<form
      @submit=${(event: SubmitEvent) => {
        event.preventDefault();
        this.form.api.handleSubmit();
      }}
    >
      <acme-v-stack gap="4" align-items="stretch" width="360px" max-width="100%">
        ${this.form.field({ name: "name", validators: { onChange: ({ value }) => (value.length < 2 ? "Use at least two letters." : undefined) } }, (field) => html`<acme-field .invalid=${field.state.meta.isTouched && !field.state.meta.isValid}><span slot="label">Name</span><acme-input name="name" placeholder="Ada Lovelace" ${bindField(field)}></acme-input><span slot="error">${field.state.meta.errors.join(" ")}</span></acme-field>`)}
        ${this.form.field({ name: "email", validators: { onChange: ({ value }) => (/@/.test(value) ? undefined : "Enter an email address.") } }, (field) => html`<acme-field .invalid=${field.state.meta.isTouched && !field.state.meta.isValid}><span slot="label">Email</span><acme-input name="email" type="email" placeholder="ada@example.com" ${bindField(field)}></acme-input><span slot="error">${field.state.meta.errors.join(" ")}</span></acme-field>`)}
        ${this.form.field(
          { name: "plan" },
          (field) =>
            html`<acme-field
              ><span slot="label">Plan</span
              ><acme-select name="plan" ${bindField(field)}
                ><acme-option value="hobby">Hobby</acme-option
                ><acme-option value="pro">Pro</acme-option
                ><acme-option value="enterprise">Enterprise</acme-option></acme-select
              ></acme-field
            >`,
        )}
        ${this.form.field({ name: "updates" }, (field) => html`<acme-switch name="updates" aria-label="Product updates" ${bindField(field)}></acme-switch>`)}
        <acme-h-stack gap="3"
          ><acme-button type="submit" ?disabled=${!this.form.api.state.canSubmit}
            >Submit profile</acme-button
          ><acme-button type="button" variant="secondary" @click=${this.reset}
            >Reset form</acme-button
          ></acme-h-stack
        >
        <output aria-live="polite"></output>
      </acme-v-stack>
    </form>`;
  }
}
export function registerManagedFormExample(): void {
  customElements.define("docs-form-demo", ManagedFormExample);
}
