import { afterEach, expect, test } from "bun:test";
import { html, LitElement, nothing, render } from "lit";
import type { ResponsiveInput } from "../responsive";
import type { StyleInputs } from "../style-input-binding";
import { StyleInputController } from "../style-input-controller";
import { styleInputs } from "../style-inputs";

class HelperHost extends LitElement {
  readonly inputs = new StyleInputController(this, ["padding", "paddingInline", "backgroundColor"], { supports: () => true });
  get padding() {
    return this.inputs.get("padding");
  }
  set padding(value: ResponsiveInput<string | number>) {
    this.inputs.set("padding", value);
  }
  get backgroundColor() {
    return this.inputs.get("backgroundColor");
  }
  set backgroundColor(value: ResponsiveInput<string>) {
    this.inputs.set("backgroundColor", value);
  }
  render() {
    return html`${JSON.stringify(this.inputs.entries.get())}`;
  }
}
customElements.define("style-helper-test", HelperHost);
afterEach(() => {
  document.body.replaceChildren();
});
const container = () => {
  const element = document.createElement("div");
  document.body.append(element);
  return element;
};
const view = (inputs: StyleInputs) => html`<style-helper-test ${styleInputs(inputs)}></style-helper-test>`;

test("accepts only element expressions", () => {
  expect(() => render(html`<div title=${styleInputs({ padding: 2 })}></div>`, container())).toThrow("element expression");
  expect(() => render(html`${styleInputs({ padding: 2 })}`, container())).toThrow("element expression");
});

test("reasserts the same object on every helper render and keeps unrelated settings", async () => {
  const root = container();
  const inputs = { paddingInline: 2, padding: 4 };
  render(view(inputs), root);
  const element = root.firstElementChild as HelperHost;
  expect(element.inputs.entries.get()).toEqual([
    ["paddingInline", 2],
    ["padding", 4],
  ]);
  element.padding = 8;
  element.backgroundColor = "red";
  render(view(inputs), root);
  expect(root.firstElementChild).toBe(element);
  expect(element.padding).toBe(4);
  expect(element.backgroundColor).toBe("red");
  inputs.padding = 6;
  render(view(inputs), root);
  await element.updateComplete;
  expect(element.padding).toBe(6);
  expect(element.shadowRoot?.textContent).toBe(
    JSON.stringify([
      ["backgroundColor", "red"],
      ["paddingInline", 2],
      ["padding", 6],
    ]),
  );
});

test("key removal and explicit empty input clear only the same helper's supplied keys", () => {
  const root = container();
  render(view({ padding: 4, paddingInline: 2 }), root);
  const element = root.firstElementChild as HelperHost;
  element.backgroundColor = "blue";
  render(view({ paddingInline: 3 }), root);
  expect(element.padding).toBeUndefined();
  expect(element.inputs.entries.get()).toEqual([
    ["backgroundColor", "blue"],
    ["paddingInline", 3],
  ]);
  render(view({}), root);
  expect(element.inputs.entries.get()).toEqual([["backgroundColor", "blue"]]);
});

test("temporary detach and complete element removal do not clear authored inputs", async () => {
  const root = container();
  render(view({ padding: 4 }), root);
  const element = root.firstElementChild as HelperHost;
  await element.updateComplete;
  root.remove();
  expect(element.padding).toBe(4);
  document.body.append(root);
  await element.updateComplete;
  expect(element.padding).toBe(4);
  render(nothing, root);
  expect(element.padding).toBe(4);
  document.body.append(element);
  await element.updateComplete;
  expect(element.padding).toBe(4);
});

test("a replacement helper on a retained element does not inherit a removed helper's claims", () => {
  const root = container();
  const optional = (inputs: StyleInputs | undefined) => html`<style-helper-test ${inputs === undefined ? nothing : styleInputs(inputs)}></style-helper-test>`;
  render(optional({ padding: 4 }), root);
  const element = root.firstElementChild as HelperHost;
  render(optional(undefined), root);
  expect(root.firstElementChild).toBe(element);
  expect(element.padding).toBe(4);
  render(optional({}), root);
  expect(root.firstElementChild).toBe(element);
  expect(element.padding).toBe(4);
  render(optional({ padding: 6 }), root);
  render(optional({}), root);
  expect(element.padding).toBeUndefined();
});

test("keeps grammar-invalid authored CSS for the native declaration planner", () => {
  const root = container();
  render(view({ padding: 4 }), root);
  const element = root.firstElementChild as HelperHost;
  render(view({ padding: "not-a-padding-value", backgroundColor: "blue" }), root);
  expect(element.padding).toBe("not-a-padding-value");
  expect(element.backgroundColor).toBe("blue");
});
