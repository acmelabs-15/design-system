import { expect, test } from "bun:test";
import "../../../all";

test("Textarea carries multiline constraints and separate reset state", async () => {
  const el = document.createElement("acme-textarea");
  el.setAttribute("value", "first");
  document.body.append(el);
  await el.updateComplete;
  const native = el.shadowRoot!.querySelector("textarea")!;
  expect(native.getAttribute("rows")).toBe("3");
  el.rows = 5;
  el.wrap = "hard";
  expect(native.getAttribute("rows")).toBe("5");
  expect(native.wrap).toBe("hard");
  el.value = "second";
  expect(native.value).toBe("second");
  expect(el.defaultValue).toBe("first");
  el.formResetCallback();
  expect(el.value).toBe("first");
  expect(() => {
    el.rows = 0;
  }).toThrow();
  el.remove();
});
test("Textarea editing and disabled state use the canonical native contract", async () => {
  const el = document.createElement("acme-textarea");
  document.body.append(el);
  await el.updateComplete;
  let edits = 0;
  el.addEventListener("acme-input", () => edits++);
  const native = el.shadowRoot!.querySelector("textarea")!;
  native.value = "edit";
  native.dispatchEvent(new Event("input"));
  expect(el.value).toBe("edit");
  expect(edits).toBe(1);
  el.disabled = true;
  native.value = "ignored";
  native.dispatchEvent(new Event("input"));
  expect(el.value).toBe("edit");
  expect(edits).toBe(1);
  el.remove();
});

test("removing configuration attributes restores defaults", async () => {
  const el = document.createElement("acme-textarea");
  el.setAttribute("rows", "7");
  el.setAttribute("wrap", "hard");
  el.setAttribute("resize", "both");
  document.body.append(el);
  await el.updateComplete;
  for (const attr of ["rows", "wrap", "resize"]) {
    el.removeAttribute(attr);
  }
  expect(el.rows).toBe(3);
  expect(el.wrap).toBe("soft");
  expect(el.resize).toBe("vertical");
  el.remove();
});
