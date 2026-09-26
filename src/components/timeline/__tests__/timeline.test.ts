import { expect, test } from "bun:test";
import "../../../define/timeline";
import "../../../define/timeline-item";

test("Timeline preserves ordered native content and updates its final connector", async () => {
  document.body.innerHTML =
    '<acme-timeline><acme-timeline-item><time slot="date" datetime="2026-09-23">Today</time><h3 slot="heading">Ordered</h3></acme-timeline-item><acme-timeline-item><h3 slot="heading">Shipped</h3></acme-timeline-item></acme-timeline>';
  const root = document.querySelector("acme-timeline")!,
    items = [...root.querySelectorAll("acme-timeline-item")];
  for (let i = 0; i < 3; i++) {
    await Promise.all([root, ...items].map((el) => el.updateComplete));
  }
  expect(root.shadowRoot!.querySelector("ol")).not.toBeNull();
  expect(items[0].shadowRoot!.querySelector("li")).not.toBeNull();
  expect(items[0].shadowRoot!.querySelector<HTMLElement>("[part=connector]")!.hidden).toBe(false);
  expect(items[1].shadowRoot!.querySelector<HTMLElement>("[part=connector]")!.hidden).toBe(true);
  const time = items[0].querySelector("time");
  root.orientation = "horizontal";
  await root.updateComplete;
  await items[0].updateComplete;
  expect(items[0].querySelector("time")).toBe(time);
  expect(items[0].shadowRoot!.querySelector("li")!.dataset.orientation).toBe("horizontal");
  items[1].remove();
  await root.updateComplete;
  await items[0].updateComplete;
  expect(items[0].shadowRoot!.querySelector<HTMLElement>("[part=connector]")!.hidden).toBe(true);
});
