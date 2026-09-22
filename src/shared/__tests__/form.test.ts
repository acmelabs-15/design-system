import { describe, expect, test } from "bun:test";
import { html, LitElement } from "lit";
import "../../all";
import { bindField, TanStackFormController } from "../../index.ts";

class TestForm extends LitElement {
  form = new TanStackFormController(this, { defaultValues: { name: "", agree: false } });
  render() {
    return html`${this.form.field({ name: "name", validators: { onChange: ({ value }) => (value.length < 2 ? "Too short." : undefined) } }, (f) => html`<acme-input ${bindField(f)}></acme-input>`)}${this.form.field(
      { name: "agree" },
      (f) => html`<acme-switch ${bindField(f)}></acme-switch>`,
    )}`;
  }
}
customElements.define("test-form", TestForm);

const tick = () => new Promise((r) => setTimeout(r, 0));

describe("bindField", () => {
  test("pushes input events into the field and invalid presentation back into the control", async () => {
    document.body.innerHTML = "<test-form></test-form>";
    const host = document.body.firstElementChild as TestForm;
    await host.updateComplete;
    const input = host.shadowRoot!.querySelector("acme-input") as HTMLElement & { value: string; invalid: boolean };
    expect(input.value).toBe("");
    input.dispatchEvent(new CustomEvent("acme-input", { detail: { value: "A" }, bubbles: true }));
    input.dispatchEvent(new FocusEvent("focusout"));
    await tick();
    await host.updateComplete;
    expect(host.form.api.getFieldValue("name")).toBe("A");
    expect(input.invalid).toBe(true);
    input.dispatchEvent(new CustomEvent("acme-input", { detail: { value: "Ada" }, bubbles: true }));
    await tick();
    await host.updateComplete;
    expect(input.invalid).toBe(false);
  });

  test("binds booleans to checked", async () => {
    document.body.innerHTML = "<test-form></test-form>";
    const host = document.body.firstElementChild as TestForm;
    await host.updateComplete;
    const toggle = host.shadowRoot!.querySelector("acme-switch") as HTMLElement & { checked: boolean };
    expect(toggle.checked).toBe(false);
    toggle.dispatchEvent(new CustomEvent("acme-change", { detail: { checked: true }, bubbles: true }));
    await tick();
    expect(host.form.api.getFieldValue("agree")).toBe(true);
  });
});

test("binding observes field updates, releases on disconnect and resubscribes", async () => {
  document.body.innerHTML = "<test-form></test-form>";
  const host = document.body.firstElementChild as TestForm;
  await host.updateComplete;
  await tick();
  const input = host.shadowRoot!.querySelector("acme-input")!;
  host.form.api.setFieldValue("name", "Direct");
  expect(input.value).toBe("Direct");
  host.remove();
  host.form.api.setFieldValue("name", "Detached");
  expect(input.value).toBe("Direct");
  document.body.append(host);
  await tick();
  await host.updateComplete;
  expect(host.shadowRoot!.querySelector("acme-input")!.value).toBe("Detached");
  host.form.api.reset();
  expect(host.shadowRoot!.querySelector("acme-input")!.value).toBe("");
  host.remove();
});
