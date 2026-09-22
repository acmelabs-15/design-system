import { expect, test } from "bun:test";
import "../../../all";
test("Search uses a native search target with a clear action and loading icon", async () => {
  const el = document.createElement("acme-search");
  document.body.append(el);
  await el.updateComplete;
  expect(el.shadowRoot!.querySelector("input")!.type).toBe("search");
  expect(el.clearable).toBe(true);
  expect(el.shadowRoot!.querySelector("acme-search-icon")).not.toBeNull();
  el.loading = true;
  await el.updateComplete;
  expect(el.shadowRoot!.querySelector("acme-spinner")).not.toBeNull();
  expect(el.shadowRoot!.querySelector("input")!.getAttribute("aria-busy")).toBe("true");
  el.setAttribute("clearable", "false");
  await el.updateComplete;
  expect(el.shadowRoot!.querySelector("[part=clear]")).toBeNull();
  el.remove();
});
