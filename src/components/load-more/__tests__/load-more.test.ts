import { expect, test } from "bun:test";
import "../../../define/load-more";

test("Load More requests results without submitting or changing loading", async () => {
  const control = document.createElement("acme-load-more");
  document.body.append(control);
  await control.updateComplete;
  const events: unknown[] = [];
  control.addEventListener("acme-request", (event) => events.push((event as CustomEvent).detail));
  control.click();
  expect(events).toEqual([{ action: "load-more" }]);
  expect(control.loading).toBe(false);
  control.loading = true;
  await control.updateComplete;
  control.click();
  expect(events).toHaveLength(1);
  expect(control.shadowRoot!.querySelector("button")!.type).toBe("button");
  control.remove();
});
