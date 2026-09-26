import { expect, test } from "bun:test";
import "../../../all";

test("Fieldset preserves native legend/control nodes and synchronizes its own flags", async () => {
  const element = document.createElement("acme-fieldset"),
    legend = document.createElement("legend"),
    input = document.createElement("input");
  legend.slot = "legend";
  legend.textContent = "Settings";
  element.append(legend, input);
  document.body.append(element);
  await element.updateComplete;
  const native = element.querySelector("fieldset")!;
  expect(native.contains(legend)).toBe(true);
  expect(input.parentNode).toBe(native);
  element.disabled = true;
  expect(native.disabled).toBe(true);
  expect(input.disabled).toBe(false);
  element.invalid = true;
  expect(native.getAttribute("aria-invalid")).toBe("true");
  expect("heading" in element).toBe(false);
  expect("variant" in element).toBe(false);
  element.remove();
});
