import { expect, test } from "bun:test";
import "../../../all";
test("Browser keeps native authored content and exposes a named presentation frame", async () => {
  const frame = document.createElement("acme-browser"),
    button = document.createElement("button");
  button.textContent = "Preview action";
  frame.label = "Delivery preview";
  frame.address = "https://www.example.com/docs/";
  frame.append(button);
  document.body.replaceChildren(frame);
  await frame.updateComplete;
  expect(frame.shadowRoot!.querySelector("[part=root]")!.getAttribute("aria-label")).toBe("Delivery preview");
  expect(frame.shadowRoot!.querySelector("[part=address]")!.textContent?.trim()).toBe("example.com/docs");
  expect(frame.querySelector("button")).toBe(button);
  expect(frame.shadowRoot!.querySelectorAll("button,acme-icon-button,acme-copy-button").length).toBe(0);
});
test("Browser address is safe text and an omitted label does not fabricate a landmark", async () => {
  const frame = document.createElement("acme-browser");
  frame.address = "<img src=x onerror=bad()>";
  document.body.replaceChildren(frame);
  await frame.updateComplete;
  expect(frame.shadowRoot!.querySelector("img")).toBeNull();
  expect(frame.shadowRoot!.querySelector("[part=address]")!.textContent).toContain("<img");
  expect(frame.shadowRoot!.querySelector("[part=root]")!.hasAttribute("role")).toBe(false);
});
