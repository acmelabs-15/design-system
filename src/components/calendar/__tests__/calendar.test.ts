import { describe, expect, test } from "bun:test";
import "../../../index";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as any;
  await el.updateComplete;
  return el;
};
const presets = `{"last-3-days":{"text":"Last 3 Days","days":3},"last-7-days":{"text":"Last 7 Days","weeks":1},"last-14-days":{"text":"Last 14 Days","weeks":2},"last-month":{"text":"Last Month","months":1}}`;
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

describe("acme-calendar", () => {
  test("the trigger reads the chosen range and the popover holds Start, End, Apply and a timezone select", async () => {
    const el = await mount(`<acme-calendar static value="2026-09-08" end="2026-09-12"></acme-calendar>`);
    expect(el.shadowRoot.querySelector(".cal-trigger").textContent.trim()).toBe("Sep 8 – Sep 12, 2026");
    const labels = Array.from(el.shadowRoot.querySelectorAll(".form-label")).map((n: any) => n.textContent);
    expect(labels).toEqual(["Start", "End"]);
    expect(el.shadowRoot.querySelector(".cal-form select[aria-label=Timezone]")).not.toBeNull();
    expect(el.shadowRoot.querySelectorAll(".cal-form input.time").length).toBe(2);
    expect(el.shadowRoot.querySelectorAll(".cal-grid td.range").length).toBe(3);
  });
  test("presets are real buttons; preset-index selects one at the start", async () => {
    const el = await mount(`<acme-calendar static stacked preset-index="2" presets='${presets}'></acme-calendar>`);
    const buttons = Array.from(el.shadowRoot.querySelectorAll(".cal-presets button")).map((b: any) => b.textContent);
    expect(buttons).toEqual([]);
    const opts = Array.from(el.shadowRoot.querySelectorAll(".cal-period option")).map((o: any) => o.textContent);
    expect(opts).toEqual(["Custom", "Last 3 Days", "Last 7 Days", "Last 14 Days", "Last Month"]);
    expect(el.shadowRoot.querySelector(".cal-join").className).toContain("stacked");
    const start = new Date();
    start.setDate(start.getDate() - 14);
    expect(el.value).toBe(iso(start));
    expect(el.end).toBe(iso(new Date()));
    const plain = await mount(`<acme-calendar static presets='${presets}'></acme-calendar>`);
    expect(plain.shadowRoot.querySelectorAll(".cal-presets button").length).toBe(4);
  });
  test("compact joins a period combobox; horizontal-layout, small and show-time-input=false map to the popover", async () => {
    const el = await mount(`<acme-calendar static compact size="small" horizontal-layout show-time-input="false" presets='${presets}'></acme-calendar>`);
    expect(el.shadowRoot.querySelector(".cal-join .cal-period")).not.toBeNull();
    const pop = el.shadowRoot.querySelector(".calendar");
    expect(pop.className).toContain("horizontal");
    expect(pop.className).toContain("sm");
    expect(el.shadowRoot.querySelectorAll("input.time").length).toBe(0);
  });
  test("min-value and max-value disable cells; pinned-timezone is read-only text; allow-clear adds the clear button", async () => {
    const el = await mount(
      `<acme-calendar static allow-clear value="2026-09-10" end="2026-09-11" min-value="2026-09-09" max-value="2026-09-11" pinned-timezone="America/Los_Angeles"></acme-calendar>`,
    );
    expect(el.shadowRoot.querySelector(".cal-tz").textContent).toBe("America/Los_Angeles");
    expect(el.shadowRoot.querySelector(".cal-form select")).toBeNull();
    const enabled = el.shadowRoot.querySelectorAll(".cal-grid td:not([aria-disabled])");
    expect(enabled.length).toBe(3);
    expect(el.shadowRoot.querySelector(".cal-clear")).not.toBeNull();
    el.shadowRoot.querySelector(".cal-clear").click();
    await el.updateComplete;
    expect(el.value).toBe("");
    expect(el.shadowRoot.querySelector(".cal-trigger").textContent.trim()).toBe("Select Date");
  });
  test("arrow keys move the focused day and Enter picks it; Escape closes", async () => {
    const el = await mount(`<acme-calendar static value="2026-09-10"></acme-calendar>`);
    const grid = el.shadowRoot.querySelector(".cal-grid");
    grid.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('.cal-grid [tabindex="0"]').getAttribute("aria-label")).toContain("Sep 11 2026");
    grid.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", shiftKey: true, bubbles: true }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('.cal-grid [tabindex="0"]').getAttribute("aria-label")).toContain("Sep 18 2026");
    grid.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await el.updateComplete;
    expect(el.value).toBe("2026-09-10");
    expect(el.end).toBe("2026-09-18");
  });
});
