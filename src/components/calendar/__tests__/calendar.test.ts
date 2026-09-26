import { describe, expect, test } from "bun:test";
import "../../../all";
import { parseTime } from "../../../shared/date";
import type { AcmeCalendar } from "../calendar";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.querySelector("acme-calendar") as AcmeCalendar;
  await el.updateComplete;
  return el;
};
describe("Calendar canonical date control", () => {
  test("range owns one form value and incomplete required ranges are invalid", async () => {
    const el = await mount('<form><acme-calendar presentation="inline" show-time-input="false" name="dates" required></acme-calendar></form>');
    el.value = { start: "2026-09-10" };
    await el.updateComplete;
    expect(el.checkValidity()).toBe(false);
    el.value = { start: "2026-09-10", end: "2026-09-12" };
    await el.updateComplete;
    expect(el.checkValidity()).toBe(true);
    expect(el.value).toEqual({ start: "2026-09-10", end: "2026-09-12" });
  });
  test("single day click commits and programmatic values remain silent", async () => {
    const el = await mount('<acme-calendar mode="single" presentation="inline" show-time-input="false"></acme-calendar>');
    const events: string[] = [];
    el.addEventListener("acme-input", () => events.push("input"));
    el.addEventListener("acme-change", () => events.push("change"));
    el.value = "2026-09-10";
    await el.updateComplete;
    expect(events).toEqual([]);
    (el.shadowRoot!.querySelector('[data-date="2026-09-11"]') as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.value).toBe("2026-09-11");
    expect(events).toEqual(["input", "change"]);
  });
  test("day navigation clamps across month ends without changing value", async () => {
    const el = await mount('<acme-calendar mode="single" presentation="inline" show-time-input="false"></acme-calendar>');
    el.value = "2026-01-31";
    await el.updateComplete;
    el.shadowRoot!.querySelector('[data-date="2026-01-31"]')!.dispatchEvent(new KeyboardEvent("keydown", { key: "PageDown", bubbles: true }));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('[data-date][tabindex="0"]')!.getAttribute("data-date")).toBe("2026-02-28");
    expect(el.value).toBe("2026-01-31");
  });
  test("time values preserve the instant and reject invalid dates", async () => {
    const el = await mount('<acme-calendar mode="single" presentation="inline" time-zone="UTC"></acme-calendar>');
    el.value = "2026-09-22T00:30:00-03:30";
    await el.updateComplete;
    expect(parseTime((el.shadowRoot!.querySelector('[data-time="start"]') as HTMLInputElement).value).toString()).toBe("04:00:00");
    expect(() => {
      el.value = "2026-09-00T00:00:00Z";
    }).toThrow();
  });
});
test("Calendar HTML values work independently of configuration attribute order", async () => {
  for (const markup of [
    '<acme-calendar value="2026-09-10" mode="single" show-time-input="false" presentation="inline"></acme-calendar>',
    '<acme-calendar mode="single" show-time-input="false" value="2026-09-10" presentation="inline"></acme-calendar>',
  ]) {
    const root = await mount(markup);
    expect(root.value).toBe("2026-09-10");
    expect(root.defaultValue).toBe("2026-09-10");
  }
});
test("value-first configuration preserves the supplied Calendar selection", async () => {
  const root = document.createElement("acme-calendar");
  root.value = "2026-09-10";
  root.mode = "single";
  root.showTimeInput = false;
  root.presentation = "inline";
  document.body.append(root);
  await root.updateComplete;
  expect(root.value).toBe("2026-09-10");
  expect(root.validity.valid).toBe(true);
});
test("civil-date formatting preserves a day skipped by a time zone", async () => {
  const root = await mount('<acme-calendar mode="single" show-time-input="false" locale="en-US" time-zone="Pacific/Apia" value="2011-12-30"></acme-calendar>');
  expect(root.shadowRoot!.querySelector("[part=trigger]")!.textContent).toContain("Dec 30, 2011");
  expect(root.value).toBe("2011-12-30");
});
test("removing presentation, size and presets restores their defaults", async () => {
  const root = await mount('<acme-calendar mode="single" show-time-input="false" presentation="inline" size="small" presets=\'[{"label":"Day","value":"2026-09-10"}]\'></acme-calendar>');
  root.removeAttribute("presentation");
  root.removeAttribute("size");
  root.removeAttribute("presets");
  await root.updateComplete;
  expect(root.presentation).toBe("popover");
  expect(root.size).toBe("medium");
  expect(root.presets).toEqual([]);
});
test("initial configuration does not dirty an unchanged default value", async () => {
  const root = await mount('<acme-calendar value="2026-09-10" mode="single" show-time-input="false" presentation="inline"></acme-calendar>');
  root.setAttribute("value", "2026-09-12");
  expect(root.value).toBe("2026-09-12");
  root.value = "2026-09-13";
  root.setAttribute("value", "2026-09-14");
  expect(root.value).toBe("2026-09-13");
  root.formResetCallback();
  expect(root.value).toBe("2026-09-14");
});
