import { describe, expect, test } from "bun:test";
import { html, LitElement } from "lit";
import "../../index.ts";
import { bindField, TanStackFormController } from "../../index.ts";

class TestForm extends LitElement {
  form = new TanStackFormController(this, { defaultValues: { name: "", agree: false } });
  render() {
    return html`${this.form.field({ name: "name", validators: { onChange: ({ value }) => (value.length < 2 ? "Too short." : undefined) } }, (f) => html`<acme-input ${bindField(f)}></acme-input>`)}${this.form.field(
      { name: "agree" },
      (f) => html`<acme-toggle ${bindField(f)}></acme-toggle>`,
    )}`;
  }
}
customElements.define("test-form", TestForm);

const tick = () => new Promise((r) => setTimeout(r, 0));

describe("bindField", () => {
  test("pushes input events into the field and errors back into the element", async () => {
    document.body.innerHTML = "<test-form></test-form>";
    const host = document.body.firstElementChild as TestForm;
    await host.updateComplete;
    const input = host.shadowRoot!.querySelector("acme-input") as HTMLElement & { value: string; error: string };
    expect(input.value).toBe("");
    input.dispatchEvent(new CustomEvent("acme-input", { detail: { value: "A" }, bubbles: true }));
    input.dispatchEvent(new Event("blur"));
    await tick();
    await host.updateComplete;
    expect(host.form.api.getFieldValue("name")).toBe("A");
    expect(input.error).toBe("Too short.");
    input.dispatchEvent(new CustomEvent("acme-input", { detail: { value: "Ada" }, bubbles: true }));
    await tick();
    await host.updateComplete;
    expect(input.error).toBe("");
  });

  test("binds booleans to checked", async () => {
    document.body.innerHTML = "<test-form></test-form>";
    const host = document.body.firstElementChild as TestForm;
    await host.updateComplete;
    const toggle = host.shadowRoot!.querySelector("acme-toggle") as HTMLElement & { checked: boolean };
    expect(toggle.checked).toBe(false);
    toggle.dispatchEvent(new CustomEvent("acme-change", { detail: { checked: true }, bubbles: true }));
    await tick();
    expect(host.form.api.getFieldValue("agree")).toBe(true);
  });
});
