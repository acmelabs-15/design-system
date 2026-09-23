import { afterEach, expect, test } from "bun:test";
import "../../../all";
import type { AcmeRelativeTime } from "../relative-time";
afterEach(() => document.body.replaceChildren());
const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const element = document.querySelector("acme-relative-time") as AcmeRelativeTime;
  await element.updateComplete;
  return element;
};
test("zero is a valid instant and no card or invented trigger is rendered", async () => {
  const element = await mount('<acme-relative-time date="0" auto-update="false"></acme-relative-time>');
  const time = element.shadowRoot!.querySelector("time")!;
  expect(time.dateTime).toBe("1970-01-01T00:00:00.000Z");
  expect(time.textContent).not.toBe("");
  expect(element.shadowRoot!.querySelector("button, [role=button], [tabindex]")).toBeNull();
  expect(element.autoUpdate).toBe(false);
  expect(typeof (element as unknown as { update: unknown }).update).toBe("function");
  expect(typeof element.style.setProperty).toBe("function");
});
test("date inputs normalize to owned instants and future values remain future", async () => {
  const element = await mount('<acme-relative-time locale="en-US" auto-update="false"></acme-relative-time>');
  const date = new Date(Date.now() + 120000);
  element.date = date;
  date.setTime(0);
  await element.updateComplete;
  expect(typeof element.date).toBe("number");
  expect(Number(element.date)).toBeGreaterThan(Date.now());
  expect(element.shadowRoot!.textContent).toContain("in 2 minutes");
});
test("invalid dates render no fabricated time and recover on valid input", async () => {
  const element = await mount('<acme-relative-time date="not-a-date" auto-update="false"></acme-relative-time>');
  expect(element.shadowRoot!.querySelector("time")).toBeNull();
  element.date = "2026-09-21";
  await element.updateComplete;
  expect(element.shadowRoot!.querySelector("time")?.dateTime).toBe("2026-09-21T00:00:00.000Z");
});
