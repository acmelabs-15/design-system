import { expect, test } from "bun:test";
import "../../../define/alert-dialog";

test("removing an explicit default or override preserves Alert Dialog outside-dismissal policy", async () => {
  const el = document.createElement("acme-alert-dialog");
  document.body.append(el);
  await el.updateComplete;
  for (const value of ["false", "true"]) {
    el.setAttribute("close-on-outside", value);
    await el.updateComplete;
    el.removeAttribute("close-on-outside");
    await el.updateComplete;
    expect(el.closeOnOutside).toBe(false);
  }
  el.remove();
});
