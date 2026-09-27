import { expect, test } from "bun:test";
import "../../../all";

test("Password visibility changes native presentation without replacing its value", async () => {
  const el = document.createElement("acme-password-input");
  el.value = "private";
  document.body.append(el);
  await el.updateComplete;
  const input = el.shadowRoot!.querySelector("input")!;
  expect(input.type).toBe("password");
  el.visible = true;
  expect(input.type).toBe("text");
  expect(el.value).toBe("private");
  el.revealable = false;
  await el.updateComplete;
  expect(el.shadowRoot!.querySelector("[part=reveal]")).toBeNull();
  el.remove();
});
