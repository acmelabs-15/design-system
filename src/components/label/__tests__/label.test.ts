import { expect, test } from "bun:test";
import "../../../all";
test("Label retains real label content and follows its for input", async () => {
  const label = document.createElement("acme-label"),
    text = document.createTextNode("Email address");
  label.for = "email:id";
  label.append(text);
  document.body.append(label);
  await label.updateComplete;
  const native = label.querySelector("label")!;
  expect(native.htmlFor).toBe("email:id");
  expect(native.firstChild).toBe(text);
  expect("value" in label).toBe(false);
  label.for = undefined;
  expect(native.hasAttribute("for")).toBe(false);
  label.remove();
});
test("removing for restores implicit labeling rather than an empty for attribute", async () => {
  const label = document.createElement("acme-label");
  label.setAttribute("for", "old");
  label.innerHTML = "<input>";
  document.body.append(label);
  await label.updateComplete;
  label.removeAttribute("for");
  expect(label.for).toBeUndefined();
  expect(label.querySelector("label")!.hasAttribute("for")).toBe(false);
  label.remove();
});
