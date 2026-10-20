import { html, LitElement } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { TanStackFormController, bindField } from "@acmelabs/design-system";
import "@acmelabs/design-system/define/field";
import "@acmelabs/design-system/define/box";
import "@acmelabs/design-system/define/input";
import "@acmelabs/design-system/define/select";
import "@acmelabs/design-system/define/option";
import "@acmelabs/design-system/define/switch";
import "@acmelabs/design-system/define/button";
import "@acmelabs/design-system/define/v-stack";
import "@acmelabs/design-system/define/h-stack";

/** A managed profile form with a local submission receipt. */
export class ManagedFormExample extends LitElement {
  private nextContact = 2;
  private disabled = false;
  private form = new TanStackFormController(this, {
    defaultValues: { profile: { name: "" }, contacts: [{ id: "contact-1", email: "" }], plan: "hobby", updates: true },
    onSubmit: ({ value }) => {
      this.querySelector("output")!.textContent = JSON.stringify(value);
    },
  });
  createRenderRoot() {
    return this;
  }
  private reset = (event: Event) => {
    event.preventDefault();
    this.form.api.reset();
    this.querySelector("output")!.textContent = "";
  };
  render() {
    return html`<acme-button type="button" variant="secondary" @click=${() => {
      this.disabled = !this.disabled;
      this.requestUpdate();
    }}>${this.disabled ? "Enable fields" : "Disable fields"}</acme-button><form aria-label="Profile" @reset=${this.reset}
      @submit=${(event: SubmitEvent) => {
        event.preventDefault();
        void this.form.api.handleSubmit();
      }}
    >
      <acme-v-stack gap="4" align-items="stretch" width="360px" max-width="100%">
        ${this.form.field({ name: "profile.name", validators: { onChange: ({ value }) => (value.trim().length < 2 ? "Use at least two letters." : undefined) } }, (field) => html`<acme-field required .invalid=${field.state.meta.isTouched && !field.state.meta.isValid}><span slot="label">Name</span><acme-input name="profile.name" required ?disabled=${this.disabled} placeholder="Ada Lovelace" ${bindField(field)}></acme-input><span slot="error">${field.state.meta.errors.join(" ")}</span></acme-field>`)}
        ${this.form.field(
          { name: "contacts" },
          (contacts) => html`<acme-v-stack gap="3" align-items="stretch">
          ${repeat(
            contacts.state.value,
            (_contact, index) => index,
            (_contact, index) => html`<acme-h-stack gap="2" align-items="start"><acme-box flex-grow="1" flex-shrink="1" flex-basis="0%" min-width="0">
            ${this.form.field({ name: `contacts[${index}].email`, validators: { onChange: ({ value }) => (/.+@.+\..+/.test(value) ? undefined : "Enter an email address.") } }, (field) => html`<acme-field required .invalid=${field.state.meta.isTouched && !field.state.meta.isValid}><span slot="label">Contact ${index + 1}</span><acme-input .name=${field.name} type="email" required ?disabled=${this.disabled} ${bindField(field)}></acme-input><span slot="error">${field.state.meta.errors.join(" ")}</span></acme-field>`)}
            </acme-box><acme-box flex-shrink="0"><acme-button type="button" variant="secondary" ?disabled=${this.disabled} aria-label=${`Remove contact ${index + 1}`} @click=${() => contacts.removeValue(index)}>Remove</acme-button></acme-box>
          </acme-h-stack>`,
          )}
          <acme-button type="button" variant="secondary" ?disabled=${this.disabled} @click=${() => contacts.pushValue({ id: `contact-${this.nextContact++}`, email: "" })}>Add contact</acme-button>
        </acme-v-stack>`,
        )}

        ${this.form.field(
          { name: "plan" },
          (field) =>
            html`<acme-field
              ><span slot="label">Plan</span
              ><acme-select name="plan" ?disabled=${this.disabled} ${bindField(field)}
                ><acme-option value="hobby">Hobby</acme-option
                ><acme-option value="pro">Pro</acme-option
                ><acme-option value="enterprise">Enterprise</acme-option></acme-select
              ></acme-field
            >`,
        )}
        ${this.form.field({ name: "updates" }, (field) => html`<acme-switch name="updates" ?disabled=${this.disabled} aria-label="Product updates" ${bindField(field)}></acme-switch>`)}
        <acme-h-stack gap="3"
          ><acme-button type="submit" ?disabled=${this.disabled}
            >Submit profile</acme-button
          ><acme-button type="reset" variant="secondary"
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
