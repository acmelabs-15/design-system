import { expect, test } from "bun:test";
import "../../../all";
test("Field validates presentation flags and does not own a form value", async () => {
  const field = document.createElement("acme-field");
  field.innerHTML = '<span slot="label">Option</span><acme-checkbox></acme-checkbox><span slot="help">Help</span>';
  document.body.append(field);
  await field.updateComplete;
  await field.querySelector("acme-checkbox")!.updateComplete;
  expect(field.orientation).toBe("vertical");
  expect("value" in field).toBe(false);
  field.required = true;
  expect(() => (field.optional = true)).toThrow();
  field.required = false;
  field.optional = true;
  expect(field.optional).toBe(true);
  field.remove();
});
