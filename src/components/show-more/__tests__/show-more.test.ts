import { expect, test } from "bun:test";
import "../../../define/show-more";

test("Show More has one expansion event and silent programmatic writes", async () => {
  const control = document.createElement("acme-show-more");
  document.body.append(control);
  await control.updateComplete;
  const events: boolean[] = [];
  control.addEventListener("acme-expanded-change", (event) => events.push((event as CustomEvent).detail.expanded));
  control.click();
  await control.updateComplete;
  expect(control.expanded).toBe(true);
  expect(events).toEqual([true]);
  control.expanded = false;
  control.loading = true;
  await control.updateComplete;
  control.click();
  expect(events).toEqual([true]);
  expect(control.shadowRoot!.querySelector("button")!.getAttribute("aria-expanded")).toBe("false");
  control.remove();
});
