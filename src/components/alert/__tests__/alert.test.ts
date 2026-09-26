import { expect, test } from "bun:test";
import "../../../define/alert";
import "../../../define/banner";

test("Alert and Banner share status inputs without an automatic live role", () => {
  for (const tag of ["acme-alert", "acme-banner"] as const) {
    const element = document.createElement(tag);
    expect(element.variant).toBe("default");
    expect(element.size).toBe("medium");
    expect(element.dismissible).toBe(false);
    expect(element.role).toBeNull();
    expect(() => {
      element.variant = "unknown" as never;
    }).toThrow();
  }
});
test("removing heading restores the documented empty string", () => {
  const alert = document.createElement("acme-alert");
  alert.setAttribute("heading", "Message");
  alert.removeAttribute("heading");
  expect(alert.heading).toBe("");
});
